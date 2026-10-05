import type { TrainerId } from '@/features/trainer'

/** The Quiz page's groups, in its order: by what is asked, and the trainers answered by ear together. */
export const QUIZ_GROUPS = ['chords', 'scales', 'ear', 'reading'] as const
export type QuizGroup = (typeof QUIZ_GROUPS)[number]

/** Every trainer but My gaps (which checks across them, from the page's bar) in one group. */
export const QUIZ_TRAINERS: Readonly<Record<QuizGroup, readonly TrainerId[]>> = {
  chords: ['build-chord', 'name-chord', 'chord-role'],
  scales: ['build-scale', 'key-signatures', 'key-degrees'],
  ear: ['intervals-by-ear', 'chords-by-ear', 'scales-by-ear'],
  reading: ['reading-notes'],
}
