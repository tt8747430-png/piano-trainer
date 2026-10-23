import { Link, useParams, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectOwnSong, usePieces, usePiecesStoreApi } from '@/entities/piece'
import { ButtonLink, NotFound } from '@/shared/ui'
import { editorTarget } from '../model/editor-target'
import { ScoreEditor } from './ScoreEditor'

function Editing({ id }: { id: string }) {
  const { t } = useTranslation('common')
  // The bar the caret opens on, as printed: the Player's cursor's, where Edit came from it (ADR 0090).
  const { bar } = useSearch({ from: '/full-screen/edit/$pieceId' })
  // The visit opens on what the store holds now; the editor saves into it from there.
  const pieces = usePiecesStoreApi()
  const [target] = useState(() => editorTarget(pieces.getState(), id))
  // An own song deleted in another tab: nothing is left to write into.
  const gone = usePieces(
    (state) => target?.kind === 'song' && selectOwnSong(state, target.id) === undefined,
  )
  if (!target) return null
  if (gone)
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs" />}>{t('notFound.toSongs')}</ButtonLink>
      </NotFound>
    )
  return <ScoreEditor target={target} bar={bar} />
}

/** The score editor over the route's piece: a catalog song's, study's or listing's version, or an own song. */
export function ScoreEditorPage() {
  const { pieceId } = useParams({ from: '/full-screen/edit/$pieceId' })
  return <Editing key={pieceId} id={pieceId} />
}
