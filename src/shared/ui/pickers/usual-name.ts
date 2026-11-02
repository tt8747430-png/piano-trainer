import { rootSpelling, type PitchClass, type SpelledNote } from '@/shared/lib/music'

/** A pitch's usual name, as the major keys name it (MuseScore's, Flat's): C D♭ D E♭ E F F♯ G A♭ A B♭ B. */
export const usualName = (pc: PitchClass): SpelledNote => rootSpelling(pc, false)
