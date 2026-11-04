import { MILESTONES, useProgress, type MilestoneId } from '@/entities/progress'

/** The milestones, the earned ones first (the latest first), each with its day or none. */
export function useMilestones(): { id: MilestoneId; day: string | null }[] {
  const earned = useProgress((state) => state.earned)
  return MILESTONES.map(({ id }) => ({ id, day: earned[id] ?? null })).toSorted(
    (a, b) => (b.day ?? '').localeCompare(a.day ?? '') || 0,
  )
}
