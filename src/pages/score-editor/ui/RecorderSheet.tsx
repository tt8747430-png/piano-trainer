import { Circle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectTake, useTakes } from '@/entities/take'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useScoreEditorContext } from '../model/editor-context'
import { TAKES_PAGE } from '../model/use-editor-takes'
import { RecordButton } from './RecordButton'
import { RecordPanel } from './RecordPanel'
import { TakeList } from './TakeList'
import { WriteTakePage } from './WriteTakePage'

/**
 * The takes (ADR 0028), opened from the bar's Record: Record over the caret's bar, in the footer, in reach however long the list;
 * and the piece's takes, each heard, written into the score, downloaded or deleted; a take's form to
 * write it is a page of the sheet.
 */
export function RecorderSheet() {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const { page } = takes
  // A take deleted meanwhile (in another tab) leaves its form for the takes.
  const writing = useTakes((state) =>
    page.kind === 'write' ? selectTake(state, page.id) : undefined,
  )
  return (
    <Sheet open={takes.open} onOpenChange={(open) => takes.show(open ? TAKES_PAGE : null)}>
      <SheetTrigger
        render={
          <Button
            variant="surface"
            size="icon"
            aria-label={t('recorder.open')}
            title={t('recorder.open')}
            disabled={takes.stage !== 'idle'}
          />
        }
      >
        {/* A recorder's red dot, as every recorder's Record wears. */}
        <Circle aria-hidden className="fill-current text-destructive" />
      </SheetTrigger>
      <SheetContent
        title={writing ? t('recorder.write') : t('recorder.title')}
        footer={writing ? undefined : <RecordButton />}
      >
        {writing ? (
          <WriteTakePage take={writing} />
        ) : (
          <div className="flex flex-col gap-6 pt-2">
            <RecordPanel />
            <TakeList />
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
