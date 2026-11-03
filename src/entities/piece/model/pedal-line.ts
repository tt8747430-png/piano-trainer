import { PEDALS, pedalLine, TICKS_PER_BEAT, type Pedal, type PedalEvent } from '@/shared/lib/music'
import { ticksIn } from './beats'
import { ContentError } from './content-error'
import type { PieceId } from './types'

/** `change@15.5`, `up@31:3`: a kind, then its beat from the music's start, a decimal or a fraction. */
const EVENT = /^([a-z]+)@(\d*\.?\d+|\d+:\d+)$/

const isPedal = (word: string): word is Pedal => (PEDALS as readonly string[]).includes(word)

/** Beats written as the staves write them (`4`, `15.5`, `1:3`), as whole ticks, or null. */
function beatTicks(text: string): number | null {
  const [whole = '', over] = text.split(':')
  const beats = over === undefined ? Number(whole) : Number(whole) / Number(over)
  return Number.isFinite(beats) && beats >= 0 ? ticksIn(beats) : null
}

/**
 * A piece's pedal line (ADR 0097), `down@0 change@4 up@15.5`: each event's kind and its beat from
 * the music's start, in order, a change where an up and a down meet. None where it has none; an
 * event that does not read is the content's mistake, a ContentError naming it.
 */
export function readPedalLine(text: string | undefined, pieceId: PieceId): PedalEvent[] {
  const words = (text ?? '').split(/\s+/).filter((word) => word !== '')
  return pedalLine(
    words.map((word, i) => {
      const [, kind = '', beats = ''] = EVENT.exec(word) ?? []
      const tick = beatTicks(beats)
      if (!isPedal(kind) || tick === null)
        throw new ContentError(pieceId, { pedal: i + 1 }, `cannot read the pedal "${word}"`)
      return { tick, kind }
    }),
  )
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

/** A tick as beats: a decimal where three places write it exactly, else a fraction (`7:6`). */
function beatText(tick: number): string {
  if ((tick * 1000) % TICKS_PER_BEAT === 0) return String(tick / TICKS_PER_BEAT)
  const common = gcd(tick, TICKS_PER_BEAT)
  return `${tick / common}:${TICKS_PER_BEAT / common}`
}

/** A pedal line as a piece writes it, in order: `down@0 change@4 up@15.5`. */
export const writePedalLine = (events: readonly PedalEvent[]): string =>
  pedalLine(events)
    .map(({ kind, tick }) => `${kind}@${beatText(tick)}`)
    .join(' ')
