import { Link } from '@tanstack/react-router'
import { Download, Ellipsis, NotebookPen, Trash2 } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { Take } from '@/entities/take'
import { ActionMenu, PlayButton, say } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { SelectCheck } from '@/widgets/song-library'
import { useScoreEditorContext } from '../model/editor-context'
import { useTakeTitle } from '../model/use-take-title'
import { TakeName } from './TakeName'

/**
 * One take as a row, as the Takes board's TKROW: 64 tall, Play at its start in its sand circle (the
 * list's: one plays at a time), its name (a link to its page) over when it was made, its length and
 * tempo, and its other actions in a menu at its end: Review, Download, and Delete, at once with Undo.
 * While Select is on (`chosen`), the whole row chooses it, its check in Play's place, no menu.
 */
export function TakeRow({
  take,
  playing,
  onPlay,
  chosen,
  onChoose,
}: {
  take: Take
  playing: boolean
  onPlay: () => void
  /** Whether it is chosen while Select is on; undefined while it is off. */
  chosen?: boolean
  onChoose: () => void
}) {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const name = useId()
  const title = useTakeTitle(take)
  if (chosen !== undefined)
    return (
      <li className="relative">
        <button
          type="button"
          role="checkbox"
          aria-checked={chosen}
          onClick={onChoose}
          className="flex min-h-16 w-full items-center gap-3 py-2 pr-1 pl-3 text-left transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
        >
          <span className="grid size-11 shrink-0 place-items-center">
            <SelectCheck checked={chosen} />
          </span>
          <span className="min-w-0 flex-1">
            <TakeName take={take} />
          </span>
        </button>
      </li>
    )
  return (
    <li aria-labelledby={name} className="flex min-h-16 items-center gap-3 py-2 pr-1 pl-3">
      <PlayButton
        label={t('recorder.play')}
        playing={playing}
        onClick={onPlay}
        className="border-0 bg-muted hover:bg-muted/70 [&_svg]:size-4.5"
      />
      <div className="min-w-0 flex-1">
        <TakeName
          take={take}
          title={
            <Link
              id={name}
              to="/edit/$pieceId/takes/$takeId"
              params={{ pieceId: take.pieceId, takeId: take.id }}
              className="flex min-h-6 items-center truncate"
            >
              {title}
            </Link>
          }
        />
      </div>
      <ActionMenu
        label={title}
        align="end"
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('recorder.more')}
            title={t('recorder.more')}
            className="shrink-0 rounded-pill"
          />
        }
        trigger={<Ellipsis aria-hidden />}
        actions={[
          {
            key: 'write',
            label: t('review.open'),
            icon: NotebookPen,
            onSelect: () => takes.show({ kind: 'write', id: take.id }),
          },
          {
            key: 'download',
            label: t('recorder.download'),
            icon: Download,
            onSelect: () => takes.download(take),
          },
          {
            key: 'delete',
            label: t('recorder.delete'),
            icon: Trash2,
            destructive: true,
            onSelect: () => {
              const undo = takes.remove(take.id)
              say(t('recorder.deleted'), { label: t('undo'), onClick: undo })
            },
          },
        ]}
      />
    </li>
  )
}
