import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useProgressStoreApi } from '@/entities/progress'
import type { StepId } from '@/entities/step'
import { ConfirmDialog, RowButton, say } from '@/shared/ui'
import { resetSteps } from '../reset-steps'

/**
 * A lesson's or a course's Reset progress (round 28): a destructive row asking in a dialog first,
 * then forgetting these steps (not learned, no section read) and saying so.
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
    <>
      <RowButton
        title={words.row}
        icon={RotateCcw}
        paint="sand"
        destructive
        onClick={() => setAsking(true)}
      />
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
    </>
  )
}
