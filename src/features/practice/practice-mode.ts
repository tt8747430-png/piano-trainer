/**
 * What the Player does with the learner (R29 B8, the Modes sheet): Listen, the app plays; Sight-read
 * (`wait`), the cursor waits for the right notes; Practice, the same for one hand at a time; Interpret
 * (`follow`), the cursor follows the learner's tempo.
 */
export const PRACTICE_MODES = ['listen', 'wait', 'practice', 'follow'] as const
export type PracticeMode = (typeof PRACTICE_MODES)[number]

/** Whether the mode waits for the learner's notes: every mode but Listen. */
export const waitsForNotes = (mode: PracticeMode): boolean => mode !== 'listen'

/** The hands a mode practises: Practice its chosen hand, every other mode both (R29 B8). */
export const handsIn = <H extends string>(mode: PracticeMode, hands: H): H | 'both' =>
  mode === 'practice' ? hands : 'both'
