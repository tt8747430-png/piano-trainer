/**
 * What the Player does with the learner (R36, flowkey's Pace; the owner's R37 ruling: Wait and Play
 * only): Listen, the app plays at a speed the learner plays along at; Wait mode (`wait`), the music
 * waits for the right notes. The hands chosen count in both.
 */
export const PRACTICE_MODES = ['listen', 'wait'] as const
export type PracticeMode = (typeof PRACTICE_MODES)[number]

/** Whether the mode waits for the learner's notes: Wait mode. */
export const waitsForNotes = (mode: PracticeMode): boolean => mode === 'wait'
