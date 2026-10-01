import { useMemo } from 'react'
import { usePieces } from './context'
import { repertoire, type Repertoire } from './repertoire'
import type { PiecesState } from './store'

const selectVersions = (state: PiecesState) => state.versions
const selectSongs = (state: PiecesState) => state.songs

/** The repertoire over the learner's pieces: a new one only when their versions or songs change. */
export function useRepertoire(): Repertoire {
  const versions = usePieces(selectVersions)
  const songs = usePieces(selectSongs)
  return useMemo(() => repertoire({ versions, songs }), [versions, songs])
}
