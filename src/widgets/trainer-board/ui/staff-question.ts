import type { Question } from '@/features/trainer'

/** A round that shows a staff: a note to read, a signature to name, a chord or an interval. */
export type StaffQuestion = Extract<
  Question,
  {
    mode:
      | 'read-note'
      | 'key-signature'
      | 'name-chord'
      | 'chord-card'
      | 'name-interval'
      | 'interval-card'
      | 'name-cadence'
      | 'cadence-card'
  }
>

export const showsStaff = (question: Question): question is StaffQuestion =>
  question.mode === 'read-note' ||
  (question.mode === 'key-signature' && question.ask === 'name') ||
  question.mode === 'name-chord' ||
  question.mode === 'chord-card' ||
  question.mode === 'name-interval' ||
  question.mode === 'interval-card' ||
  question.mode === 'name-cadence' ||
  question.mode === 'cadence-card'
