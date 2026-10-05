import type { PedalPress, Played, TakeNote } from '@/entities/take'
import type { Midi } from '@/shared/lib/music'

/** A key or the pedal as the learner heard it against the click: `at`, in seconds on the audio clock. */
export type Heard =
  | {
      readonly kind: 'note'
      readonly midi: Midi
      readonly on: boolean
      readonly velocity: number
      readonly at: number
    }
  | { readonly kind: 'pedal'; readonly down: boolean; readonly at: number }

export interface TakeTiming {
  /** The first recorded bar's downbeat, on the audio clock. */
  readonly downbeat: number
  /** When Stop came, on the audio clock. */
  readonly stop: number
  /** The click's beats a minute: half a beat before the downbeat counts as on it. */
  readonly tempo: number
}

/**
 * What was played from the downbeat to Stop (ADR 0028), in whole milliseconds from the downbeat. A key
 * struck within half a beat before the downbeat counts as on it, keeping its length; an earlier one is
 * the count-in's and is not kept. A key struck again while held ends the earlier note there. The keys
 * and the pedal still down at Stop end at Stop; anything after it is not kept.
 */
export function takeOf(heard: readonly Heard[], { downbeat, stop, tempo }: TakeTiming): Played {
  if (stop <= downbeat) return { notes: [], pedal: [], length: 0 }
  const ms = (at: number) => Math.round((at - downbeat) * 1000)
  const length = ms(stop)
  const earliest = downbeat - 30 / tempo
  const notes: TakeNote[] = []
  const pedal: PedalPress[] = []
  const struck = new Map<Midi, { readonly at: number; readonly velocity: number }>()
  let pedalDown: number | null = null

  const letGo = (key: Midi, at: number) => {
    const note = struck.get(key)
    if (!note) return
    struck.delete(key)
    const onset = Math.max(0, ms(note.at))
    const held = Math.min(ms(at) - ms(note.at), length - onset)
    notes.push({ midi: key, at: onset, held: Math.max(0, held), velocity: note.velocity })
  }
  const lift = (at: number) => {
    if (pedalDown === null) return
    const up = ms(at)
    if (up > 0) pedal.push({ down: Math.max(0, ms(pedalDown)), up })
    pedalDown = null
  }

  for (const event of heard) {
    if (event.at > stop) continue
    if (event.kind === 'pedal') {
      if (!event.down) lift(event.at)
      else pedalDown ??= event.at
      continue
    }
    if (!event.on) {
      letGo(event.midi, event.at)
      continue
    }
    if (event.at < earliest) continue
    letGo(event.midi, event.at)
    struck.set(event.midi, { at: event.at, velocity: event.velocity })
  }
  for (const key of [...struck.keys()]) letGo(key, stop)
  lift(stop)
  notes.sort((a, b) => a.at - b.at || a.midi - b.midi)
  return { notes, pedal, length }
}
