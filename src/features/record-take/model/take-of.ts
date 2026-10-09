import type { PedalPress, Played, TakeNote } from '@/entities/take'
import { PIANO, type Midi } from '@/shared/lib/music'
import type { PedalKind } from '@/shared/lib/schedule'

/** A key or a pedal as the learner heard it against the click: `at`, in seconds on the audio clock. */
export type Heard =
  | {
      readonly kind: 'note'
      readonly midi: Midi
      readonly on: boolean
      readonly velocity: number
      readonly at: number
    }
  | {
      readonly kind: 'pedal'
      readonly pedal: PedalKind
      readonly down: boolean
      readonly at: number
    }

export interface TakeTiming {
  /** The first recorded bar's downbeat, on the audio clock. */
  readonly downbeat: number
  /** When Stop came, on the audio clock. */
  readonly stop: number
  /** The click's beats a minute: a key struck half a beat before the downbeat counts as on it. */
  readonly tempo: number
}

/**
 * Whether a key struck at `at` is the take's: one of the piano's keys, struck no earlier than half a
 * beat before the downbeat (one struck earlier is the count-in's). What takes the takes' room.
 */
export const isKept = (
  key: Midi,
  at: number,
  { downbeat, tempo }: Pick<TakeTiming, 'downbeat' | 'tempo'>,
): boolean => key >= PIANO.from && key <= PIANO.to && at >= downbeat - 30 / tempo

/**
 * What was played from the downbeat to Stop (ADR 0028), in whole milliseconds from the downbeat: the
 * keys `isKept` keeps, one struck before the downbeat counted as on it, keeping its length. A key
 * struck again while held ends the earlier note there. Each pedal's presses are its own. The keys and
 * the pedals still down at Stop end at Stop; anything after it is not kept.
 */
export function takeOf(heard: readonly Heard[], timing: TakeTiming): Played {
  const { downbeat, stop } = timing
  if (stop <= downbeat) return { notes: [], pedals: [], length: 0 }
  const ms = (at: number) => Math.round((at - downbeat) * 1000)
  const length = ms(stop)
  const notes: TakeNote[] = []
  const pedals: PedalPress[] = []
  const struck = new Map<Midi, { readonly at: number; readonly velocity: number }>()
  /** When each pedal down went down. */
  const pedalDown = new Map<PedalKind, number>()

  const letGo = (key: Midi, at: number) => {
    const note = struck.get(key)
    if (!note) return
    struck.delete(key)
    const onset = Math.max(0, ms(note.at))
    const held = Math.min(ms(at) - ms(note.at), length - onset)
    notes.push({ midi: key, at: onset, held: Math.max(0, held), velocity: note.velocity })
  }
  const lift = (pedal: PedalKind, at: number) => {
    const down = pedalDown.get(pedal)
    if (down === undefined) return
    pedalDown.delete(pedal)
    const up = ms(at)
    if (up > 0) pedals.push({ pedal, down: Math.max(0, ms(down)), up })
  }

  for (const event of heard) {
    if (event.at > stop) continue
    if (event.kind === 'pedal') {
      if (!event.down) lift(event.pedal, event.at)
      else if (!pedalDown.has(event.pedal)) pedalDown.set(event.pedal, event.at)
      continue
    }
    if (!event.on) {
      letGo(event.midi, event.at)
      continue
    }
    if (!isKept(event.midi, event.at, timing)) continue
    letGo(event.midi, event.at)
    struck.set(event.midi, { at: event.at, velocity: event.velocity })
  }
  for (const key of [...struck.keys()]) letGo(key, stop)
  for (const pedal of [...pedalDown.keys()]) lift(pedal, stop)
  notes.sort((a, b) => a.at - b.at || a.midi - b.midi)
  pedals.sort((a, b) => a.down - b.down)
  return { notes, pedals, length }
}
