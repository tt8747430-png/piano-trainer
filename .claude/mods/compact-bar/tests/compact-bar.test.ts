import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On } from 'claude-code'

import { cacheLeft, hitRateOf, meter, meterColor, splitSummary, ttlSeen, weatherOf, FIVE_MIN, ONE_HOUR } from '../hooks/logic'

const VOID = { value: undefined } as never
const ok = (value: unknown) => ({ value }) as never

function world(on: On, opts: { percent?: number; threshold?: number; surfaces?: string[] } = {}) {
  const clock = mock.clock(on, { now: 1_000_000 })
  mock.store(on, {})
  mock.env(on, {})
  const logs: string[] = []
  const submitted: string[] = []
  const commands: string[] = []
  on('session.usage', async () =>
    ok({
      startedAt: 0,
      rateLimits: [{}],
      context: {
        window: 200000,
        percent: opts.percent,
        breakdown: { autoCompactThreshold: (opts.threshold ?? 80) * 2000, rawMaxTokens: 200000 },
      },
    }),
  )
  on('session.surfaces', async () => ok(opts.surfaces ?? ['terminal']))
  on('session.start', async () => ({ cwd: '/w' }) as never)
  on('turn.complete', async ($, e) => ({ text: e.answer }))
  on('ui.log', async ($, e) => {
    logs.push(e.text)
    return VOID
  })
  on('prompt.submit', async ($, e) => {
    submitted.push(e.text)
    return { text: e.text } as never
  })
  on('command.run', async ($, e) => {
    commands.push(e.command)
    return {} as never
  })
  on('session.compact', async () => ({
    messages: [{ role: 'user', text: 'First paragraph.\n\nSecond paragraph.', toolUses: [] }],
    tokensBefore: 150000,
    tokensAfter: 12000,
  }) as never)
  on('ui.render', async () => ({ type: 'Box', props: {}, children: [] }) as never)
  return { clock, logs, submitted, commands }
}

const start = ($: Engine) => $.session.start({ cwd: '/w', surface: 'terminal', isInteractive: true })
const answer = ($: Engine) =>
  $.turn.complete({ answer: 'ok', durationMs: 1, isAborted: false, turnId: 't', reason: 'answer' })
const band = (bodyColumns = 120, isWorking = false) =>
  ({ component: 'AbovePrompt', props: { hasSurvey: false, isWorking, maxRows: 10, bodyColumns } as never }) as const

test('the pure parts: weather, meter, colours, hit rate, TTL learning, summary split', () => {
  expect(weatherOf(30, 83).emoji).toBe('☀️')
  expect(weatherOf(60, 83).emoji).toBe('🌧️')
  expect(weatherOf(70, 83)).toEqual({ emoji: '⛈️', isStorm: true })
  expect(meter(0.5)).toEqual({ full: '■'.repeat(10), empty: '□'.repeat(10) })
  expect(meterColor(0.8)).toBe('success')
  expect(meterColor(0.2)).toBe('warning')
  expect(meterColor(0.05)).toBe('error')
  expect(cacheLeft(0, FIVE_MIN, 2 * 60000)).toEqual({ minutes: 3, share: 0.6 })
  expect(cacheLeft(0, FIVE_MIN, 6 * 60000)?.minutes).toBe(0)
  expect(hitRateOf({ input_tokens: 10, cache_read_input_tokens: 90, cache_creation_input_tokens: 0 })).toBe(90)
  const read = { input_tokens: 5, cache_read_input_tokens: 5000, cache_creation_input_tokens: 10 }
  expect(ttlSeen(10 * 60000, read)).toBe(ONE_HOUR)
  expect(ttlSeen(10 * 60000, { input_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 50000 })).toBe(FIVE_MIN)
  expect(ttlSeen(60000, read)).toBeNull()
  const long = Array.from({ length: 30 }, (_, i) => `Paragraph ${i} ` + 'x'.repeat(100)).join('\n\n')
  const parts = splitSummary(long, 500)
  expect(parts.length).toBeGreaterThan(1)
  for (const p of parts) expect(p.length).toBeLessThanOrEqual(500)
  expect(parts.join('\n\n')).toBe(long)
})

test('the bar draws cache, hit rate, weather and fill on terminal and desktop, and collapses', async ($, on) => {
  world(on, { percent: 72, threshold: 80 })
  await start($)
  await answer($)
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'compact-bar', surface, ...band() })
    expect(await ui.find({ type: 'Text', text: '⛈️' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '72%' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /80%/ })).toBeDefined()
    const compact = await ui.find({ key: 'compact' })
    expect(compact?.props.variant).toBe('primary')
    await ui.press({ key: 'collapse' })
    expect(await ui.find({ key: 'compact' })).toBeUndefined()
    expect(await ui.find({ type: 'Text', text: '72%' })).toBeDefined()
    await ui.press({ key: 'collapse' })
    await ui.unmount()
  }
})

test('Compact runs /compact when idle, and while Claude works runs it as the turn ends', async ($, on) => {
  const w = world(on, { percent: 20 })
  await start($)
  let ui = await $.ui.mount({ plugin: 'compact-bar', surface: 'terminal', ...band() })
  await ui.press({ key: 'compact' })
  expect(w.commands).toEqual(['compact'])
  await ui.unmount()
  ui = await $.ui.mount({ plugin: 'compact-bar', surface: 'terminal', ...band(120, true) })
  await ui.press({ key: 'compact' })
  expect(w.commands).toEqual(['compact'])
  expect((await ui.find({ key: 'compact' }))?.props.label).toBe('Compact queued')
  await ui.unmount()
  await answer($)
  await w.clock.settle()
  expect(w.commands).toEqual(['compact', 'compact'])
})

test('a manual compact posts the token counts and the summary as log lines', async ($, on) => {
  const w = world(on)
  await start($)
  await $.session.compact({ trigger: 'manual', messages: [{ role: 'user', text: 'hi', toolUses: [] }] } as never)
  expect(w.logs[0]).toBe('Compacted: 150k → 12k tokens. Claude continues from this summary:')
  expect(w.logs[1]).toBe('First paragraph.\n\nSecond paragraph.')
})
