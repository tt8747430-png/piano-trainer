import { MIDDLE_C, midi, PIANO, type Midi } from '@/shared/lib/music'

/** A key of the computer keyboard as a piano key: semitones above the typing C, and its printed letter. */
export interface TypingKey {
  readonly semitones: number
  readonly letter: string
}

/** GarageBand's Musical Typing by physical key (`KeyboardEvent.code`), so every layout plays the same notes. */
export const TYPING_KEYS: ReadonlyMap<string, TypingKey> = new Map([
  ['KeyA', { semitones: 0, letter: 'A' }],
  ['KeyW', { semitones: 1, letter: 'W' }],
  ['KeyS', { semitones: 2, letter: 'S' }],
  ['KeyE', { semitones: 3, letter: 'E' }],
  ['KeyD', { semitones: 4, letter: 'D' }],
  ['KeyF', { semitones: 5, letter: 'F' }],
  ['KeyT', { semitones: 6, letter: 'T' }],
  ['KeyG', { semitones: 7, letter: 'G' }],
  ['KeyY', { semitones: 8, letter: 'Y' }],
  ['KeyH', { semitones: 9, letter: 'H' }],
  ['KeyU', { semitones: 10, letter: 'U' }],
  ['KeyJ', { semitones: 11, letter: 'J' }],
  ['KeyK', { semitones: 12, letter: 'K' }],
  ['KeyO', { semitones: 13, letter: 'O' }],
  ['KeyL', { semitones: 14, letter: 'L' }],
  ['KeyP', { semitones: 15, letter: 'P' }],
  ['Semicolon', { semitones: 16, letter: ';' }],
  ['Quote', { semitones: 17, letter: "'" }],
])
export const OCTAVE_DOWN = 'KeyZ'
export const OCTAVE_UP = 'KeyX'
/** Typing starts on middle C's octave… */
export const TYPING_START = MIDDLE_C
/** …and moves between C1 and C8. */
const LOWEST_C = midi(24)
const HIGHEST_C = midi(108)

/** The typing C an octave further, or the same one at C1 or C8. */
export function moveTypingOctave(typingC: Midi, by: -1 | 1): Midi {
  const next = typingC + 12 * by
  return next < LOWEST_C || next > HIGHEST_C ? typingC : midi(next)
}

/** The piano key a physical key plays from the typing C, if it plays one. */
export function typedKey(code: string, typingC: Midi): Midi | null {
  const typing = TYPING_KEYS.get(code)
  if (!typing) return null
  const key = typingC + typing.semitones
  return key <= PIANO.to ? midi(key) : null
}

/** Each piano key the typing keys play, with its letter. */
export function typingLetters(typingC: Midi): Map<Midi, string> {
  const letters = new Map<Midi, string>()
  for (const [code, { letter }] of TYPING_KEYS) {
    const key = typedKey(code, typingC)
    if (key !== null) letters.set(key, letter)
  }
  return letters
}
