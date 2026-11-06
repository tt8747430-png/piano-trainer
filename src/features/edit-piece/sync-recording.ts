import { syncOf, type PiecesStore } from '@/entities/piece'

/**
 * Moves a song's recording against its music by `ms` (R34, the Player's Staves › Recording › Sync):
 * later where positive, kept on a step within its range; in time, the song is left out.
 */
export function syncRecording(store: PiecesStore, id: string, ms: number): void {
  const kept = syncOf(ms)
  store.setState(({ recordingSync }) => {
    const { [id]: _was, ...others } = recordingSync
    return { recordingSync: kept === 0 ? others : { ...others, [id]: kept } }
  })
}
