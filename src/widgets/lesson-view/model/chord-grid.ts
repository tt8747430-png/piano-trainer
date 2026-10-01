import {
  type ChordQuality,
  chordSymbol,
  PITCH_CLASSES,
  qualityRootSpelling,
} from '@/shared/lib/music'

/** One quality on all twelve roots from C (Pianote's grid), each root spelled by the kernel's one rule. */
export const gridSymbols = (quality: ChordQuality): string[] =>
  PITCH_CLASSES.map((pc) => chordSymbol({ root: qualityRootSpelling(pc, quality), quality }))
