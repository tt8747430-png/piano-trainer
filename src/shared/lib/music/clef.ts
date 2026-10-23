import type { Hand } from './fingering'

/** The clefs a hand's staff is written in (ADR 0069). */
export const CLEFS = ['treble', 'bass'] as const
export type Clef = (typeof CLEFS)[number]

/** The clef each hand's staff takes, where a bar changes it: from that bar on. */
export type HandClefs = Readonly<Partial<Record<Hand, Clef>>>

/** The clef a hand is written in where nothing changes it: the right hand's treble, the left's bass. */
export const HOME_CLEF: Readonly<Record<Hand, Clef>> = { rh: 'treble', lh: 'bass' }

/**
 * The clef each hand is in at every bar, from bars that each change it or not: a change holds until
 * the next; the home clefs before any.
 */
export function clefsInForce(
  bars: readonly { readonly clefs?: HandClefs }[],
): Readonly<Record<Hand, Clef>>[] {
  let now = HOME_CLEF
  return bars.map((bar) => {
    if (bar.clefs) now = { ...now, ...bar.clefs }
    return now
  })
}
