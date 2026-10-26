import { toast } from './primitives/toast'

/** How long a toast stays: long enough to reach its Undo, short enough to be gone by the next act. */
export const TOAST_MS = 5000

/**
 * Says what was just done in a toast (Mindscape's, ADR 0106: "Moved to Hymns"), with what undoes it
 * where something does: announced politely, gone after a few seconds, at once by its Close or a
 * swipe. One at a time: a new one takes the place of the one before (whose Undo would act on
 * something since changed), and its action, once taken, closes it.
 */
export function say(line: string, action?: { label: string; onClick: () => void }): void {
  toast.close()
  const id = toast.add({
    title: line,
    timeout: TOAST_MS,
    priority: 'low',
    ...(action
      ? {
          actionProps: {
            children: action.label,
            onClick: () => {
              toast.close(id)
              action.onClick()
            },
          },
        }
      : {}),
  })
}
