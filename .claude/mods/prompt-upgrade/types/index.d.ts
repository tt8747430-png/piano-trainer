export type UpgradeStep = 'reading' | 'questions' | 'rewrite' | 'review' | 'error'

export type UpgradeQuestion = { question: string; options: string[] }

export type UpgradeFlow = {
  id: string
  original: string
  step: UpgradeStep
  questions: UpgradeQuestion[]
  /** One per question: the chosen or typed answer, '' when skipped, null while open. */
  answers: Array<string | null>
  /** The question whose "Other" field is open, or -1. */
  otherIndex: number
  upgraded: string
  added: string[]
  isEditing: boolean
  /** The step that failed, for Try again. */
  failedAt: 'questions' | 'rewrite' | null
  error: string
}

export type UpgradeEntry = { at: number; original: string; upgraded: string; added: string[] }

export type UpgradeView = 'flow' | 'input' | 'history'

declare module 'claude-code' {
  interface PluginState {
    'prompt-upgrade': {
      flow: UpgradeFlow | null
      view: UpgradeView
      isAuto: boolean
      history: UpgradeEntry[]
    }
  }
}
