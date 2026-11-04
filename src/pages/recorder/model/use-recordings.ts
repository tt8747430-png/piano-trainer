import { useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useLibraryStoreApi } from '@/entities/library'
import { entryTitles, usePiecesStoreApi, useRepertoire } from '@/entities/piece'
import { selectMidi, useSettings } from '@/entities/settings'
import {
  midiFile,
  selectFreeTakes,
  takeFileName,
  takeSounds,
  useTakes,
  useTakesStoreApi,
  type FreeTake,
  type TakeId,
} from '@/entities/take'
import { deleteTake, renameTake } from '@/features/manage-takes'
import { importSong, songOfTake } from '@/features/song-files'
import { useLocale } from '@/shared/i18n'
import { downloadFile } from '@/shared/lib'
import { usePlayback } from '@/shared/lib/services'

/** A group of the Recorder's list: the free recordings, or one song's takes. */
export interface RecordingGroup {
  readonly key: string
  /** The song's title, for a song's takes; none for the free recordings. */
  readonly song?: string
  readonly takes: readonly FreeTake[]
}

/** The Recorder's list and what each recording does (R29 B11). */
export interface Recordings {
  readonly groups: readonly RecordingGroup[]
  /** The recording sounding, if any. */
  readonly playing: TakeId | null
  play(take: FreeTake): void
  rename(id: TakeId, name: string): void
  exportMidi(take: FreeTake, title: string): void
  /** Makes a song of it, titled `title`, in My songs, and opens it. */
  makeSong(take: FreeTake, title: string): void
  remove(id: TakeId): void
}

/**
 * Every recording, grouped (R29 B11): the free ones first, then each song's takes under its title,
 * the newest first in each. Each plays as it was played (the Touch the keys are heard with), is named,
 * exported as a MIDI file, made a song of, or deleted.
 */
export function useRecordings(): Recordings {
  const takesStore = useTakesStoreApi()
  const pieces = usePiecesStoreApi()
  const library = useLibraryStoreApi()
  const navigate = useNavigate()
  const locale = useLocale()
  const repertoire = useRepertoire()
  const touch = useSettings((state) => selectMidi(state).touch)
  const free = useTakes(useShallow(selectFreeTakes))
  const takes = useTakes((state) => state.takes)
  const playback = usePlayback<TakeId>()
  const groups = useMemo(() => {
    const bySong = new Map<string, FreeTake[]>()
    for (const take of takes.toReversed()) {
      const list = bySong.get(take.pieceId) ?? []
      list.push(take)
      bySong.set(take.pieceId, list)
    }
    const songs = [...bySong].map(([pieceId, list]): RecordingGroup => {
      const entry = repertoire.entry(pieceId)
      return {
        key: pieceId,
        song: entry ? entryTitles(entry, locale).primary : pieceId,
        takes: list,
      }
    })
    return [...(free.length > 0 ? [{ key: 'free', takes: free }] : []), ...songs]
  }, [free, takes, repertoire, locale])
  return {
    groups,
    playing: playback.playing,
    play: (take) => playback.toggle(take.id, () => takeSounds(take, touch)),
    rename: (id, name) => renameTake(takesStore, id, name),
    exportMidi: (take, title) =>
      downloadFile(midiFile(take), takeFileName(title, take.made), 'audio/midi'),
    makeSong(take, title) {
      const id = importSong(pieces, library, songOfTake(take, title), null)
      void navigate({ to: '/songs/$pieceId', params: { pieceId: id } })
    },
    remove: (id) => deleteTake(takesStore, id),
  }
}
