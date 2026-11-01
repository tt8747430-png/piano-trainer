import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useRepertoire, type Piece } from '@/entities/piece'
import { PublishScreen } from '@/features/publish'
import { BackButton, ButtonLink, NotFound } from '@/shared/ui'
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

/** Publish in library (round 27, Noji's): the Publish screen, reached from the song's Settings. */
function Publish({ piece }: { piece: Piece }) {
  const { item, title, publishing } = useSongPublish(piece)
  if (!item)
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs/$pieceId" params={{ pieceId: piece.id }} />}>
          {title}
        </ButtonLink>
      </NotFound>
    )
  return (
    <PublishScreen
      item={{ id: item.sourceId, kind: item.kind, title: item.title, meta: item.meta }}
      publishing={publishing}
      back={
        <BackButton fallback={{ to: '/songs/$pieceId/settings', params: { pieceId: piece.id } }} />
      }
    />
  )
}
