import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Music } from 'lucide-react'
import { PIECES, type ChartPiece, type Piece } from '@/entities/piece'
import { useOriginalDraft } from '@/features/edit-original'
import { DraftPublishScreen } from '@/widgets/content-editor'
import { PublishScreen, type PublishItem, type usePublish } from '@/features/publish'
import { TileMark } from '@/shared/ui'
import { PieceMark } from '@/widgets/piece-cover'
import { useSongByline } from '../model/use-song-byline'

/**
 * A song's Publish (R29 B6), a page inside its Settings' window (the SongSettings boards), reached by
 * its Publish row: a learner's own song to Explore (round 27, Noji's). The window's bar is its bar.
 */
export function SongPublish({
  piece,
  item,
  publishing,
}: {
  piece: Piece
  item: PublishItem
  publishing: ReturnType<typeof usePublish>
}) {
  const line = useSongByline(piece)
  return (
    <PublishScreen
      item={{
        id: item.sourceId,
        kind: item.kind,
        title: item.title,
        meta: item.meta,
        // The song's library tile at the head's 64, as its Settings' (SongCover).
        mark: (
          <span className="block shrink-0 [&_[data-slot=row-tile]]:size-16 [&_[data-slot=row-tile]]:rounded-thumb">
            <PieceMark entry={piece} />
          </span>
        ),
        line,
      }}
      publishing={publishing}
    />
  )
}

/** One of the app's songs published to every learner, an editor's (R29 B6). */
export function OriginalPublish({ piece, title }: { piece: ChartPiece; title: string }) {
  const { t } = useTranslation('editor')
  const draft = useOriginalDraft(piece)
  return (
    <DraftPublishScreen
      kind="piece"
      id={piece.id}
      draft={draft}
      title={title}
      path={`/songs/${piece.id}`}
      view={<Link to="/songs/$pieceId" params={{ pieceId: piece.id }} />}
      unreadable={t('original.unreadable')}
      removable={!PIECES.some((each) => each.id === piece.id)}
      preview={
        <div className="card flex min-h-16 items-center gap-3 p-2">
          <TileMark icon={Music} paint="sand" />
          <span className="text-lg font-semibold text-balance">{title}</span>
        </div>
      }
    />
  )
}
