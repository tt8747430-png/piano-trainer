import {
  chordRootSpelling,
  noteName,
  PITCH_CLASSES,
  qualityIntervals,
  qualitySuffix,
  type ChordQuality,
} from '@/shared/lib/music'

/** One quality on all twelve roots from C (Pianote's grid), each root spelled by the kernel's one rule. */
export const gridSymbols = (quality: ChordQuality): string[] =>
  PITCH_CLASSES.map(
    (pc) => noteName(chordRootSpelling(pc, qualityIntervals(quality))) + qualitySuffix(quality),
  )
