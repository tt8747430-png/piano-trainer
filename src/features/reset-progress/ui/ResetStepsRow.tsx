import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useProgressStoreApi } from '@/entities/progress'
import type { StepId } from '@/entities/step'
import { RowButton, say } from '@/shared/ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'
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
      <AlertDialog open={asking} onOpenChange={setAsking}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{words.title}</AlertDialogTitle>
            <AlertDialogDescription>{words.body}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{words.cancel}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                resetSteps(store, steps)
                setAsking(false)
                say(words.done)
              }}
            >
              {words.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
