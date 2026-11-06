import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProgressStoreApi } from '@/entities/progress'
import type { StepId } from '@/entities/step'
import { ConfirmDialog, RowButton, SettingsGroup, say } from '@/shared/ui'
import { resetSteps } from '../reset-steps'

/**
 * A song's, a lesson's or a course's Progress (R31-S): its own group, one row, Reset progress, with
 * what it does on the row's line; asking in the one dialog first, then forgetting these steps (not
 * learned, no section read) and saying so. It loses no music, so it is no red row: the page's Delete
 * stands apart after it.
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
  const { t } = useTranslation('common')
  const store = useProgressStoreApi()
  const [asking, setAsking] = useState(false)
  return (
    <SettingsGroup flush title={t('progressGroup')}>
      <RowButton
        title={words.row}
        detail={words.body}
        icon={RotateCcw}
        paint="sand"
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
    </SettingsGroup>
  )
}
