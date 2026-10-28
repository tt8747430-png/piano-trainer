import { readSharedSong, songTitle, TITLE_MAX, type SharedSong } from '@/entities/piece'
import { writeDraft } from '@/features/score-editor'
import { readMusicXml } from '@/shared/lib/musicxml'
import { draftOfScore, type LeftCounts } from './draft-of-score'

/** A song read from a file: what it is, and what it left out. */
export interface ReadSong {
  readonly song: SharedSong
  readonly leftOut: LeftCounts
}

/** The most notes a song read from a file may hold: more is no song a learner keeps. */
export const MOST_NOTES = 20_000

/** Why a file is no song. */
export class SongFileError extends Error {
  override readonly name = 'SongFileError'
  constructor(readonly reason: 'not-a-score' | 'too-large' | 'broken') {
    super(reason)
  }
}

/** A song's title: the file's, else its name, cut to a title's length. */
export const titleOf = (title: string | undefined, fileName: string): string =>
  songTitle((title?.trim() || fileName.replace(/\.[^.]+$/, '')).slice(0, TITLE_MAX)) ??
  fileName.slice(0, TITLE_MAX)

/**
 * A MusicXML file's text as a song (ADR 0107): read, its music written as the editor writes a song,
 * and read back as a save is, so it opens. Throws a SongFileError where it is too large or does not
 * read as a song.
 */
export function songOfMusicXml(text: string, fileName: string): ReadSong {
  const score = readMusicXml(text)
  if (score.notes.length > MOST_NOTES) throw new SongFileError('too-large')
  const { draft, leftOut } = draftOfScore(score)
  const title = titleOf(score.title, fileName)
  let song: SharedSong | null
  try {
    song = readSharedSong({ ...writeDraft(draft), title })
  } catch {
    song = null
  }
  if (!song) throw new SongFileError('broken')
  return { song, leftOut }
}
