import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { CompactBarInfo } from '../types'
import {
  BOXES,
  DEFAULT_THRESHOLD,
  FIVE_MIN,
  ONE_HOUR,
  cacheLeft,
  fmtTokens,
  hitRateOf,
  meter,
  meterColor,
  splitSummary,
  ttlSeen,
  weatherOf,
} from './logic'

const INITIAL: CompactBarInfo = {
  lastResponseAt: null,
  ttlMs: ONE_HOUR,
  ttlSource: 'guess',
  hitRate: null,
  contextPercent: null,
  thresholdPercent: DEFAULT_THRESHOLD,
}

const info = atom({ plugin: 'compact-bar', key: 'info' } as const, INITIAL)
const collapsed = atom({ plugin: 'compact-bar', key: 'collapsed' } as const, false)
const tick = atom({ plugin: 'compact-bar', key: 'tick' } as const, 0)
const isWorking = atom({ plugin: 'compact-bar', key: 'isWorking' } as const, false)
const pending = atom({ plugin: 'compact-bar', key: 'pending' } as const, false)

const STORE_COLLAPSED = 'collapsed'

type $ = EngineInterface

/** The auto-compact threshold as a percent of the window, or 83 when it cannot be read. */
async function thresholdOf($: $): Promise<number> {
  try {
    const override = Number(await $.env.get('CLAUDE_AUTOCOMPACT_PCT_OVERRIDE'))
    if (override > 0 && override <= 100) return override
    const usage = await $.session.usage({ breakdown: 'summary' })
    const b = usage.context.breakdown
    if (b?.autoCompactThreshold && b.rawMaxTokens > 0) {
      return Math.round((b.autoCompactThreshold / b.rawMaxTokens) * 100)
    }
  } catch {
    // fall through to the default
  }
  return DEFAULT_THRESHOLD
}

async function setTtl($: $, ttl: '5m' | '1h') {
  await update($, info, i => ({ ...i, ttlMs: ttl === '1h' ? ONE_HOUR : FIVE_MIN, ttlSource: 'hook' as const }))
}

/** Runs /compact now. If the engine refuses the direct call (the Desktop app), puts /compact in the prompt box. */
async function runCompact($: $) {
  try {
    await $.command.run({ command: 'compact' })
  } catch {
    try {
      await $.prompt.fill({ text: '/compact', mode: 'replace' })
      $.ui.log('compact-bar: /compact is in the prompt box. Press Enter to compact.')
    } catch {
      $.ui.log('compact-bar: could not start /compact. Type /compact yourself.')
    }
  }
}

/** Compacts now when idle; while Claude works, queues it to run the moment the turn ends. */
export async function compactNow($: $, working: boolean) {
  if (working) {
    await update($, pending, () => true)
    return
  }
  await runCompact($)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const r = await next(e)
    try {
      const now = await $.clock.now()
      await update($, tick, () => now)
      await update($, collapsed, () => false)
      if ((await $.store.get(STORE_COLLAPSED)) === true) await update($, collapsed, () => true)
      const usage = await $.session.usage()
      const threshold = await thresholdOf($)
      // A subscription reports rate-limit windows; Claude Code caches for an hour there.
      const guess = usage.rateLimits.length > 0 ? ONE_HOUR : FIVE_MIN
      await update($, info, i => ({
        ...i,
        thresholdPercent: threshold,
        contextPercent: usage.context.percent ?? i.contextPercent,
        ttlMs: i.ttlSource === 'guess' ? guess : i.ttlMs,
      }))
      $.clock.every(60000, () => {
        void $.clock.now().then(t => update($, tick, () => t))
      })
    } catch {
      // the bar draws from its defaults
    }
    return r
  })

  on('classic.PreModelSwitch', async ($, e, next) => {
    await setTtl($, e.cache_ttl)
    return next(e)
  }).catch(($, e, next) => next(e))
  on('classic.PostModelSwitch', async ($, e, next) => {
    await setTtl($, e.cache_ttl)
    return next(e)
  }).catch(($, e, next) => next(e))

  on('turn.start', async ($, e, next) => {
    await update($, isWorking, () => true)
    return next(e)
  })

  on('turn.step', async function* ($, e, next) {
    const r = yield* next(e)
    if (e.agentId === undefined && r.usage) {
      const u = r.usage
      const now = await $.clock.now()
      await update($, info, i => {
        const seen = i.lastResponseAt === null || i.ttlSource === 'hook' ? null : ttlSeen(now - i.lastResponseAt, u)
        return {
          ...i,
          lastResponseAt: now,
          hitRate: hitRateOf(u),
          ttlMs: seen ?? i.ttlMs,
          ttlSource: seen ? 'seen' : i.ttlSource,
        }
      })
      await update($, tick, () => now)
    }
    return r
  })

  on('turn.complete', async ($, e, next) => {
    const r = await next(e)
    if (e.agentId !== undefined) return r
    await update($, isWorking, () => false)
    if (await read($, pending)) {
      await update($, pending, () => false)
      void runCompact($)
      return r
    }
    try {
      const usage = await $.session.usage()
      const threshold = await thresholdOf($)
      await update($, info, i => ({
        ...i,
        contextPercent: usage.context.percent ?? i.contextPercent,
        thresholdPercent: threshold,
      }))
    } catch {
      // keep the last figures
    }
    return r
  })

  on('session.compact', async ($, e, next) => {
    const r = await next(e)
    if (e.agentId !== undefined || r.skip !== undefined || e.trigger === 'precompute') return r
    await update($, info, i => ({ ...i, contextPercent: null }))
    if (e.trigger === 'auto') return r
    const summary = r.messages.find(m => m.text.trim().length > 0)?.text ?? ''
    $.ui.log(
      `Compacted: ${fmtTokens(r.tokensBefore)} → ${fmtTokens(r.tokensAfter)} tokens. Claude continues from this summary:`,
    )
    for (const piece of splitSummary(summary)) $.ui.log(piece)
    return r
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const rest = await next(e)
    if (e.props.hasSurvey) return rest
    const { Box, Text, Button } = $.ui.resolve(e)
    const bar = await read($, info)
    const isCollapsed = await read($, collapsed)
    await read($, tick)
    const now = await $.clock.now()
    const working = e.props.isWorking
    const isPending = await read($, pending)
    const compactLabel = isPending ? 'Compact queued' : 'Compact'

    const left = cacheLeft(bar.lastResponseAt, bar.ttlMs, now)
    const weather = weatherOf(bar.contextPercent, bar.thresholdPercent)
    const fill = bar.contextPercent === null ? '–' : `${bar.contextPercent}%`
    const time = left === null ? '–' : left.minutes === 0 ? 'expired' : `${left.minutes}m`
    const timeColor = left === null ? undefined : left.minutes === 0 ? 'error' : meterColor(left.share)
    const arrow = (
      <Button
        key="collapse"
        plain
        label={isCollapsed ? '▸' : '▾'}
        onPress={async () => {
          const value = !(await read($, collapsed))
          await update($, collapsed, () => value)
          await $.store.set(STORE_COLLAPSED, value)
        }}
      />
    )

    const narrow = e.props.bodyColumns < 72
    let row
    if (isCollapsed || narrow) {
      row = (
        <Box key="compact-bar" flexDirection="row" gap={1}>
          <Text>{weather.emoji}</Text>
          <Text color={timeColor}>{time}</Text>
          <Text dimColor>·</Text>
          <Text>{fill}</Text>
          {narrow && !isCollapsed ? (
            <Button key="compact" label={compactLabel} variant={weather.isStorm ? 'primary' : 'secondary'} onPress={() => compactNow($, working)} />
          ) : null}
          {arrow}
        </Box>
      )
    } else {
      const m = meter(left?.share ?? 0, BOXES)
      row = (
        <Box key="compact-bar" flexDirection="row" gap={1}>
          <Text dimColor>cache</Text>
          <Text color={timeColor} bold>
            {time}
          </Text>
          <Text>
            <Text color={timeColor}>{m.full}</Text>
            <Text dimColor>{m.empty}</Text>
          </Text>
          <Text dimColor>· hit</Text>
          <Text>{bar.hitRate === null ? '–' : `${bar.hitRate}%`}</Text>
          <Text dimColor>·</Text>
          <Text>{weather.emoji}</Text>
          <Text bold={weather.isStorm}>{fill}</Text>
          <Text dimColor>/ {bar.thresholdPercent}%</Text>
          <Button key="compact" label={compactLabel} variant={weather.isStorm ? 'primary' : 'secondary'} onPress={() => compactNow($, working)} />
          {arrow}
        </Box>
      )
    }
    return (
      <Box flexDirection="column">
        {rest}
        {row}
      </Box>
    )
  })
}
