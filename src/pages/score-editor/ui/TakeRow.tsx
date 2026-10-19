import { Link } from '@tanstack/react-router'
import { Ellipsis } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Take } from '@/entities/take'
import { PlayButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useScoreEditorContext } from '../model/editor-context'
import { useTakeTitle } from '../model/use-take-title'
import { ActionMenu } from './ActionMenu'
import { DeleteTakeDialog } from './DeleteTakeDialog'
import { TakeName } from './TakeName'

/**
 * One take as a row: Play at its start (the list's: one plays at a time), its name (a link to its
 * page) over its length and tempo, and its other actions in a menu at its end: Write into the score,
 * Download, and Delete, which asks first.
 */
export function TakeRow({
  take,
  playing,
  onPlay,
}: {
  take: Take
  playing: boolean
  onPlay: () => void
}) {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const name = useId()
  const title = useTakeTitle(take)
  const [deleting, setDeleting] = useState(false)
  return (
    <li aria-labelledby={name} className="flex items-center gap-3 py-3">
      <PlayButton label={t('recorder.play')} playing={playing} onClick={onPlay} />
      <div className="min-w-0 flex-1">
        <TakeName
          take={take}
          title={
            <Link
              id={name}
              to="/edit/$pieceId/takes/$takeId"
              params={{ pieceId: take.pieceId, takeId: take.id }}
              className="text-link underline-offset-4 transition-colors ease-out hover:underline focus-visible:rounded-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {title}
            </Link>
          }
        />
      </div>
      <ActionMenu
        label={t('recorder.more')}
        align="end"
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('recorder.more')}
            title={t('recorder.more')}
            className="shrink-0 rounded-full"
          />
        }
        trigger={<Ellipsis aria-hidden />}
        actions={[
          {
            key: 'write',
            label: t('recorder.write'),
            onSelect: () => takes.show({ kind: 'write', id: take.id }),
          },
          { key: 'download', label: t('recorder.download'), onSelect: () => takes.download(take) },
          { key: 'delete', label: t('recorder.delete'), onSelect: () => setDeleting(true) },
        ]}
      />
      <DeleteTakeDialog
        take={take}
        open={deleting}
        onOpenChange={setDeleting}
        onDelete={() => takes.remove(take.id)}
      />
    </li>
  )
}
