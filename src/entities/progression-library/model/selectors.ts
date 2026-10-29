import { keptContent } from '@/shared/api/content'
import { numeralsLine, numeralsParam, parseNumerals } from '@/shared/lib/music'
import { PROGRESSION_LIBRARY, type ProgressionId } from '../content/library'
import {
  PROGRESSION_STYLES,
  readsAsProgression,
  type LibraryProgression,
  type ProgressionStyle,
} from './types'

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

let built = { revision: -1, all: [] as readonly LibraryProgression[] }

/**
 * The library over the kept content (content as data, ADR 0116): each of the app's progressions the
 * database's newer copy where it reads as one, then the progressions editors made. Built again when
 * the kept content changes.
 */
export function libraryProgressions(): readonly LibraryProgression[] {
  const kept = keptContent()
  if (kept.revision === built.revision) return built.all
  const own = new Set(PROGRESSION_LIBRARY.map((each) => each.id))
  const all = [
    ...PROGRESSION_LIBRARY.map((each) => {
      const body = kept.body('progression', each.id)
      return readsAsProgression(each.id, body) ? body : each
    }),
    ...kept.ids('progression').flatMap((id) => {
      const body = kept.body('progression', id)
      return !own.has(id) && readsAsProgression(id, body) ? [body] : []
    }),
  ]
  built = { revision: kept.revision, all }
  return all
}

const indexes = new WeakMap<
  readonly LibraryProgression[],
  { byLine: ReadonlyMap<string, LibraryProgression>; byId: ReadonlyMap<string, LibraryProgression> }
>()

/** The library's progressions by line in each mode they have, and by id. */
function indexed() {
  const all = libraryProgressions()
  const known = indexes.get(all)
  if (known) return known
  const made = {
    byLine: new Map(
      all.flatMap((each) =>
        [false, true]
          .filter((minor) => progressionMode(each, minor) === minor)
          .map((minor) => [modeLine(libraryParam(each, minor), minor), each] as const),
      ),
    ),
    byId: new Map(all.map((each) => [each.id, each] as const)),
  }
  indexes.set(all, made)
  return made
}

/** The library's progression a line of numerals is, in a major or a minor key; none for one a learner made up. */
export const libraryProgression = (param: string, minor: boolean): LibraryProgression | undefined =>
  indexed().byLine.get(modeLine(param, minor))

/** The library's progression of an id; none for any other word. */
export const progressionById = (id: string): LibraryProgression | undefined =>
  indexed().byId.get(id)

/** The library by style, in the styles' order, the ones editors made at their style's end: what its pop-up lists. */
export const libraryByStyle = (): readonly {
  readonly style: ProgressionStyle
  readonly progressions: readonly LibraryProgression[]
}[] =>
  PROGRESSION_STYLES.map((style) => ({
    style,
    progressions: libraryProgressions().filter((each) => each.style === style),
  }))

const COMMON: readonly ProgressionId[] = ['complete-cadence', 'doo-wop', 'jazz-cadence', 'axis']

/** A key's common progressions, the ones a scale's page offers, each in the key's mode. */
export const commonProgressions = (): readonly LibraryProgression[] =>
  COMMON.flatMap((id) => progressionById(id) ?? [])
