import { CLEF_FORMS, type Clef, type ClefShape } from '@/shared/lib/music'
import type { SmuflName } from './smufl'

/** A clef's glyph in SMuFL, its 8 or 15 the font's own (gClef8vb, fClef15ma), never composed. */
const CLEF_GLYPHS: Readonly<Record<ClefShape, Readonly<Record<-2 | -1 | 0 | 1 | 2, SmuflName>>>> = {
  G: { [-2]: 'gClef15mb', [-1]: 'gClef8vb', 0: 'gClef', 1: 'gClef8va', 2: 'gClef15ma' },
  C: { [-2]: 'cClef', [-1]: 'cClef', 0: 'cClef', 1: 'cClef', 2: 'cClef' },
  F: { [-2]: 'fClef15mb', [-1]: 'fClef8vb', 0: 'fClef', 1: 'fClef8va', 2: 'fClef15ma' },
}

/** The SMuFL glyph a clef prints as. */
export function clefSmufl(clef: Clef): SmuflName {
  const { shape, octaves } = CLEF_FORMS[clef]
  return CLEF_GLYPHS[shape][Math.max(-2, Math.min(2, octaves)) as -2 | -1 | 0 | 1 | 2]
}
