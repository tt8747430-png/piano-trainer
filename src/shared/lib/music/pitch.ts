/** One of the 12 notes whatever the octave: 0 = C … 11 = B. */
export type PitchClass = number & { readonly __brand: 'PitchClass' }

/** A key on the MIDI keyboard: 60 = middle C. */
export type Midi = number & { readonly __brand: 'Midi' }

export const pitchClass = (n: number): PitchClass => (((n % 12) + 12) % 12) as PitchClass

export function midi(n: number): Midi {
  if (!Number.isInteger(n) || n < 0 || n > 127) {
    throw new RangeError(`A MIDI note is a whole number 0–127, not ${n}`)
  }
  return n as Midi
}
