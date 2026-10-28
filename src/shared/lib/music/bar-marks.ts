/** How a bar ends, besides a plain barline: a double barline, the final one, or a repeat back. */
export const BARLINES = ['double', 'final', 'repeat'] as const
export type Barline = (typeof BARLINES)[number]

/** The endings a repeated passage takes, each the time through it is played: Flat's first to fourth. */
export const ENDINGS = [1, 2, 3, 4] as const
export type Ending = (typeof ENDINGS)[number]

/** How many times a repeated passage may be played: Flat's repeat ×N, twice to nine times. */
export const REPEAT_TIMES = [2, 3, 4, 5, 6, 7, 8, 9] as const

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
  /** A repeat's end: the times the passage is played, where not twice (or its endings' count). */
  readonly times?: number
  readonly ending?: Ending
  readonly segno?: true
  readonly coda?: true
  readonly jump?: Jump
  readonly fine?: true
  readonly toCoda?: true
  /** A page break before it, Flat's: in the page view its line starts a new page. */
  readonly pageBreak?: true
  /**
   * A bar repeat, Flat's: it plays the bar before again (1), or it and the next play the two bars
   * before again (2). Its notes are written out and played; the sign is drawn where they repeat.
   */
  readonly barRepeat?: BarRepeat
  /**
   * A multi-bar rest, Flat's: this many bars from it, each written as its rest, drawn as one rest
   * with their count over it while they stay empty.
   */
  readonly multiRest?: number
}

/** A bar repeat's length: one bar's sign, or two bars'. */
export const BAR_REPEATS = [1, 2] as const
export type BarRepeat = (typeof BAR_REPEATS)[number]

/** How many bars a multi-bar rest may draw as one: two to ninety-nine. */
export const MULTI_REST = { from: 2, to: 99 } as const

const MARK_KEYS = [
  'repeatStart',
  'barline',
  'times',
  'ending',
  'segno',
  'coda',
  'jump',
  'fine',
  'toCoda',
  'pageBreak',
  'barRepeat',
  'multiRest',
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

/** The endings' run a bar belongs to: the bars with an ending around it, their highest ending. */
function lastEnding(bars: readonly BarMarks[], index: number): number {
  let from = index
  while (from > 0 && bars[from - 1]?.ending !== undefined) from -= 1
  let last = 0
  for (let at = from; at < bars.length && (at === from || bars[at]?.ending !== undefined); at += 1)
    last = Math.max(last, bars[at]?.ending ?? 0)
  return last
}

/**
 * The bars in the order they are played, by their written index: a repeated passage played the
 * times its repeat's end says (twice by default, or as many times as its endings), back to its start
 * (the piece's, where none starts it) each time; on each time through only its ending of that number
 * (the 1st ending the first time, the 2nd the second, Flat's up to the 4th). A jump goes back once,
 * to the start or the sign, and plays on without repeats, taking each run of endings' last, as
 * players take it: to the end, stopping at Fine, or from To Coda to the coda's sign.
 */
export function playOrder(bars: readonly BarMarks[]): number[] {
  const order: number[] = []
  let start = 0
  let pass = 1
  let jumped: Jump | null = null
  let i = 0
  while (i < bars.length) {
    const bar = bars[i] ?? {}
    // Past a run of endings, the passage is done: the next repeat starts here.
    const came = order.at(-1)
    if (bar.ending === undefined && came === i - 1 && bars[came]?.ending !== undefined && !jumped) {
      pass = 1
      start = i
    }
    if (bar.repeatStart && pass === 1) start = i
    if (bar.ending !== undefined) {
      const taken = jumped ? lastEnding(bars, i) : pass
      if (bar.ending !== taken) {
        i += 1
        continue
      }
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
    // A repeat is taken before the jump at the same bar's end: back until played its times.
    if (bar.barline === 'repeat' && !jumped) {
      const times = bar.times ?? Math.max(2, bar.ending === undefined ? 0 : lastEnding(bars, i))
      if (pass < times) {
        pass += 1
        i = start
        continue
      }
      pass = 1
      start = i + 1
    }
    if (bar.jump && !jumped) {
      jumped = bar.jump
      pass = 1
      i = bar.jump.startsWith('ds')
        ? Math.max(
            0,
            bars.findIndex((each) => each.segno),
          )
        : 0
      continue
    }
    i += 1
  }
  return order
}
