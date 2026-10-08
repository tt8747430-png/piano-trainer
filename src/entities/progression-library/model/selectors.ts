import { numeralsLine, numeralsParam, parseNumerals, type Numeral } from '@/shared/lib/music'
import { MODE_VERSIONS, PROGRESSION_LIBRARY, type ProgressionId } from '../content/library'
import { PROGRESSION_STYLES, type LibraryProgression, type ProgressionStyle } from './types'

const numeralsOf = (progression: LibraryProgression): Numeral[] =>
  parseNumerals(progression.numerals) ?? []

/** A library progression's numerals as a URL holds them (`I-V-vi-IV`). */
export const libraryParam = (progression: LibraryProgression): string =>
  numeralsParam(numeralsOf(progression))

/** A library progression's numerals as a line to read (`I–V–vi–IV`). */
export const libraryLine = (progression: LibraryProgression): string =>
  numeralsLine(numeralsOf(progression))

const lineIn = (param: string, minor: boolean) => `${minor ? 'minor' : 'major'} ${param}`

const BY_LINE = new Map(
  PROGRESSION_LIBRARY.map((each) => [lineIn(libraryParam(each), each.minor), each] as const),
)

/** The library's progression a line of numerals is, in a major or a minor key; none for one a learner made up. */
export const libraryProgression = (param: string, minor: boolean): LibraryProgression | undefined =>
  BY_LINE.get(lineIn(param, minor))

const BY_ID: ReadonlyMap<string, LibraryProgression> = new Map(
  PROGRESSION_LIBRARY.map((each) => [each.id, each] as const),
)

/** The library's progression of an id; none for any other word. */
export const progressionById = (id: string): LibraryProgression | undefined => BY_ID.get(id)

const listed = (id: ProgressionId): LibraryProgression => {
  const found = BY_ID.get(id)
  if (!found) throw new RangeError(`No progression ${id}`)
  return found
}

/** The library by style, in the styles' order: what its pop-up lists. */
export const LIBRARY_BY_STYLE: readonly {
  readonly style: ProgressionStyle
  readonly progressions: readonly LibraryProgression[]
}[] = PROGRESSION_STYLES.map((style) => ({
  style,
  progressions: PROGRESSION_LIBRARY.filter((each) => each.style === style),
}))

const OTHER_MODE: ReadonlyMap<string, LibraryProgression> = new Map(
  MODE_VERSIONS.flatMap(([major, minor]) => [
    [major, listed(minor)] as const,
    [minor, listed(major)] as const,
  ]),
)

/** A progression's version in the other mode, where the library holds one: the jazz cadence's minor ii–V–i, and back. */
export const otherModeVersion = (progression: LibraryProgression): LibraryProgression | undefined =>
  OTHER_MODE.get(progression.id)

/** A key's common progressions (roadmap §3.8), a major key's and a minor key's, the ones a scale's page offers. */
export const COMMON_PROGRESSIONS: Readonly<
  Record<'major' | 'minor', readonly LibraryProgression[]>
> = {
  major: (['authentic', 'doo-wop', 'jazz-cadence', 'axis'] as const).map(listed),
  minor: (['minor-cadence', 'minor-pop', 'minor-two-five'] as const).map(listed),
}
