import { Link, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PublicCategory } from '@/shared/api/public-library'
import { CategoryPicker } from '@/widgets/song-preview'
import { Music } from 'lucide-react'
import {
  hasEditableOriginal,
  isDegreePiece,
  PIECES,
  useRepertoire,
  type ChartPiece,
  type Piece,
} from '@/entities/piece'
import { useOriginalDraft } from '@/features/edit-original'
import { editsContent, useAccount } from '@/shared/lib/account'
import { DraftPublishScreen } from '@/widgets/content-editor'
import { PublishScreen } from '@/features/publish'
import { BackButton, ButtonLink, NotFound, TileMark } from '@/shared/ui'
import { useSongPublish } from '../model/use-song-publish'

/** The route's song, or the way back where it is gone or cannot be published. */
export function PublishPage() {
  const { t } = useTranslation('common')
  const { pieceId } = useParams({ from: '/shell/songs/$pieceId/publish' })
  const piece = useRepertoire().piece(pieceId)
  if (!piece)
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs" />}>{t('notFound.toSongs')}</ButtonLink>
      </NotFound>
    )
  return <Publish key={piece.id} piece={piece} />
}

/**
 * A song's Publish page (R29 B6), reached from its Settings' Publish…: a learner's own song to Explore
 * (round 27, Noji's); one of the app's, an editor's, to every learner.
 */
function Publish({ piece }: { piece: Piece }) {
  const [chosen, setChosen] = useState<PublicCategory | null | undefined>(undefined)
  const { item, title, publishing } = useSongPublish(piece, chosen ?? null)
  const { account } = useAccount()
  // Once its published category is read, it is the choice a new version keeps unless changed
  // (adjusted while rendering, React's way for state that follows a prop).
  const published = publishing.category
  if (chosen === undefined && published !== null) setChosen(published)
  if (!item && editsContent(account) && hasEditableOriginal(piece.id) && !isDegreePiece(piece))
    return <OriginalPublish piece={piece} title={title} />
  if (!item)
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs/$pieceId" params={{ pieceId: piece.id }} />}>
          {title}
        </ButtonLink>
      </NotFound>
    )
  // Its category (B3), as published until the learner chooses another.
  const category = chosen === undefined ? publishing.category : chosen
  return (
    <PublishScreen
      item={{ id: item.sourceId, kind: item.kind, title: item.title, meta: item.meta }}
      publishing={publishing}
      back={<BackButton />}
      fields={<CategoryPicker value={category} onChange={setChosen} />}
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
      back={<BackButton />}
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
