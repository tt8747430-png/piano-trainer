import { numeralsLine, numeralsParam, parseNumerals } from '@/shared/lib/music'
import { PROGRESSION_LIBRARY, type ProgressionId } from '../content/library'
import { PROGRESSION_STYLES, type LibraryProgression, type ProgressionStyle } from './types'

/**
 * The mode a progression is shown in where a key of `minor`'s mode is asked for: that mode where the
 * progression has a line in it, else the one mode it has.
 */
export const progressionMode = (progression: LibraryProgression, minor: boolean): boolean =>
  progression.major === undefined ? true : progression.minor === undefined ? false : minor

/** A progression's line in the mode it is shown in, where a key of `minor`'s mode is asked for. */
const lineIn = (progression: LibraryProgression, minor: boolean): string =>
  (progressionMode(progression, minor) ? progression.minor : progression.major) ?? ''

const numeralsOf = (progression: LibraryProgression, minor: boolean) =>
  parseNumerals(lineIn(progression, minor)) ?? []

/** A library progression's numerals as a URL holds them (`I-V-vi-IV`), in the mode it is shown in. */
export const libraryParam = (progression: LibraryProgression, minor: boolean): string =>
  numeralsParam(numeralsOf(progression, minor))

/** A library progression's numerals as a line to read (`I–V–vi–IV`), in the mode it is shown in. */
export const libraryLine = (progression: LibraryProgression, minor: boolean): string =>
  numeralsLine(numeralsOf(progression, minor))

const modeLine = (param: string, minor: boolean) => `${minor ? 'minor' : 'major'} ${param}`

const BY_LINE = new Map(
  PROGRESSION_LIBRARY.flatMap((each) =>
    [false, true]
      .filter((minor) => progressionMode(each, minor) === minor)
      .map((minor) => [modeLine(libraryParam(each, minor), minor), each] as const),
  ),
)

/** The library's progression a line of numerals is, in a major or a minor key; none for one a learner made up. */
export const libraryProgression = (param: string, minor: boolean): LibraryProgression | undefined =>
  BY_LINE.get(modeLine(param, minor))

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

/** A key's common progressions, the ones a scale's page offers, each in the key's mode. */
export const COMMON_PROGRESSIONS: readonly LibraryProgression[] = (
  ['complete-cadence', 'doo-wop', 'jazz-cadence', 'axis'] as const
).map(listed)
