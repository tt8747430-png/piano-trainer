import type { Chord } from './chord'
import { hasMinorThird } from './numerals'

/**
 * A chord as Simplify plays it (Chordify's, ADR 0104): its plain triad on its root, minor where it
 * has a minor 3rd (a diminished chord too), major otherwise (augmented, suspended); a slash chord's
 * bass and every added note dropped.
 */
export const simplifyChord = (chord: Chord): Chord => ({
  root: chord.root,
  quality: hasMinorThird(chord.quality) ? 'min' : 'maj',
})

/** Whether a chord is already its plain triad: major or minor, over no other bass. */
export const isSimpleChord = (chord: Chord): boolean =>
  chord.bass === undefined && (chord.quality === 'maj' || chord.quality === 'min')
