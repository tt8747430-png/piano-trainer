import { atom, read, update } from 'claude-code'
import type { EngineInterface, On, Timer } from 'claude-code'

import type { CleanViewChecklist, CleanViewPhase } from '../types'
import {
  IDLE,
  addTask,
  errorSentence,
  fmtElapsed,
  fromTodos,
  meterCells,
  plan,
  report,
  startJob,
  updateTask,
  visibleRows,
} from './checklist'
import { firstWords } from './names'

type $ = EngineInterface

const enabledAtom = atom({ plugin: 'clean-view', key: 'cleanViewEnabled' } as const, true)
const checklistAtom = atom({ plugin: 'clean-view', key: 'checklist' } as const, IDLE)
const tickAtom = atom({ plugin: 'clean-view', key: 'tick' } as const, 0)
const STORE_ENABLED = 'cleanViewEnabled'

export const PLAN_TOOL = 'mcp__clean-view__plan_steps'
export const REPORT_TOOL = 'mcp__clean-view__report_progress'

const ROUTINE = new Set([
  'Read', 'Grep', 'Glob', 'LS', 'ToolSearch', 'TodoWrite', 'TaskCreate', 'TaskUpdate', 'TaskList', 'TaskGet',
  'WebSearch', 'WebFetch', 'NotebookRead', PLAN_TOOL, REPORT_TOOL,
])
const EDITS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit'])

/** Whether a tool row is routine work the view hides: reads, searches, and shell commands that succeeded. */
export function isRoutine(tool: string, isErrored: boolean, isRunning: boolean): boolean {
  if (isErrored || EDITS.has(tool)) return false
  if (tool === 'Bash') return !isRunning
  return ROUTINE.has(tool)
}

const REJECTED = /user (doesn't|does not) want|was rejected|user rejected|denied by the user|permission (was )?denied/i

export const COMPOSE_TEXT = `# Progress checklist (Clean View)
When the work has three or more steps, call plan_steps first (load it with ToolSearch if it is deferred), then report_progress as real progress happens, and with percent 100 the moment a step finishes. For a quick question or a one-step job, do not plan.
A step name is under 48 characters, starts with a verb and says what the step achieves. A file or function name is fine; a full path or a command is not.
If the work is already tracked, by a to-do list (TodoWrite, TaskCreate) or by a savvy-flow run reporting to savvy-progress, do not call plan_steps as well.`

/** Module state: lost on reload, rebuilt from $.state where it matters. */
let anim: Timer | null = null
let collapseTimer: Timer | null = null
let failures = 0
let lastError: { kind?: string; details?: string } | null = null
const toolOf = new Map<string, string>()

const ANIMATED: CleanViewPhase[] = ['working', 'needs-you']

async function setChecklist($: $, change: (c: CleanViewChecklist) => CleanViewChecklist) {
  await update($, checklistAtom, change)
  await syncTimers($)
}

/** Runs the 250 ms clock only while a job is working or waiting; schedules the 5 s collapse after Done. */
async function syncTimers($: $) {
  const cl = await read($, checklistAtom)
  const isAnimated = ANIMATED.includes(cl.phase)
  if (isAnimated && !anim) {
    anim = $.clock.every(250, () => {
      void update($, tickAtom, n => n + 1)
    })
  }
  if (!isAnimated && anim) {
    anim.cancel()
    anim = null
  }
  if (cl.phase === 'done' && !cl.isCollapsed && !collapseTimer) {
    collapseTimer = $.clock.after(5000, () => {
      collapseTimer = null
      void update($, checklistAtom, c => (c.phase === 'done' ? { ...c, isCollapsed: true } : c))
    })
  }
  if (cl.phase !== 'done' && collapseTimer) {
    collapseTimer.cancel()
    collapseTimer = null
  }
}

async function needsYou($: $, reason: string) {
  await setChecklist($, c => (c.phase === 'idle' ? c : { ...c, phase: 'needs-you', needsYouReason: reason }))
}

async function clearNeedsYou($: $) {
  const cl = await read($, checklistAtom)
  if (cl.phase === 'needs-you') await setChecklist($, c => ({ ...c, phase: 'working', needsYouReason: '' }))
}

async function stuck($: $, reason: string) {
  await setChecklist($, c => (c.phase === 'idle' ? c : { ...c, phase: 'stuck', stuckReason: reason }))
}

export async function setCleanView($: $, value: boolean) {
  await update($, enabledAtom, () => value)
  await $.store.set(STORE_ENABLED, value)
}

async function simple($: $, args: string): Promise<{ text: string }> {
  const word = args.trim().toLowerCase()
  const now = await read($, enabledAtom)
  const value = word === 'on' ? true : word === 'off' ? false : !now
  await setCleanView($, value)
  return {
    text: value
      ? 'Clean View is on: routine tool rows are hidden and the checklist shows above the prompt.'
      : 'Clean View is off: every tool row is back and the checklist is hidden.',
  }
}

const PLAN_SPEC = {
  name: 'plan_steps',
  description:
    'Lay out a job of three or more steps up front so the person sees a checklist. title: the job in 2 to 6 words, starting with a verb. steps: 2 to 8 short step names in order, each under 48 characters, starting with a verb. The first step starts right away.',
  inputSchema: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'The job in 2 to 6 words, starting with a verb.' },
      steps: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 8 },
    },
    required: ['title', 'steps'],
  },
  isDeferred: false,
}

const REPORT_SPEC = {
  name: 'report_progress',
  description:
    'Report progress on the current step of the plan: task is the step name, percent 0 to 100. Report 100 the moment a step finishes; the next step starts by itself.',
  inputSchema: {
    type: 'object',
    properties: {
      task: { type: 'string' },
      percent: { type: 'number', minimum: 0, maximum: 100 },
    },
    required: ['task', 'percent'],
  },
  isDeferred: false,
}

/** Session start for the view: its switch, its two tools and /simple. */
async function startCleanView($: $) {
  await update($, enabledAtom, () => true)
  if ((await $.store.get(STORE_ENABLED)) === false) await update($, enabledAtom, () => false)
  await $.tool.register(PLAN_SPEC)
  await $.tool.register(REPORT_SPEC)
  await $.command.register({ name: 'simple', description: 'Clean View: hide routine tool rows and show one checklist', argumentHint: 'on | off' })
  await syncTimers($)
}

async function cleanViewSection($: $) {
  return (await read($, enabledAtom)) ? [{ id: 'clean-view:checklist', text: COMPOSE_TEXT, scope: 'session' as const }] : []
}

export function registerCleanView(on: On) {
  on('session.start', async ($, e, next) => {
    const r = await next(e)
    try {
      await startCleanView($)
    } catch {
      // the view draws from its defaults
    }
    return r
  })

  on('prompt.compose', async ($, e, next) => {
    const r = await next(e)
    return { sections: [...r.sections, ...(await cleanViewSection($))] }
  }).catch(($, e, next) => next(e))

  on('command.run', { command: 'simple' }, async ($, e) => {
    try {
      return await simple($, e.args)
    } catch {
      return { text: 'Clean View could not change the setting. Try /simple again.' }
    }
  })

  on('tool.call', { tool: PLAN_TOOL }, async ($, e) => {
    const input = (e as { input?: { title?: unknown; steps?: unknown } }).input ?? (e as { title?: unknown; steps?: unknown })
    const steps = Array.isArray(input.steps) ? input.steps.filter((s): s is string => typeof s === 'string') : []
    const title = typeof input.title === 'string' ? input.title : 'Work through the plan'
    const now = await $.clock.now()
    await setChecklist($, c => plan(c, title, steps, now))
    const n = (await read($, checklistAtom)).tasks.length
    return { result: `Planned ${n} steps. The first one has started.` }
  }).catch(() => ({ result: 'Planned. The first step has started.' }))

  on('tool.call', { tool: REPORT_TOOL }, async ($, e) => {
    const input = (e as { input?: { task?: unknown; percent?: unknown } }).input ?? (e as { task?: unknown; percent?: unknown })
    const pct = Math.max(0, Math.min(100, Math.round(Number(input.percent) || 0)))
    const now = await $.clock.now()
    await setChecklist($, c => report(c, typeof input.task === 'string' ? input.task : 'Working on it', pct, now))
    return { result: `Progress noted: ${pct}%.` }
  }).catch(() => ({ result: 'Progress noted.' }))

  on('tool.call', async ($, e, next) => {
    const tool = String(e.tool)
    toolOf.set(e.tool_use_id, tool)
    if (toolOf.size > 2000) toolOf.delete(toolOf.keys().next().value as string)
    if (tool === PLAN_TOOL || tool === REPORT_TOOL) return next(e)
    const isMain = e.agentId === undefined
    if (isMain && tool !== 'AskUserQuestion') await clearNeedsYou($)
    if (isMain && tool === 'AskUserQuestion') await needsYou($, 'Claude has a question for you')

    const ran = await next(e)
    if (!isMain) return ran
    const now = await $.clock.now()
    await clearNeedsYou($)

    if (ran.deny === undefined && ran.isError !== true) {
      if (e.tool === 'TodoWrite') await setChecklist($, c => fromTodos(c, e.todos, now))
      if (e.tool === 'TaskCreate') {
        const id = (ran.result as { task?: { id?: string } } | undefined)?.task?.id ?? `tc${now}`
        await setChecklist($, c => addTask(c, id, e.subject, now))
      }
      if (e.tool === 'TaskUpdate') await setChecklist($, c => updateTask(c, e.taskId, { status: e.status, subject: e.subject }, now))
      failures = 0
      const cl = await read($, checklistAtom)
      if (cl.phase === 'stuck') await setChecklist($, c => ({ ...c, phase: 'working', stuckReason: '' }))
      return ran
    }
    const text = ran.deny ?? ran.text ?? (typeof ran.result === 'string' ? ran.result : '')
    if (REJECTED.test(text)) {
      failures = 0
      await stuck($, 'you said no to a step, so Claude paused')
    } else {
      failures += 1
      if (failures >= 3) await stuck($, 'a step keeps failing, Claude is trying another way')
    }
    return ran
  }).catch(($, e, next) => next(e))

  on('classic.Notification', async ($, e, next) => {
    const r = await next(e)
    if (e.notification_type === 'permission_prompt') await needsYou($, 'Claude needs your OK to continue')
    else if (e.notification_type === 'elicitation_dialog') await needsYou($, 'Claude has a question for you')
    else if (e.notification_type !== 'idle_prompt' && /permission|approve|needs your/i.test(e.message)) await needsYou($, 'Claude needs your OK to continue')
    return r
  }).catch(($, e, next) => next(e))

  on('classic.StopFailure', async ($, e, next) => {
    lastError = { kind: e.error, details: e.error_details }
    return next(e)
  }).catch(($, e, next) => next(e))

  on('turn.start', async ($, e, next) => {
    const r = await next(e)
    try {
      const text = e.text.trim()
      if (text === '' || text.startsWith('/')) return r
      lastError = null
      failures = 0
      const cl = await read($, checklistAtom)
      const now = await $.clock.now()
      const isContinuing = cl.phase === 'needs-you' && cl.tasks.some(t => t.status !== 'done')
      if (isContinuing) await setChecklist($, c => ({ ...c, phase: 'working', needsYouReason: '' }))
      else if (cl.phase !== 'working') await setChecklist($, () => startJob(firstWords(text), now))
    } catch {
      // the band keeps what it had
    }
    return r
  })

  on('turn.complete', async ($, e, next) => {
    const r = await next(e)
    if (e.agentId !== undefined) return r
    try {
      const now = await $.clock.now()
      const cl = await read($, checklistAtom)
      if (cl.phase === 'idle') return r
      if (e.reason === 'error') {
        const why = errorSentence(lastError?.kind, lastError?.details ?? '')
        await setChecklist($, c => ({ ...c, phase: 'stuck', stuckReason: why, finishedAt: now }))
      } else if (e.reason === 'refusal') {
        await setChecklist($, c => ({ ...c, phase: 'stuck', stuckReason: "Claude couldn't help with that request", finishedAt: now }))
      } else if (e.reason === 'aborted' || e.isAborted) {
        await setChecklist($, c => ({ ...c, phase: 'stopped', finishedAt: now }))
      } else if (cl.tasks.length > 0 && cl.tasks.some(t => t.status !== 'done')) {
        await setChecklist($, c => ({ ...c, phase: 'needs-you', needsYouReason: 'Claude is waiting for your reply' }))
      } else if (cl.tasks.length > 0) {
        await setChecklist($, c => ({ ...c, phase: 'done', finishedAt: c.finishedAt || now, isCollapsed: false }))
      } else {
        await setChecklist($, () => IDLE)
      }
    } catch {
      // keep the band as it was
    }
    return r
  })

  // ── hidden rows ────────────────────────────────────────────────────────────
  on('ui.render', { component: 'ToolUse' }, async ($, e, next) => {
    if (!(await read($, enabledAtom))) return next(e)
    if (!isRoutine(e.props.tool, e.props.isErrored, e.props.isRunning)) return next(e)
    const { Box } = $.ui.resolve(e)
    return <Box display="none" />
  })

  on('ui.render', { component: 'ToolResult' }, async ($, e, next) => {
    if (!(await read($, enabledAtom))) return next(e)
    if (!isRoutine(e.props.tool, e.props.isErrored, false)) return next(e)
    const { Box } = $.ui.resolve(e)
    return <Box display="none" />
  })

  on('ui.render', { component: 'ToolGroup' }, async ($, e, next) => {
    if (!(await read($, enabledAtom))) return next(e)
    const isQuiet = e.props.calls.every(c => isRoutine(c.tool, c.isErrored, c.tool === 'Bash' ? false : c.isRunning))
    if (!isQuiet) return next(e)
    const { Box } = $.ui.resolve(e)
    return <Box display="none" />
  })

  on('ui.render', { component: 'ToolProgress' }, async ($, e, next) => {
    if (!(await read($, enabledAtom))) return next(e)
    const tool = toolOf.get(e.props.tool_use_id) ?? ''
    if (tool !== 'Bash' && !ROUTINE.has(tool)) return next(e)
    return next({ ...e, props: { ...e.props, hint: '' } })
  })

  // ── the band ───────────────────────────────────────────────────────────────
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const rest = await next(e)
    if (e.props.hasSurvey || !(await read($, enabledAtom))) return rest
    const cl = await read($, checklistAtom)
    if (cl.phase === 'idle') return rest
    const frame = await read($, tickAtom)
    const now = await $.clock.now()
    const { Box, Text, Button } = $.ui.resolve(e)
    const cols = Math.max(30, e.props.bodyColumns)
    const button = (
      <Button
        key="clean-view-toggle"
        label="● Clean View: ON"
        onPress={async () => {
          await setCleanView($, false)
          $.ui.toast('Clean View is off. Type /simple on to bring it back.')
        }}
      />
    )
    const elapsed = fmtElapsed((cl.finishedAt || now) - cl.startedAt)
    const room = cols - 22
    const cut = (s: string, w: number) => (s.length <= w ? s : `${s.slice(0, Math.max(1, w - 1))}…`)

    let header
    if (cl.phase === 'needs-you') {
      header = (
        <Text>
          <Text backgroundColor="warning" color="inverseText" bold>{' Needs you '}</Text>
          <Text>{` ${cut(cl.needsYouReason, room - 11)}`}</Text>
        </Text>
      )
    } else if (cl.phase === 'stuck') {
      header = <Text color="warning">{cut(`⚠ Stuck: ${cl.stuckReason}`, room)}</Text>
    } else if (cl.phase === 'stopped') {
      header = <Text>{cut(`■ Stopped · ${cl.title} · you pressed Esc`, room)}</Text>
    } else if (cl.phase === 'done') {
      header = <Text color="success">{cut(`✓ All done · ${cl.title} · took ${elapsed}`, room)}</Text>
    } else {
      header = (
        <Text>
          <Text bold>{cut(cl.title, room - elapsed.length - 3)}</Text>
          <Text dimColor>{` · ${elapsed}`}</Text>
        </Text>
      )
    }
    const headerRow = (
      <Box key="clean-view-header" flexDirection="row" justifyContent="space-between" width={cols}>
        {header}
        {button}
      </Box>
    )
    if ((cl.phase === 'done' && cl.isCollapsed) || cl.tasks.length === 0) {
      return (
        <Box flexDirection="column">
          {rest}
          {headerRow}
        </Box>
      )
    }

    const nameWidth = Math.max(8, cols - 2 - 1 - 10 - 2 - 7)
    const rows = visibleRows(cl.tasks).map((row, i) => {
      if (row.kind === 'done-fold') return <Text key={`f${i}`} color="success">{`✓ ${row.count} done`}</Text>
      if (row.kind === 'more-fold') return <Text key={`m${i}`} dimColor>{`+${row.count} more`}</Text>
      const t = row.task
      const m = meterCells(t, frame)
      const icon = t.status === 'done' ? '✓' : t.status === 'active' ? (cl.phase === 'needs-you' ? '‖' : '▶') : '○'
      const name = cut(t.name, nameWidth).padEnd(nameWidth)
      const meter = m.sweep ? (
        <Text>
          <Text dimColor>{m.empty.slice(0, m.sweep[0])}</Text>
          <Text color="claude">{'█'.repeat(m.sweep[1] - m.sweep[0])}</Text>
          <Text dimColor>{m.empty.slice(m.sweep[1])}</Text>
        </Text>
      ) : (
        <Text>
          <Text color={t.status === 'done' ? 'success' : 'claude'}>{m.full}</Text>
          <Text dimColor>{m.empty}</Text>
        </Text>
      )
      return (
        <Text key={t.id}>
          <Text color={t.status === 'done' ? 'success' : undefined} dimColor={t.status === 'upcoming'}>{`${icon} `}</Text>
          <Text bold={t.status === 'active'} dimColor={t.status !== 'active'}>{`${name} `}</Text>
          {meter}
          <Text dimColor={t.status !== 'active'}>{`  ${row.label}`}</Text>
        </Text>
      )
    })
    return (
      <Box flexDirection="column">
        {rest}
        {headerRow}
        {rows}
      </Box>
    )
  })
}
