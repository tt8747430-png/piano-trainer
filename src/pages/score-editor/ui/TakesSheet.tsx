import { useTranslation } from 'react-i18next'
import { selectRoomLeft, selectTake, useTakes } from '@/entities/take'
import { Sheet, SheetContent } from '@/shared/ui'
import { useScoreEditorContext } from '../model/editor-context'
import { TAKES_PAGE } from '../model/use-editor-takes'
import { TakeList } from './TakeList'
import { WriteTakePage } from './WriteTakePage'

/**
 * The takes (ADR 0028, 0096), their own sheet: opened by itself on a take just kept, and from Takes
 * beside the dock's Record. The piece's takes, each heard, written into the score, downloaded or
 * deleted; a take's form to write it is a page of the sheet. Recording is Record's alone: the sheet
 * holds no Record, and no facts the learner cannot change.
 */
export function TakesSheet() {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const { page } = takes
  const room = useTakes(selectRoomLeft)
  // A take deleted meanwhile (in another tab) leaves its form for the takes.
  const writing = useTakes((state) =>
    page.kind === 'write' ? selectTake(state, page.id) : undefined,
  )
  return (
    <Sheet open={takes.open} onOpenChange={(open) => takes.show(open ? TAKES_PAGE : null)}>
      <SheetContent title={writing ? t('recorder.write') : t('recorder.title')}>
        {writing ? (
          <WriteTakePage take={writing} />
        ) : (
          <div className="flex flex-col gap-4 pt-2">
            {page.kind === 'takes' && page.nothingPlayed ? (
              <p role="status">{t('recorder.nothing')}</p>
            ) : null}
            {room === 0 ? <p>{t('recorder.full')}</p> : null}
            <TakeList />
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
