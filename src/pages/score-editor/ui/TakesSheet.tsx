import { Download, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { selectRoomLeft, selectTake, selectTakesOf, useTakes, type TakeId } from '@/entities/take'
import { BackButton, say, Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { SelectAct, SelectDock } from '@/widgets/song-library'
import { useScoreEditorContext } from '../model/editor-context'
import { TAKES_PAGE } from '../model/use-editor-takes'
import { TakeList } from './TakeList'
import { RecordReview } from './RecordReview'

/**
 * The takes (ADR 0028, 0096), their own sheet: opened by itself on a take just kept, and from Takes
 * beside the dock's Record. The piece's takes, each heard, reviewed and saved to the score,
 * downloaded or deleted; Review your recording (A40) is a page of the sheet, opened on a take just
 * kept. Recording is Record's alone: the sheet holds no Record, and no facts the learner cannot
 * change. Select (the Takes board; every list of the learner's things has it): the header's Select,
 * Cancel while on, the title "n selected" or "Select takes", and the floating bar's Download and
 * Delete on what is chosen, or Download all and Delete all while nothing is; Delete goes at once,
 * with Undo.
 */
export function TakesSheet() {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const { page } = takes
  const room = useTakes(selectRoomLeft)
  const list = useTakes(useShallow((state) => selectTakesOf(state, takes.pieceId)))
  // A take deleted meanwhile (in another tab) leaves its form for the takes.
  const writing = useTakes((state) =>
    page.kind === 'write' ? selectTake(state, page.id) : undefined,
  )
  const [picked, setPicked] = useState<ReadonlySet<TakeId> | null>(null)
  // A take deleted meanwhile is no longer chosen.
  const chosen = picked ? list.filter((take) => picked.has(take.id)) : []
  const acting = chosen.length > 0 ? chosen : list
  const selecting = picked !== null && !writing && list.length > 0
  const choose = (id: TakeId) =>
    setPicked((now) => {
      const next = new Set(now)
      if (!next.delete(id)) next.add(id)
      return next
    })
  const download = () => {
    for (const take of acting) takes.download(take)
    setPicked(null)
  }
  const remove = () => {
    // Undone last first, so each take goes back into its own place.
    const undos = acting.map((take) => takes.remove(take.id)).reverse()
    setPicked(null)
    say(t('recorder.deletedMany', { count: acting.length }), {
      label: t('undo'),
      onClick: () => {
        for (const undo of undos) undo()
      },
    })
  }
  const title = writing
    ? t('review.title')
    : selecting
      ? chosen.length > 0
        ? t('recorder.selected', { count: chosen.length })
        : t('recorder.selectTitle')
      : t('recorder.title')
  return (
    <Sheet
      open={takes.open}
      onOpenChange={(open) => {
        if (!open) setPicked(null)
        takes.show(open ? TAKES_PAGE : null)
      }}
    >
      <SheetContent
        title={title}
        back={
          writing ? (
            <BackButton onClick={() => takes.show(TAKES_PAGE)} />
          ) : list.length > 0 ? (
            <Button variant="bar" onClick={() => setPicked(selecting ? null : new Set())}>
              {t(selecting ? 'recorder.cancel' : 'recorder.select')}
            </Button>
          ) : undefined
        }
      >
        {writing ? (
          <RecordReview take={writing} />
        ) : (
          <div className="flex flex-col gap-4 pt-2">
            {page.kind === 'takes' && page.nothingPlayed ? (
              <p role="status">{t('recorder.nothing')}</p>
            ) : null}
            {room === 0 ? <p>{t('recorder.full')}</p> : null}
            <TakeList list={list} picked={selecting ? picked : null} onChoose={choose} />
            {selecting ? (
              <SelectDock label={title} inSheet>
                <SelectAct
                  label={t(chosen.length > 0 ? 'recorder.download' : 'recorder.downloadAll')}
                  icon={Download}
                  onClick={download}
                />
                <SelectAct
                  label={t(chosen.length > 0 ? 'recorder.delete' : 'recorder.deleteAll')}
                  icon={Trash2}
                  destructive
                  onClick={remove}
                />
              </SelectDock>
            ) : null}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
