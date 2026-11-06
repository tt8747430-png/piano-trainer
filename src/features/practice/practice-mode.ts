/**
 * What the Player does with the learner (R36, flowkey's Pace): Listen, the app plays at a speed the
 * learner plays along at; Wait mode (`wait`), the music waits for the right notes; Interpret
 * (`follow`), the music follows the learner's tempo. The hands chosen count in every mode.
 */
export const PRACTICE_MODES = ['listen', 'wait', 'follow'] as const
export type PracticeMode = (typeof PRACTICE_MODES)[number]

/** The modes played at the learner's own pace: the ones that wait for the learner's notes. */
export type OwnPaceMode = Exclude<PracticeMode, 'listen'>
export const OWN_PACE_MODES: readonly OwnPaceMode[] = ['wait', 'follow']

/** Whether the mode waits for the learner's notes: every mode but Listen. */
export const waitsForNotes = (mode: PracticeMode): mode is OwnPaceMode => mode !== 'listen'
