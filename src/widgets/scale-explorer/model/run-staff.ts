import type { ScaleStaffSettings } from '@/entities/settings'
import type { Hand, Midi, PlacedTone } from '@/shared/lib/music'
import type { TimedMusic, TimedNote } from '@/shared/lib/notation'

/** The words the staff's theory is written in, in the learner's language. */
export interface RunStaffWords {
  readonly whole: string
  readonly half: string
  /** A step and a half, harmonic minor's augmented 2nd. */
  readonly wholeAndHalf: string
  readonly tonic: string
  readonly leading: string
  readonly lower: string
  readonly upper: string
  /** A mode's characteristic note (A43), named over it. */
  readonly characteristic: string
}

/** A step between two keys named, where it is one a scale takes. */
function stepName(semitones: number, words: RunStaffWords): string | undefined {
  if (semitones === 1) return words.half
  if (semitones === 2) return words.whole
  if (semitones === 3) return words.wholeAndHalf
  return undefined
}

/**
 * The run with its theory written on one hand's staff (A43): each note's degree under it, the step to
 * the next named over the gap, the tonic and leading note named, and the tetrachords' first notes
 * named, as the learner's switches say; a mode's characteristic note always named. Degrees come from the run's keys, up and down.
 */
export function runStaff(
  music: TimedMusic,
  hand: Hand,
  placed: readonly PlacedTone[],
  layers: ScaleStaffSettings,
  words: RunStaffWords,
  /** A mode's degree that sets it apart (`characteristicDegree`), as its tone writes it: always named. */
  characteristic?: string,
  /** The scale compared with (A43): by this scale's degree, the other's note written over it. */
  compared?: ReadonlyMap<string, string>,
): TimedMusic {
  const any = layers.degrees || layers.steps || layers.tonic || layers.tetrachords
  if (!any && characteristic === undefined && !compared?.size) return music
  const degrees = new Map<Midi, string>(placed.map((key) => [key.midi, key.tone.degree]))
  // Tetrachords split a seven-note scale in two: the 1st to 4th and the 5th to the octave.
  const sevens = new Set(placed.map((key) => key.tone.pitchClass)).size === 7
  const own = music.notes
    .map((note, index) => ({ note, index }))
    .filter(({ note }) => note.hand === hand)
    .sort((a, b) => a.note.startTick - b.note.startTick)
  const notes: TimedNote[] = [...music.notes]
  own.forEach(({ note, index }, at) => {
    const degree = degrees.get(note.midi)
    const next = own[at + 1]?.note
    const step = next ? stepName(Math.abs(next.midi - note.midi), words) : undefined
    const named =
      layers.tonic && degree === '1'
        ? words.tonic
        : layers.tonic && degree === '7'
          ? words.leading
          : undefined
    const half =
      layers.tetrachords && sevens && next && next.midi > note.midi
        ? degree === '1'
          ? words.lower
          : degree === '5'
            ? words.upper
            : undefined
        : undefined
    const special =
      characteristic !== undefined && degree === characteristic ? words.characteristic : undefined
    const other = degree === undefined ? undefined : compared?.get(degree)
    const text = [other, special, named, half].filter(Boolean).join(' · ') || undefined
    notes[index] = {
      ...note,
      marks: {
        ...note.marks,
        ...(layers.degrees && degree ? { numeral: degree } : {}),
        ...(layers.steps && step ? { step } : {}),
        ...(text ? { text } : {}),
      },
    }
  })
  return { ...music, notes }
}
