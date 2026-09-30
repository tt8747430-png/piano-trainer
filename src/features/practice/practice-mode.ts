/** Listen: the app plays at a tempo. Wait mode: the app waits for your notes (spec §2.7). */
export const PRACTICE_MODES = ['listen', 'wait'] as const
export type PracticeMode = (typeof PRACTICE_MODES)[number]
