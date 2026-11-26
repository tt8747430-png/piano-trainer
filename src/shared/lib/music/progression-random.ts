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

/**
 * Piston's table of usual root progressions (Harmony, ch. 3), by degree from the tonic: where each
 * chord usually goes (1), sometimes (0.6), less often (0.3). I is followed by IV or V, sometimes vi,
 * less often ii or iii; ii by V, sometimes IV or vi, less often I or iii; iii by vi, sometimes IV,
 * less often I, ii or V; IV by V, sometimes I or ii, less often iii or vi; V by I, sometimes IV or vi,
 * less often ii or iii; vi by ii or V, sometimes iii or IV, less often I; vii° by I or iii, sometimes
 * vi. A step missing goes nowhere often enough to choose.
 */
const USUAL: readonly Readonly<Partial<Record<number, number>>>[] = [
  { 3: 1, 4: 1, 5: 0.6, 1: 0.3, 2: 0.3 },
  { 4: 1, 3: 0.6, 5: 0.6, 0: 0.3, 2: 0.3 },
  { 5: 1, 3: 0.6, 0: 0.3, 1: 0.3, 4: 0.3 },
  { 4: 1, 0: 0.6, 1: 0.6, 2: 0.3, 5: 0.3 },
  { 0: 1, 3: 0.6, 5: 0.6, 1: 0.3, 2: 0.3 },
  { 1: 1, 4: 1, 2: 0.6, 3: 0.6, 0: 0.3 },
  { 0: 1, 2: 1, 5: 0.6 },
]

/** How usual a step from one of the key's chords to another is: Piston's weight, else rare. */
const usual = (from: Numeral, to: Numeral): number => USUAL[from.degree]?.[to.degree] ?? 0.1

const read = (text: string): Numeral => {
  const numeral = parseNumeral(text)
  if (!numeral) throw new Error(`randomProgression: ${text} does not read`)
  return numeral
}

/**
 * A progression of `bars` chords from the key (R29 CP2, Randomize): it starts on the tonic, moves by
 * function (tonic → subdominant → dominant → tonic, as the harmony books teach), each step as likely
 * as Piston's table makes it usual, never repeats a chord on the next bar, and ends on the dominant
 * and home. `random` gives numbers in [0, 1): a
 * seeded one in a test.
 */
export function randomProgression(key: Key, bars: number, random: () => number): Numeral[] {
  const chords = CHORDS[key.minor ? 'minor' : 'major'].map(read)
  const of = (fn: HarmonicFunction) =>
    chords.filter((numeral) => harmonicFunction(numeral, key.minor) === fn)
  const tonic = chords[0] ?? read('I')
  const dominant = chords[3] ?? read('V')
  // One of the options, the more usual a step from the chord before, the likelier.
  const pick = (options: readonly Numeral[], from: Numeral): Numeral | undefined => {
    const weights = options.map((option) => usual(from, option))
    let left = random() * weights.reduce((sum, weight) => sum + weight, 0)
    return options.find((_, at) => (left -= weights[at] ?? 0) < 0) ?? options.at(-1)
  }
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
    line.push(pick(options, last) ?? of('subdominant')[0] ?? tonic)
  }
  return [...line, dominant, tonic]
}
