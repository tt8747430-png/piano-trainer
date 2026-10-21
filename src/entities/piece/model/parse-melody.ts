import type { Melody, MelodyNote } from '@/shared/lib/arrangement'
import { PIANO } from '@/shared/lib/music'
import { readBeats, ticksIn } from './beats'
import { ContentError } from './content-error'
import { readMarks } from './note-marks'
import { readPitch } from './note-text'
import type { ChartPiece } from './types'

/**
 * `E4/1 D4/.5[stacc] r/1 | C#5/1.5`: note and octave on the piano (or `r` for a rest), a slash, then
 * beats, and a note's marks in brackets as a hand's (ADR 0063).
 */
export function parseMelody(piece: ChartPiece): Melody | undefined {
  if (piece.melody === undefined) return undefined
  const notes: MelodyNote[] = []
  let tick = 0
  const tokens = piece.melody.split(/\s+/).filter((token) => token !== '' && token !== '|')
  tokens.forEach((token, i) => {
    const [, played = token, marksText] = /^([^[\]]*)(?:\[([^\]]*)\])?$/.exec(token) ?? []
    const marks = marksText === undefined ? undefined : readMarks(marksText)
    const [pitch = '', beatsText = '', ...extra] = played.split('/')
    const beats = readBeats(beatsText)
    const durationTicks = beats === null ? null : ticksIn(beats)
    const read = pitch === 'r' ? null : readPitch(pitch)
    // As a hand's: a note off the piano is not read.
    const written = read && read.midi >= PIANO.from && read.midi <= PIANO.to ? read : null
    const unread = marks === null || (marks !== undefined && pitch === 'r')
    if (
      extra.length > 0 ||
      unread ||
      durationTicks === null ||
      (pitch !== 'r' && written === null)
    ) {
      throw new ContentError(piece.id, { note: i + 1 }, `cannot read the note "${token}"`)
    }
    if (written !== null)
      notes.push({ ...written, startTick: tick, durationTicks, ...(marks ? { marks } : {}) })
    tick += durationTicks
  })
  return notes
}

/** A piece's more voices (ADR 0066), each read as its tune is. */
export const parseVoices = (piece: ChartPiece): Melody[] =>
  (piece.voices ?? []).map((voice) => parseMelody({ ...piece, melody: voice }) ?? [])
