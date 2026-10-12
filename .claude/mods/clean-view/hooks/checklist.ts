// The checklist as pure functions: every change is old state in, new state out.

import type { CleanViewChecklist, CleanViewTask } from '../types'
import { cleanName } from './names'

export const IDLE: CleanViewChecklist = {
  title: '',
  phase: 'idle',
  tasks: [],
  needsYouReason: '',
  stuckReason: '',
  startedAt: 0,
  finishedAt: 0,
  isCollapsed: false,
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(Number.isFinite(n) ? n : 0)))
const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

export function startJob(title: string, now: number): CleanViewChecklist {
  return { ...IDLE, title, phase: 'working', startedAt: now }
}

export function plan(cl: CleanViewChecklist, title: string, steps: readonly string[], now: number): CleanViewChecklist {
  const names = steps.map(s => cleanName(s)).filter(Boolean).slice(0, 20)
  const tasks: CleanViewTask[] = names.map((name, i) => ({
    id: `p${i}`,
    name,
    status: i === 0 ? 'active' : 'upcoming',
    percent: 0,
    hasReported: false,
  }))
  return {
    ...cl,
    title: cleanName(title),
    phase: 'working',
    tasks,
    stuckReason: '',
    needsYouReason: '',
    startedAt: cl.startedAt || now,
    finishedAt: 0,
    isCollapsed: false,
  }
}

/** Starts the first upcoming step when none is active. */
function advance(tasks: CleanViewTask[]): CleanViewTask[] {
  if (tasks.some(t => t.status === 'active')) return tasks
  const i = tasks.findIndex(t => t.status === 'upcoming')
  if (i < 0) return tasks
  return tasks.map((t, j) => (j === i ? { ...t, status: 'active', percent: 0, hasReported: false } : t))
}

export function report(cl: CleanViewChecklist, task: string, percent: number, now: number): CleanViewChecklist {
  const name = cleanName(task)
  const pct = clamp(percent)
  let tasks = cl.tasks.slice()
  let at = tasks.findIndex(t => same(t.name, name))
  if (at < 0) {
    // A step that is not in the plan: it becomes the current one, where the active step stood.
    const active = tasks.findIndex(t => t.status === 'active')
    at = active < 0 ? tasks.length : active
    tasks = tasks.map(t => (t.status === 'active' ? { ...t, status: 'upcoming' } : t))
    tasks.splice(at, 0, { id: `r${now}-${tasks.length}`, name, status: 'active', percent: 0, hasReported: false })
  }
  tasks = tasks.map((t, j) => {
    if (j < at) return t.status === 'done' ? t : { ...t, status: 'done', percent: 100 }
    if (j === at) return { ...t, status: pct >= 100 ? 'done' : 'active', percent: pct, hasReported: true }
    return t.status === 'active' ? { ...t, status: 'upcoming' } : t
  })
  tasks = advance(tasks)
  const allDone = tasks.length > 0 && tasks.every(t => t.status === 'done')
  return {
    ...cl,
    tasks,
    phase: allDone ? 'done' : cl.phase === 'stuck' || cl.phase === 'idle' ? 'working' : cl.phase,
    finishedAt: allDone ? now : 0,
    startedAt: cl.startedAt || now,
  }
}

export type Todo = { content: string; status: 'pending' | 'in_progress' | 'completed'; activeForm?: string }

export function fromTodos(cl: CleanViewChecklist, todos: readonly Todo[], now: number): CleanViewChecklist {
  const tasks = advance(
    todos.map((t, i): CleanViewTask => ({
      id: `t${i}`,
      name: cleanName(t.content),
      status: t.status === 'completed' ? 'done' : t.status === 'in_progress' ? 'active' : 'upcoming',
      percent: t.status === 'completed' ? 100 : 0,
      hasReported: false,
    })),
  )
  const allDone = tasks.length > 0 && tasks.every(t => t.status === 'done')
  return {
    ...cl,
    title: cl.title || 'Work through the to-dos',
    tasks,
    phase: allDone ? 'done' : cl.phase === 'idle' || cl.phase === 'done' ? 'working' : cl.phase,
    startedAt: cl.startedAt || now,
    finishedAt: allDone ? now : 0,
    isCollapsed: false,
  }
}

export function addTask(cl: CleanViewChecklist, id: string, name: string, now: number): CleanViewChecklist {
  const tasks = advance([...cl.tasks, { id, name: cleanName(name), status: 'upcoming', percent: 0, hasReported: false }])
  return { ...cl, title: cl.title || 'Work through the tasks', tasks, phase: cl.phase === 'idle' || cl.phase === 'done' ? 'working' : cl.phase, startedAt: cl.startedAt || now }
}

export function updateTask(
  cl: CleanViewChecklist,
  id: string,
  change: { status?: 'pending' | 'in_progress' | 'completed' | 'deleted'; subject?: string },
  now: number,
): CleanViewChecklist {
  let tasks = cl.tasks.filter(t => !(t.id === id && change.status === 'deleted'))
  tasks = tasks.map(t => {
    if (t.id !== id) return change.status === 'in_progress' && t.status === 'active' ? { ...t, status: 'upcoming' } : t
    const status = change.status === 'completed' ? 'done' : change.status === 'in_progress' ? 'active' : change.status === 'pending' ? 'upcoming' : t.status
    return { ...t, name: change.subject ? cleanName(change.subject) : t.name, status, percent: status === 'done' ? 100 : t.percent }
  })
  tasks = advance(tasks)
  const allDone = tasks.length > 0 && tasks.every(t => t.status === 'done')
  return { ...cl, tasks, phase: allDone ? 'done' : cl.phase === 'done' ? 'working' : cl.phase, finishedAt: allDone ? now : 0 }
}

export type Row =
  | { kind: 'task'; task: CleanViewTask; label: string }
  | { kind: 'done-fold'; count: number }
  | { kind: 'more-fold'; count: number }

/** At most `max` step rows: earlier done steps fold into one row, later ones into "+N more". */
export function visibleRows(tasks: readonly CleanViewTask[], max = 5): Row[] {
  let firstUpcoming = true
  const labelled = tasks.map(task => {
    let label = 'Done'
    if (task.status === 'active') label = task.hasReported ? `${task.percent}%` : 'Working'
    if (task.status === 'upcoming') {
      label = firstUpcoming ? 'Next' : 'Up next'
      firstUpcoming = false
    }
    return { kind: 'task' as const, task, label }
  })
  if (labelled.length <= max) return labelled
  const focus = Math.max(0, tasks.findIndex(t => t.status !== 'done'))
  let start = Math.min(focus, labelled.length - max)
  start = Math.max(0, start)
  const rows: Row[] = []
  if (start > 0) rows.push({ kind: 'done-fold', count: start })
  rows.push(...labelled.slice(start, start + max))
  const after = labelled.length - (start + max)
  if (after > 0) rows.push({ kind: 'more-fold', count: after })
  return rows
}

export function meterCells(task: CleanViewTask, frame: number, width = 10): { full: string; empty: string; sweep?: [number, number] } {
  if (task.status === 'done') return { full: '█'.repeat(width), empty: '' }
  if (task.status === 'upcoming') return { full: '', empty: '░'.repeat(width) }
  if (!task.hasReported) {
    const at = frame % width
    return { full: '', empty: '░'.repeat(width), sweep: [at, Math.min(width, at + 3)] }
  }
  const n = Math.round((task.percent / 100) * width)
  return { full: '█'.repeat(n), empty: '░'.repeat(width - n) }
}

export function fmtElapsed(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(s / 60)
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`
}

/** One calm sentence for an API error. */
export function errorSentence(kind: string | undefined, details = ''): string {
  const d = details.toLowerCase()
  if (kind === 'rate_limit') return 'you hit your usage limit, try again a little later'
  if (kind === 'overloaded' || kind === 'server_error') return "Claude's servers are busy, try again in a minute"
  if (/prompt is too long|context (window|length)|too many tokens/.test(d)) return 'type /compact and try again'
  if (kind === 'authentication_failed' || kind === 'oauth_org_not_allowed' || /auth|login|401/.test(d)) return 'type /login'
  if (/econn|enotfound|network|fetch failed|socket|timed out|offline/.test(d)) return 'the internet connection dropped'
  return 'Claude hit an error and stopped'
}
