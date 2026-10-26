import { useMemo } from 'react'
import { selectAllAnswers, selectPractised, useProgress } from '@/entities/progress'
import { myGaps } from '@/features/trainer'

/** How many skills My gaps holds to check, from the learner's answers and the songs practised. */
export function useGapsCount(): number {
  const answers = useProgress(selectAllAnswers)
  const practised = useProgress(selectPractised)
  return useMemo(() => myGaps(answers, practised).length, [answers, practised])
}
