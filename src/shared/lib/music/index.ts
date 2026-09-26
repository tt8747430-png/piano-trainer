export { midi, PITCH_CLASSES, pitchClass, type Midi, type PitchClass } from './pitch'
export {
  MIDDLE_C,
  MIDDLE_OCTAVES,
  PIANO,
  isBlackKey,
  keyboardRange,
  rangeOf,
  type KeyRange,
} from './keyboard'
export {
  LETTERS,
  midiOf,
  note,
  noteFromParam,
  noteName,
  noteParam,
  parseNoteName,
  pitchClassOf,
  plainSpelling,
  rootSpelling,
  sameNote,
  type Accidental,
  type Letter,
  type NoteParam,
  type SpelledNote,
} from './note'
export { intervalBetween, spellAbove, type Interval } from './interval'
export {
  keyName,
  keyPrefersSharps,
  keySignature,
  parseKey,
  tonicSpelling,
  transposeNote,
  type Key,
} from './key'
export { CHORD_ROLES, type ChordRole, type Tone } from './tone'
export {
  CHORD_FAMILIES,
  CHORD_QUALITIES,
  chordBass,
  chordFamily,
  chordRootSpelling,
  chordSymbol,
  qualitiesIn,
  qualityIntervals,
  qualitySpellings,
  qualitySuffix,
  spellChord,
  type Chord,
  type ChordFamily,
  type ChordQuality,
} from './chord'
export { ChordSymbolError, parseChordSymbol } from './chord-symbol'
export {
  SCALE_KINDS,
  isMinorScale,
  relativeScale,
  scaleGaps,
  scaleIntervals,
  scaleRootSpelling,
  spellScale,
  type ScaleGap,
  type ScaleKind,
} from './scale'
export { lastInversion, placeChord, placeScale, type PlacedChord, type PlacedTone } from './place'
export { scaleFingering, type Finger, type Hand } from './fingering'
export { diatonicChords, type DiatonicChord } from './diatonic'
export {
  SKILLS,
  chordSkill,
  isSkillId,
  scaleSkill,
  skillOf,
  type Skill,
  type SkillId,
} from './skill'
