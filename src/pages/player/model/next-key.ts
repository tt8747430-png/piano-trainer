import { pitchClass, pitchClassOf, tonicSpelling, type SpelledNote } from '@/shared/lib/music'

/** A perfect fifth, in semitones: the next key round the circle of fifths. */
const FIFTH = 7

/**
 * The key an exercise moves on to after a pass (A41): a fifth up round the circle, C → G → D … F →
 * C, or a half step up, C → D♭ → D …, as its page chose; its tonic spelled as a key's is (the
 * exercise spells it again by its own rule).
 */
export const nextKey = (root: SpelledNote, minor: boolean, order?: 'chromatic'): SpelledNote =>
  tonicSpelling(pitchClass(pitchClassOf(root) + (order === 'chromatic' ? 1 : FIFTH)), minor)
