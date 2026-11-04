import type { Question } from '@/features/trainer'

/** The page a missed round's thing is learned on: Chords, Intervals, Scales or Progressions. */
export type ReviewPage = 'chords' | 'intervals' | 'scales' | 'progressions'

/** Where a missed round opens to review it: its page, or none (a note read has no page of its own). */
export function reviewPage(question: Question): ReviewPage | null {
  switch (question.mode) {
    case 'build-chord':
      return question.cadence ? 'progressions' : 'chords'
    case 'name-chord':
    case 'chord-card':
      return 'chords'
    case 'name-interval':
    case 'build-interval':
    case 'interval-card':
      return 'intervals'
    case 'build-scale':
    case 'name-scale':
    case 'key-signature':
    case 'key-degrees':
      return 'scales'
    case 'chord-role':
    case 'name-progression':
    case 'name-cadence':
    case 'cadence-card':
      return 'progressions'
    case 'read-note':
      return null
  }
}
