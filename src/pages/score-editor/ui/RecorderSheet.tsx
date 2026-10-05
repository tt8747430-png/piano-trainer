import { CircleDot } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectTake, useTakes, type TakeId } from '@/entities/take'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useScoreEditorContext } from '../model/editor-context'
import { DeleteTakePage } from './DeleteTakePage'
import { RecordPanel } from './RecordPanel'
import { TakeList } from './TakeList'
import { WriteTakePage } from './WriteTakePage'

/** The sheet's page: the takes, or one take's form to write it, or its deletion asked. */
type RecorderPage =
  | { readonly kind: 'takes' }
  | { readonly kind: 'write'; readonly id: TakeId }
  | { readonly kind: 'delete'; readonly id: TakeId }

const TAKES: RecorderPage = { kind: 'takes' }

/**
 * The takes (ADR 0028): Record over the caret's bar, and the piece's takes, each heard, written into
 * the score, downloaded or deleted; a take's form and its deletion are pages of the sheet.
 */
export function RecorderSheet() {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const [page, setPage] = useState<RecorderPage>(TAKES)
  // A take deleted meanwhile (in another tab) leaves its page for the takes.
  const take = useTakes((state) => (page.kind === 'takes' ? undefined : selectTake(state, page.id)))
  const shown = take ? page : TAKES
  const back = () => setPage(TAKES)
  const title =
    shown.kind === 'write'
      ? t('recorder.write')
      : shown.kind === 'delete'
        ? t('recorder.deleting.title')
        : t('recorder.title')
  return (
    <Sheet
      open={takes.open}
      onOpenChange={(open) => {
        takes.setOpen(open)
        if (!open) setPage(TAKES)
      }}
    >
      <SheetTrigger
        render={
          <Button
            variant="surface"
            size="icon"
            aria-label={t('recorder.open')}
            disabled={takes.recorder.stage !== 'idle'}
          />
        }
      >
        <CircleDot aria-hidden />
      </SheetTrigger>
      <SheetContent title={title}>
        {shown.kind === 'takes' || !take ? (
          <div className="flex flex-col gap-6 pt-2">
            <RecordPanel />
            <TakeList
              onWrite={(id) => setPage({ kind: 'write', id })}
              onDelete={(id) => setPage({ kind: 'delete', id })}
            />
          </div>
        ) : shown.kind === 'write' ? (
          <WriteTakePage take={take} onBack={back} />
        ) : (
          <DeleteTakePage take={take} onBack={back} />
        )}
      </SheetContent>
    </Sheet>
  )
}
