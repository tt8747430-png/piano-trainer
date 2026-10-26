import { toast } from './primitives/toast'

/** How long a toast stays: long enough to reach its Undo, short enough to be gone by the next act. */
const TOAST_MS = 5000

/**
 * Says what was just done in a toast (Mindscape's, ADR 0106: "Moved to Hymns"), with what undoes it
 * where something does: announced politely, gone after a few seconds, or at once by its Close.
 */
export function say(line: string, action?: { label: string; onClick: () => void }): void {
  toast.add({
    title: line,
    timeout: TOAST_MS,
    priority: 'low',
    ...(action ? { actionProps: { children: action.label, onClick: action.onClick } } : {}),
  })
}
