import type { Take } from '@/entities/take'
import { useLocale } from '@/shared/i18n'
import { momentSaid } from '@/shared/lib'

/** When a take was made, as its name reads until the learner gives it one. */
export function useTakeMade(take: Take): string {
  return momentSaid(take.made, useLocale())
}

/** A take's name: the learner's, else when it was made. */
export function useTakeTitle(take: Take): string {
  const made = useTakeMade(take)
  return take.name ?? made
}
