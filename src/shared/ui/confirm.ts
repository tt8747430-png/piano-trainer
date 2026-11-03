import type { ReactNode } from 'react'

/** What `confirm` asks: `ConfirmDialog`'s words (R17). */
export interface Asking {
  readonly title: string
  readonly body: ReactNode
  /** The act, named: Archive, Delete, Sign out. */
  readonly action: string
  readonly destructive?: boolean
  readonly typed?: string
}

interface Pending extends Asking {
  readonly answer: (yes: boolean) => void
}

let pending: Pending | null = null
const listeners = new Set<() => void>()
const changed = () => {
  for (const listener of listeners) listener()
}

/**
 * Asks before an act that loses or hides work, in the app's one `ConfirmDialog` (`Confirmer`, beside
 * the toasts): resolves whether the learner confirmed. A row's menu, a swipe, a drag, Select's bar
 * and a key all ask through it, so every trigger asks the same question.
 */
export function confirm(asking: Asking): Promise<boolean> {
  pending?.answer(false)
  return new Promise((resolve) => {
    pending = { ...asking, answer: resolve }
    changed()
  })
}

/** The question waiting, for `Confirmer`. */
export const confirmQueue = {
  current: (): Pending | null => pending,
  subscribe(onChange: () => void) {
    listeners.add(onChange)
    return () => listeners.delete(onChange)
  },
  /** The learner's answer: the question goes. */
  answer(yes: boolean) {
    const asked = pending
    pending = null
    changed()
    asked?.answer(yes)
  },
}
