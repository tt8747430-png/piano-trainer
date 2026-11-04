import { useMemo } from 'react'
import { useLibrary } from '@/entities/library'
import { usePieces } from '@/entities/piece'
import { profileFigures, useProgress, type ProfileFigures } from '@/entities/progress'
import { useTakes } from '@/entities/take'

/** What the Profile counts (B1), from the progress and the learner's takes, songs and folders. */
export function useProfileFigures(): ProfileFigures {
  const progress = useProgress((state) => state)
  const recordings = useTakes((state) => state.takes.length)
  const ownSongs = usePieces((state) => state.songs.length)
  const folders = useLibrary((state) => state.folders.length)
  return useMemo(
    () => profileFigures(progress, { recordings, ownSongs, folders }),
    [progress, recordings, ownSongs, folders],
  )
}
