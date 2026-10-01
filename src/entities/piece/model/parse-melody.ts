import type { Melody, MelodyNote } from '@/shared/lib/arrangement'
import { readBeats, ticksIn } from './beats'
import { ContentError } from './content-error'
import { readPitch } from './note-text'
import type { ChartPiece } from './types'

/** `E4/1 D4/.5 r/1 | C#5/1.5`: note and octave (or `r` for a rest), a slash, then beats. */
export function parseMelody(piece: ChartPiece): Melody | undefined {
  if (piece.melody === undefined) return undefined
  const notes: MelodyNote[] = []
  let tick = 0
  const tokens = piece.melody.split(/\s+/).filter((token) => token !== '' && token !== '|')
  tokens.forEach((token, i) => {
    const [pitch = '', beatsText = '', ...extra] = token.split('/')
    const beats = readBeats(beatsText)
    const durationTicks = beats === null ? null : ticksIn(beats)
    const written = pitch === 'r' ? null : readPitch(pitch)
    if (extra.length > 0 || durationTicks === null || (pitch !== 'r' && written === null)) {
      throw new ContentError(piece.id, { note: i + 1 }, `cannot read the note "${token}"`)
    }
    if (written !== null) notes.push({ ...written, startTick: tick, durationTicks })
    tick += durationTicks
  })
  return notes
}
