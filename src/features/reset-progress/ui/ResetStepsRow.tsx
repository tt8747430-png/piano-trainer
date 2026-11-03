import { useState } from 'react'
import { useProgressStoreApi } from '@/entities/progress'
import type { StepId } from '@/entities/step'
import { ConfirmDialog, DangerGroup, DangerRow, say } from '@/shared/ui'
import { resetSteps } from '../reset-steps'

/**
 * A lesson's or a course's Reset progress (round 28, R25): a red row alone in its page's last group,
 * what it does in the footnote under it; asking in the one dialog first, then forgetting these steps
 * (not learned, no section read) and saying so.
 */
export function ResetStepsRow({
  steps,
  words,
}: {
  steps: readonly StepId[]
  /** What the row, its dialog and the line after it say. */
  words: {
    readonly row: string
    readonly title: string
    readonly body: string
    readonly cancel: string
    readonly confirm: string
    readonly done: string
  }
}) {
  const store = useProgressStoreApi()
  const [asking, setAsking] = useState(false)
  return (
    <DangerGroup footnote={words.body}>
      <DangerRow title={words.row} onClick={() => setAsking(true)} />
      <ConfirmDialog
        open={asking}
        onOpenChange={setAsking}
        title={words.title}
        body={words.body}
        action={words.confirm}
        cancel={words.cancel}
        onConfirm={() => {
          resetSteps(store, steps)
          say(words.done)
        }}
      />
    </DangerGroup>
  )
}
