import { localDay } from '@/entities/progress'
import { useNow } from '@/shared/lib'

/**
 * Today on the learner's calendar, from the app's one clock: it moves on within a minute of
 * midnight and as the app comes back into view, so an installed app left open overnight says the
 * new day's.
 */
export function useToday(): string {
  return localDay(new Date(useNow()))
}
