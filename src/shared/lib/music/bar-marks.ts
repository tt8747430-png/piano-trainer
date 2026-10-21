/** How a bar ends, besides a plain barline: a double barline, the final one, or a repeat back. */
export const BARLINES = ['double', 'final', 'repeat'] as const
export type Barline = (typeof BARLINES)[number]

/** The endings a repeated passage takes: the first time through, then the second. */
export const ENDINGS = [1, 2] as const
export type Ending = (typeof ENDINGS)[number]

/**
 * A jump back at a bar's end, taken once: to the start (Da Capo) or the sign (Dal Segno), then on to
 * the end, to Fine, or to the coda from To Coda.
 */
export const JUMPS = ['dc', 'dc-fine', 'dc-coda', 'ds', 'ds-fine', 'ds-coda'] as const
export type Jump = (typeof JUMPS)[number]

/**
 * What a bar's barlines say: a repeat starting at it, how it ends, the ending it belongs to; the
 * sign (segno) or the coda's sign at its start, and at its end a jump, Fine or To Coda.
 */
export interface BarMarks {
  readonly repeatStart?: true
  readonly barline?: Barline
  readonly ending?: Ending
  readonly segno?: true
  readonly coda?: true
  readonly jump?: Jump
  readonly fine?: true
  readonly toCoda?: true
}

const MARK_KEYS = [
  'repeatStart',
  'barline',
  'ending',
  'segno',
  'coda',
  'jump',
  'fine',
  'toCoda',
] as const satisfies readonly (keyof BarMarks)[]

/** A bar's marks alone, those it has: what each step from the text to the score carries on. */
export function barMarksOf(bar: BarMarks): BarMarks {
  return Object.fromEntries(
    MARK_KEYS.flatMap((key) => (bar[key] === undefined ? [] : [[key, bar[key]]])),
  ) as BarMarks
}

/** A bar's marks left out, as a played order leaves them once taken. */
export function withoutBarMarks<B extends BarMarks>(bar: B): Omit<B, keyof BarMarks> {
  const plain: Partial<B> = { ...bar }
  for (const key of MARK_KEYS) delete plain[key]
  return plain as Omit<B, keyof BarMarks>
}

/**
 * The bars in the order they are played, by their written index: back once from a repeat's end to
 * its start (the piece's, where none starts it), the 1st ending's bars left out the second time, the
 * 2nd ending's played then. A jump goes back once, to the start or the sign, and plays on without
 * repeats or 1st endings, as players take it: to the end, stopping at Fine, or from To Coda to the
 * coda's sign.
 */
export function playOrder(bars: readonly BarMarks[]): number[] {
  const order: number[] = []
  const taken = new Set<number>()
  let start = 0
  let second = false
  let jumped: Jump | null = null
  let i = 0
  while (i < bars.length) {
    const bar = bars[i] ?? {}
    if (bar.repeatStart && !second) start = i
    if ((second || jumped) && bar.ending === 1) {
      i += 1
      continue
    }
    order.push(i)
    if (jumped?.endsWith('fine') && bar.fine) break
    if (jumped?.endsWith('coda') && bar.toCoda) {
      const coda = bars.findIndex((each, index) => index > i && each.coda)
      if (coda >= 0) {
        i = coda
        continue
      }
    }
    // A repeat is taken before the jump at the same bar's end: back once, then on to the jump.
    if (bar.barline === 'repeat' && !taken.has(i) && !jumped) {
      taken.add(i)
      second = true
      i = start
      continue
    }
    if (bar.jump && !jumped) {
      jumped = bar.jump
      second = false
      i = bar.jump.startsWith('ds')
        ? Math.max(
            0,
            bars.findIndex((each) => each.segno),
          )
        : 0
      continue
    }
    // Past the repeated passage: the next repeat starts after it, unless a bar says otherwise.
    if (second && (bar.barline === 'repeat' || bar.ending === 2 || bars[i + 1]?.repeatStart)) {
      second = bar.ending === 2 && bars[i + 1]?.ending === 2
      start = i + 1
    }
    i += 1
  }
  return order
}
