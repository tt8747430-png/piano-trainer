export {
  initialPractice,
  practiceReducer,
  practisedHands,
  type PracticeEvent,
  type PracticeState,
} from './practice-machine'
export { handsIn, PRACTICE_MODES, waitsForNotes, type PracticeMode } from './practice-mode'
export { usePractice, type Practice } from './use-practice'
export { FULL_MIX, partGain, type Mix, type MixPart } from './mix'
export {
  hiddenStaves,
  isStavesParam,
  noteStaff,
  readStaves,
  stavesParam,
  trackOf,
  withTrack,
  type PlayerStaves,
  type TrackChoice,
  type TrackId,
} from './staves'
export { isLoopParam, loopParam, loopTicks, readLoop, type BarRange, type LoopParam } from './loop'
export { beatGroupInBar, firstPlayedBar, writtenBarAt, writtenBarOf } from './written-bar'
export {
  chordDiagram,
  chordSummary,
  DIAGRAM_KEYS,
  diagramChord,
  type DiagramChord,
  type DiagramInversions,
} from './chord-diagram'
export {
  beatAt,
  beatCells,
  beatGroupFrom,
  playedBeatCells,
  type BeatCell,
  type CellBar,
  type PlayedBeat,
} from './beats'
export { useBeat } from './use-beat'

export { arrangePiece, isSingleStaff, ownChoice, simplifies } from './arrange-piece'
export type { PracticeChoice } from './choice'
export { diagramMarks, keysRange, pedalKeys, playerRange, practiceMarks } from './marks'
export { spellPitchClass } from './note-names'
export { arrangeWalk, WALK, type WalkChoice } from './walk'
export { arrangeChromatic } from './chromatic'
export { arrangeExercise } from './exercise'
export {
  chordsParam,
  CHROMATIC,
  CHROMATIC_DIRECTIONS,
  readChords,
  type ChromaticChoice,
  type ChromaticChords,
  type ChromaticDirection,
} from './chromatic-choice'
export { arrangeProgression } from './progression'
export { PROGRESSION, type ProgressionChoice } from './progression-choice'
export { walkingFit } from './walking'
export { PractiseChords } from './ui/PractiseChords'
