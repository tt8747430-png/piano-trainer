import { useTranslation } from 'react-i18next'
import type { Take } from '@/entities/take'
import { Button } from '@/shared/ui/primitives/button'
import { useScoreEditorContext } from '../model/editor-context'
import { TakeName } from './TakeName'

/** A take's deletion, asked once more as a page of the sheet: a take cannot be brought back. */
export function DeleteTakePage({ take, onBack }: { take: Take; onBack: () => void }) {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  return (
    <div className="flex flex-col gap-5 pt-2">
      <TakeName take={take} />
      <div className="flex flex-wrap gap-3">
        <Button
          variant="destructive"
          onClick={() => {
            takes.remove(take.id)
            onBack()
          }}
        >
          {t('recorder.deleting.confirm')}
        </Button>
        <Button variant="soft" onClick={onBack}>
          {t('recorder.deleting.cancel')}
        </Button>
      </div>
    </div>
  )
}
