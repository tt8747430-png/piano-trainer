import { harmonicFunction, type HarmonicFunction } from './harmony'
import type { Key } from './key'
import { parseNumeral, type Numeral } from './numerals'

/** The key's own triads by what they do, the plainest first. */
const CHORDS: Readonly<Record<'major' | 'minor', readonly string[]>> = {
  major: ['I', 'IV', 'ii', 'V', 'vi', 'iii', 'vii°'],
  // Natural minor's chords, its V major from harmonic minor (the leading tone).
  minor: ['i', 'iv', 'ii°', 'V', 'VI', 'III', 'VII'],
}

/** Where each function may go next, the books' order first: home → away → tension → home. */
const NEXT: Readonly<Record<HarmonicFunction, readonly HarmonicFunction[]>> = {
  tonic: ['subdominant', 'tonic'],
  subdominant: ['dominant', 'subdominant'],
  dominant: ['tonic'],
}

const read = (text: string): Numeral => {
  const numeral = parseNumeral(text)
  if (!numeral) throw new Error(`randomProgression: ${text} does not read`)
  return numeral
}

/**
 * A progression of `bars` chords from the key (R29 CP2, Randomize): it starts on the tonic, moves by
 * function (tonic → subdominant → dominant → tonic, as the harmony books teach), never repeats a
 * chord on the next bar, and ends on the dominant and home. `random` gives numbers in [0, 1): a
 * seeded one in a test.
 */
export function randomProgression(key: Key, bars: number, random: () => number): Numeral[] {
  const chords = CHORDS[key.minor ? 'minor' : 'major'].map(read)
  const of = (fn: HarmonicFunction) =>
    chords.filter((numeral) => harmonicFunction(numeral, key.minor) === fn)
  const tonic = chords[0] ?? read('I')
  const dominant = chords[3] ?? read('V')
  const pick = <T>(options: readonly T[]): T | undefined =>
    options[Math.min(options.length - 1, Math.floor(random() * options.length))]
  const count = Math.max(0, Math.floor(bars))
  if (count === 0) return []
  if (count === 1) return [tonic]
  if (count === 2) return [tonic, dominant]
  const line: Numeral[] = [tonic]
  // The bars between home and the closing dominant; the last of them leads to it, so not itself one.
  for (let at = 1; at < count - 2; at++) {
    const last = line[at - 1] ?? tonic
    const from = harmonicFunction(last, key.minor)
    const leadsOn = at === count - 3
    const options = NEXT[from]
      .filter((fn) => !(leadsOn && fn === 'dominant'))
      .flatMap((fn) => of(fn))
      .filter((numeral) => numeral !== last)
    line.push(pick(options) ?? of('subdominant')[0] ?? tonic)
  }
  return [...line, dominant, tonic]
}
