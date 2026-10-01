import { useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { usePiecesStoreApi } from '@/entities/piece'
import { editorTarget } from '../model/editor-target'
import { ScoreEditor } from './ScoreEditor'

function Editing({ id }: { id: string }) {
  // The visit opens on what the store holds now; the editor saves into it from there.
  const pieces = usePiecesStoreApi()
  const [target] = useState(() => editorTarget(pieces.getState(), id))
  return target ? <ScoreEditor target={target} /> : null
}

/** The score editor over the route's piece: a catalog song's, study's or listing's version, or an own song. */
export function ScoreEditorPage() {
  const { pieceId } = useParams({ from: '/full-screen/edit/$pieceId' })
  return <Editing key={pieceId} id={pieceId} />
}
