import type { Hand } from './fingering'

/**
 * The clefs a staff is written in (ADR 0097, 0114): the treble and the bass, each also an octave or
 * two above or below (8va, 8vb, 15ma, 15mb); the C clefs on each line, soprano to baritone; and the F
 * clef on the third line and the fifth, as notation apps offer them.
 */
export const CLEFS = [
  'treble',
  'treble-8va',
  'treble-8vb',
  'treble-15ma',
  'treble-15mb',
  'soprano',
  'mezzo-soprano',
  'alto',
  'tenor',
  'baritone',
  'bass',
  'bass-8va',
  'bass-8vb',
  'bass-15ma',
  'bass-15mb',
  'baritone-f',
  'subbass',
] as const
export type Clef = (typeof CLEFS)[number]

/** A clef's sign: G, C or F. */
export type ClefShape = 'G' | 'C' | 'F'

/** How a clef is drawn and what it reads: its sign, the line it stands on and the octaves it moves. */
export interface ClefForm {
  readonly shape: ClefShape
  /** The staff line its sign's note sits on, from the bottom: the treble's G on 2, the bass's F on 4. */
  readonly line: 1 | 2 | 3 | 4 | 5
  /** Octaves the notes sound from where they are written: 1 for 8va, -1 for 8vb, ±2 for 15. */
  readonly octaves: -2 | -1 | 0 | 1 | 2
}

export const CLEF_FORMS: Readonly<Record<Clef, ClefForm>> = {
  treble: { shape: 'G', line: 2, octaves: 0 },
  'treble-8va': { shape: 'G', line: 2, octaves: 1 },
  'treble-8vb': { shape: 'G', line: 2, octaves: -1 },
  'treble-15ma': { shape: 'G', line: 2, octaves: 2 },
  'treble-15mb': { shape: 'G', line: 2, octaves: -2 },
  soprano: { shape: 'C', line: 1, octaves: 0 },
  'mezzo-soprano': { shape: 'C', line: 2, octaves: 0 },
  alto: { shape: 'C', line: 3, octaves: 0 },
  tenor: { shape: 'C', line: 4, octaves: 0 },
  baritone: { shape: 'C', line: 5, octaves: 0 },
  bass: { shape: 'F', line: 4, octaves: 0 },
  'bass-8va': { shape: 'F', line: 4, octaves: 1 },
  'bass-8vb': { shape: 'F', line: 4, octaves: -1 },
  'bass-15ma': { shape: 'F', line: 4, octaves: 2 },
  'bass-15mb': { shape: 'F', line: 4, octaves: -2 },
  'baritone-f': { shape: 'F', line: 3, octaves: 0 },
  subbass: { shape: 'F', line: 5, octaves: 0 },
}

/** The step (from C0, seven an octave) each sign names: G4, middle C, F3. */
const SIGN_STEP: Readonly<Record<ClefShape, number>> = { G: 4 * 7 + 4, C: 4 * 7, F: 3 * 7 + 3 }

/**
 * The note a clef puts on a staff's top line as it sounds, in steps from C0 (seven an octave): F5 on
 * the treble, A3 on the bass, F4 on the alto; an octave clef's an octave from it.
 */
export function topLineStep(clef: Clef): number {
  const { shape, line, octaves } = CLEF_FORMS[clef]
  return SIGN_STEP[shape] + 2 * (5 - line) + 7 * octaves
}

/** Each sign as text in the music font (Unicode's musical symbols): 𝄞, 𝄡, 𝄢; their 8va and 8vb forms. */
const GLYPHS: Readonly<Record<ClefShape, Readonly<Record<-1 | 0 | 1, string>>>> = {
  G: { [-1]: '\u{1D120}', 0: '\u{1D11E}', 1: '\u{1D11F}' },
  C: { [-1]: '\u{1D121}', 0: '\u{1D121}', 1: '\u{1D121}' },
  F: { [-1]: '\u{1D124}', 0: '\u{1D122}', 1: '\u{1D123}' },
}

/** A clef as one character of the music font, for a small picture of it (a 15 as its 8). */
export function clefGlyph(clef: Clef): string {
  const { shape, octaves } = CLEF_FORMS[clef]
  return GLYPHS[shape][Math.sign(octaves) as -1 | 0 | 1]
}

/** Octaves a clef's notes sound from where they are written: treble 8vb's an octave down. */
export const clefOctaves = (clef: Clef): number => CLEF_FORMS[clef].octaves

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
