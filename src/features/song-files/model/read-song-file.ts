import { isZip, MxlError, NotAScoreError, unzipMusicXml, XmlError } from '@/shared/lib/musicxml'
import { isMidiFile, MidiFileError } from '@/shared/lib/read-midi-file'
import { songOfMidi } from './song-of-midi'
import { songOfMusicXml, SongFileError, type ReadSong } from './song-of-music-xml'

/** The largest file read: a score's MusicXML runs to a few megabytes at most. */
export const MOST_BYTES = 20 * 1024 * 1024

/** The files Import opens, as a file picker's `accept` lists them. */
export const SONG_FILE_TYPES = [
  '.musicxml',
  '.mxl',
  '.xml',
  '.mid',
  '.midi',
  'application/vnd.recordare.musicxml+xml',
  'application/vnd.recordare.musicxml',
  'audio/midi',
  'audio/x-midi',
].join(',')

/** Why a file did not open as a song. */
export type SongFileProblem = SongFileError['reason']

/** A file read as a song, or why it is none. */
export type SongFileResult =
  ({ readonly ok: true } & ReadSong) | { readonly ok: false; readonly problem: SongFileProblem }

/** Whether text begins as XML does: a tag, after any declaration, comment or space. */
const looksLikeXml = (text: string) => /^\uFEFF?\s*</.test(text)

/**
 * A file chosen or dropped, read as a song (ADR 0107): a Standard MIDI File, a compressed MusicXML
 * (.mxl) or a MusicXML text, told apart by their first bytes, not their names. Never throws: a file
 * that is too large, no score, or a score that is broken says so.
 */
export async function readSongFile(file: {
  readonly name: string
  readonly size: number
  arrayBuffer(): Promise<ArrayBuffer>
}): Promise<SongFileResult> {
  if (file.size > MOST_BYTES) return { ok: false, problem: 'too-large' }
  try {
    const bytes = new Uint8Array(await file.arrayBuffer())
    if (isMidiFile(bytes)) return { ok: true, ...songOfMidi(bytes, file.name) }
    const text = isZip(bytes) ? await unzipMusicXml(bytes) : new TextDecoder().decode(bytes)
    if (!looksLikeXml(text)) return { ok: false, problem: 'not-a-score' }
    return { ok: true, ...songOfMusicXml(text, file.name) }
  } catch (error) {
    if (error instanceof SongFileError) return { ok: false, problem: error.reason }
    if (error instanceof NotAScoreError) return { ok: false, problem: 'not-a-score' }
    if (error instanceof XmlError || error instanceof MxlError || error instanceof MidiFileError)
      return { ok: false, problem: 'broken' }
    throw error
  }
}
