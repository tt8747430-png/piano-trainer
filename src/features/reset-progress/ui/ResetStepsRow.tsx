import { RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useProgressStoreApi } from '@/entities/progress'
import type { StepId } from '@/entities/step'
import { RowButton, SettingsGroup, say } from '@/shared/ui'
import { resetSteps, restoreSteps } from '../reset-steps'

/**
 * A song's, a lesson's or a course's Progress (R31-S): its own group, one row, Reset progress, no
 * line under it (canvas 164); at once forgetting these steps (not learned, no section read),
 * the toast's Undo putting back what it forgot (R38). It loses no music, so it is no red row: the page's Delete
 * stands apart after it.
 */
export function ResetStepsRow({
  steps,
  words,
}: {
  steps: readonly StepId[]
  /** What the row and the toast after it say. */
  words: {
    readonly row: string
    readonly done: string
    readonly undo: string
  }
}) {
  const { t } = useTranslation('common')
  const store = useProgressStoreApi()
  return (
    <SettingsGroup flush title={t('progressGroup')}>
      <RowButton
        title={words.row}
        icon={RotateCcw}
        paint="sand"
        onClick={() => {
          const forgotten = resetSteps(store, steps)
          say(words.done, { label: words.undo, onClick: () => restoreSteps(store, forgotten) })
        }}
      />
    </SettingsGroup>
  )
}
