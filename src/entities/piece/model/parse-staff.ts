import type { StaffNote } from '@/shared/lib/arrangement'
import { PIANO } from '@/shared/lib/music'
import { readBeats, ticksIn } from './beats'
import { ContentError } from './content-error'
import { readMarks } from './note-marks'
import { readPitch } from './note-text'
import type { ChartPiece } from './types'

/**
 * A single staff's notes (ADR 0097), the one at `place` top down: `E4/1 D4/.5[stacc] r/1 | C#5/1.5`,
 * note and octave on the piano (or `r` for a rest), a slash, then beats, and a note's marks in
 * brackets as a hand's (ADR 0097); `|` may mark bars and is ignored. None for a staff it has not.
 */
export function parseStaff(piece: ChartPiece, place: number): StaffNote[] {
  const text = piece.staves?.[place]?.notes
  if (text === undefined) return []
  const notes: StaffNote[] = []
  let tick = 0
  const tokens = text.split(/\s+/).filter((token) => token !== '' && token !== '|')
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
      throw new ContentError(
        piece.id,
        { staff: place + 1, note: i + 1 },
        `cannot read the note "${token}"`,
      )
    }
    if (written !== null)
      notes.push({ ...written, startTick: tick, durationTicks, ...(marks ? { marks } : {}) })
    tick += durationTicks
  })
  return notes
}
