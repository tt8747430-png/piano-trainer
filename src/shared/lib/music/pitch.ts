/** One of the 12 notes whatever the octave: 0 = C … 11 = B. */
export type PitchClass = number & { readonly __brand: 'PitchClass' }

/** A key on the MIDI keyboard: 60 = middle C. */
export type Midi = number & { readonly __brand: 'Midi' }

/** Whether a number is a pitch class: a whole number 0–11. */
const isPitchClass = (n: number): n is PitchClass => Number.isInteger(n) && n >= 0 && n < 12

/** Whether a number is a MIDI key: a whole number 0–127. */
export const isMidi = (n: number): n is Midi => Number.isInteger(n) && n >= 0 && n <= 127

/** A whole number of semitones as its pitch class, whatever the octave. */
export function pitchClass(n: number): PitchClass {
  const pc = ((n % 12) + 12) % 12
  if (!isPitchClass(pc)) throw new RangeError(`Only a whole number has a pitch class, not ${n}`)
  return pc
}

/** The 12 notes from C: a row of roots or tonics to choose from. */
export const PITCH_CLASSES: readonly PitchClass[] = Array.from({ length: 12 }, (_, n) =>
  pitchClass(n),
)

export function midi(n: number): Midi {
  if (!isMidi(n)) throw new RangeError(`A MIDI note is a whole number 0–127, not ${n}`)
  return n
}
