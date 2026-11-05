import { isOwnProgressionId } from '@/entities/practice-library'
import { libraryProgression, progressionById } from '@/entities/progression-library'
import { keyFromParam, type KeyParam } from '@/shared/lib/music'

/** The place of the Progressions library a progression is listed in: its style, or Mine. */
export function progressionPlace(id: string): string {
  if (isOwnProgressionId(id)) return 'mine'
  return progressionById(id)?.style ?? 'all'
}

/** Whether a progression's page is there: the library's, or the learner's own still kept. */
export const isProgressionThere = (id: string, own: readonly { readonly id: string }[]): boolean =>
  isOwnProgressionId(id) ? own.some((each) => each.id === id) : progressionById(id) !== undefined

/** The library's progression a line of numerals in a key is, if the library has it. */
export const libraryLineId = (p: string, key: KeyParam): string | undefined =>
  libraryProgression(p, keyFromParam(key).minor)?.id
