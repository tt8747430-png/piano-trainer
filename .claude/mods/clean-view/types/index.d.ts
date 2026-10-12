export type CleanViewTaskStatus = 'done' | 'active' | 'upcoming'

export type CleanViewTask = {
  id: string
  name: string
  status: CleanViewTaskStatus
  /** 0..100 */
  percent: number
  /** Whether Claude reported a percent for this step yet. */
  hasReported: boolean
}

export type CleanViewPhase = 'idle' | 'working' | 'needs-you' | 'stuck' | 'stopped' | 'done'

export type CleanViewChecklist = {
  title: string
  phase: CleanViewPhase
  tasks: CleanViewTask[]
  needsYouReason: string
  stuckReason: string
  /** $.clock.now() ms; 0 while idle. */
  startedAt: number
  finishedAt: number
  isCollapsed: boolean
}

export type CleanViewLean = { trimmedCount: number; charsSaved: number }

declare module 'claude-code' {
  interface PluginState {
    'clean-view': {
      cleanViewEnabled: boolean
      leanEnabled: boolean
      checklist: CleanViewChecklist
      lean: CleanViewLean
      /** Animation frame, advanced every 250 ms while a job is working or waiting. */
      tick: number
    }
  }
}
