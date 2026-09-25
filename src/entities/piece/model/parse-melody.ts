import type { Melody, MelodyNote } from '@/shared/lib/arrangement'
import { midiOf, parseNoteName, type Midi } from '@/shared/lib/music'
import { readBeats, ticksIn } from './beats'
import { ContentError } from './content-error'
import type { ChartPiece } from './types'

/** `C#5`: a note name and a one-digit octave, or null when that is no key on the keyboard. */
function keyOf(pitch: string): Midi | null {
  const written = /^(.+?)(\d)$/.exec(pitch)
  const spelled = written?.[1] ? parseNoteName(written[1]) : null
  if (!written || !spelled) return null
  try {
    return midiOf(spelled, Number(written[2]))
  } catch (error) {
    if (error instanceof RangeError) return null
    throw error
  }
}

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
    const key = pitch === 'r' ? null : keyOf(pitch)
    if (extra.length > 0 || durationTicks === null || (pitch !== 'r' && key === null)) {
      throw new ContentError(piece.id, { note: i + 1 }, `cannot read the note "${token}"`)
    }
    if (key !== null) notes.push({ midi: key, startTick: tick, durationTicks })
    tick += durationTicks
  })
  return notes
}
