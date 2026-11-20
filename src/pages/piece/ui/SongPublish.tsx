import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Music } from 'lucide-react'
import {
  hasEditableOriginal,
  isDegreePiece,
  PIECES,
  type ChartPiece,
  type Piece,
} from '@/entities/piece'
import { useOriginalDraft } from '@/features/edit-original'
import { editsContent, useAccount } from '@/shared/lib/account'
import { DraftPublishScreen } from '@/widgets/content-editor'
import { PublishScreen } from '@/features/publish'
import { TileMark } from '@/shared/ui'
import { PieceMark } from '@/widgets/piece-cover'
import { useSongByline } from '../model/use-song-byline'
import { useSongPublish } from '../model/use-song-publish'

/**
 * A song's Publish (R29 B6), a page inside its Settings' window (the SongSettings boards), reached by
 * its Publish row: a learner's own song to Explore (round 27, Noji's); one of the app's, an editor's,
 * to every learner. The window's bar is its bar.
 */
export function SongPublish({ piece }: { piece: Piece }) {
  const { item, title, publishing } = useSongPublish(piece)
  const line = useSongByline(piece)
  const { account } = useAccount()
  if (!item && editsContent(account) && hasEditableOriginal(piece.id) && !isDegreePiece(piece))
    return <OriginalPublish piece={piece} title={title} />
  if (!item) return null
  return (
    <PublishScreen
      item={{
        id: item.sourceId,
        kind: item.kind,
        title: item.title,
        meta: item.meta,
        // The song's library tile at the head's 64, as its Settings' (SongCover).
        mark: (
          <span className="block shrink-0 [&_[data-slot=row-tile]]:size-16 [&_[data-slot=row-tile]]:rounded-[10px]">
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
function OriginalPublish({ piece, title }: { piece: ChartPiece; title: string }) {
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
