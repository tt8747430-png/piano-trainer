import type { TrainerId } from '@/features/trainer'

/** The Quiz page's groups, in its order: by what is asked, and the trainers answered by ear together. */
export const QUIZ_GROUPS = ['chords', 'scales', 'ear', 'reading'] as const
type QuizGroup = (typeof QUIZ_GROUPS)[number]

/** Every trainer but My gaps (which checks across them, from the page's bar) in one group. */
export const QUIZ_TRAINERS: Readonly<Record<QuizGroup, readonly TrainerId[]>> = {
  chords: ['chords', 'intervals', 'chord-role'],
  scales: ['build-scale', 'key-signatures', 'key-degrees'],
  ear: ['scales-by-ear', 'progressions-by-ear', 'cadences'],
  reading: ['reading-notes'],
}
