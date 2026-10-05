import { numeralsParam, parseNumerals } from '@/shared/lib/music'
import { PROGRESSION_LIBRARY } from '../content/library'
import type { LibraryProgression } from './types'

/** A library progression's numerals as a URL holds them (`I-V-vi-IV`). */
export const libraryParam = (progression: LibraryProgression): string =>
  numeralsParam(parseNumerals(progression.numerals) ?? [])

const keyOf = (param: string, minor: boolean) => `${minor ? 'minor' : 'major'} ${param}`

const BY_LINE = new Map(
  PROGRESSION_LIBRARY.map((each) => [keyOf(libraryParam(each), each.minor), each] as const),
)

/** The library's progression a line of numerals is, in a major or a minor key; none for one a learner made up. */
export const libraryProgression = (param: string, minor: boolean): LibraryProgression | undefined =>
  BY_LINE.get(keyOf(param, minor))

const byId = (id: string): LibraryProgression => {
  const found = PROGRESSION_LIBRARY.find((each) => each.id === id)
  if (!found) throw new RangeError(`No progression ${id}`)
  return found
}

/** A key's common progressions (roadmap §3.8), a major key's and a minor key's, the ones a scale's page offers. */
export const COMMON_PROGRESSIONS: Readonly<
  Record<'major' | 'minor', readonly LibraryProgression[]>
> = {
  major: ['authentic', 'doo-wop', 'jazz-cadence', 'axis'].map(byId),
  minor: ['minor-cadence', 'minor-pop', 'minor-two-five'].map(byId),
}
