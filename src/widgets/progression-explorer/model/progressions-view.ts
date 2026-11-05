import {
  libraryParam,
  libraryProgression,
  progressionMode,
  type LibraryProgression,
} from '@/entities/progression-library'
import type { PatternId } from '@/entities/pattern'
import type { ProgressionsSettings } from '@/entities/settings'
import {
  keyFromParam,
  keyParam,
  isMinorMode,
  numeralsParam,
  parseNumerals,
  readInMode,
  withLeadIns,
  writtenKey,
  type ChordSize,
  type ChurchMode,
  type Inversion,
  type KeyParam,
  type LeadIn,
  type Numeral,
  type RowPosition,
} from '@/shared/lib/music'

/**
 * What a progression's page shows (A23, R30-4): numerals (`I-V-vi-IV`) in a key, at a chord size,
 * read in a church mode where one is chosen; what leads into each chord, where something does; and
 * the two chords Passing chords looks at. How it is written and voiced is Progressions' Settings
 * (A24), not the URL's. A line typed holds it all in its URL; a library's or the learner's own
 * progression holds its line itself (`ProgressionSearch`).
 */
export interface ProgressionsView {
  readonly key: KeyParam
  readonly p: string
  /** The church mode the line is read in; the key's major or minor where left out. */
  readonly mode?: ChurchMode
  readonly size: ChordSize
  readonly lead?: LeadIn
  /** Passing chords: the chord they lead from, by its place in the row; the next one after it. */
  readonly between?: number
  /** Passing chords: only the ways whose chords are all the key's. */
  readonly inKey?: boolean
}

/**
 * The chords a view plays: its numerals, read in its mode where it has one, each led into by its V or
 * ii–V where the view says (ADR 0112).
 */
export function playedNumerals(view: ProgressionsView): Numeral[] {
  const key = keyFromParam(view.key)
  const written = parseNumerals(view.p) ?? []
  const numerals = view.mode ? readInMode(written, key, view.mode) : written
  return view.lead ? withLeadIns(numerals, view.lead, key) : numerals
}

/**
 * Where the row's hand stands, as Progressions' Settings say: voice-led from the first chord's
 * inversion, each after it to the nearest position; or every chord a root-position block.
 */
export const rowPosition = ({
  voicing,
  inversion,
}: Pick<ProgressionsSettings, 'voicing' | 'inversion'>): RowPosition & {
  readonly inversion: Inversion
} => (voicing === 'block' ? { inversion: 0, nearest: false } : { inversion, nearest: true })

/** The library's progression a view shows; none for a line a learner typed. */
export const viewProgression = (view: ProgressionsView): LibraryProgression | undefined =>
  libraryProgression(view.p, keyFromParam(view.key).minor)

/**
 * A view changed. A key turned minor or major shows the library's progression in that mode's line,
 * where it has one (the jazz cadence's ii°–V–i, and back), at the chord size shown; any other line
 * stays as it is written (ADR 0112). A church mode chosen stands on the major or minor key of the
 * tonic its 3rd says (Dorian on minor); the key turned to the other leaves the mode.
 */
export function changedView(
  view: ProgressionsView,
  change: Partial<ProgressionsView>,
): ProgressionsView {
  const asked = { ...view, ...change }
  const { tonic, minor: keyMinor } = keyFromParam(asked.key)
  const next: ProgressionsView =
    !asked.mode || isMinorMode(asked.mode) === keyMinor
      ? asked
      : 'mode' in change
        ? { ...asked, key: keyParam(writtenKey({ tonic, minor: isMinorMode(asked.mode) })) }
        : withoutMode(asked)
  if (change.p !== undefined) return next
  const { minor } = keyFromParam(next.key)
  if (minor === keyFromParam(view.key).minor) return next
  const shown = viewProgression(view)
  return shown && progressionMode(shown, minor) === minor
    ? { ...next, p: libraryParam(shown, minor) }
    : next
}

/**
 * A view with a library progression chosen: its line in the key's mode where it has one, else in the
 * key of the same tonic and the mode it has (respelled only where no signature writes that key), at
 * its chord size where it has one, in its church mode where it is heard in one.
 */
export function chosenView(
  view: ProgressionsView,
  progression: LibraryProgression,
): ProgressionsView {
  const { tonic, minor } = keyFromParam(view.key)
  const mode = progressionMode(progression, minor)
  return {
    ...withoutMode(view),
    key: mode === minor ? view.key : keyParam(writtenKey({ tonic, minor: mode })),
    p: libraryParam(progression, mode),
    size: progression.size ?? view.size,
    ...(progression.mode ? { mode: progression.mode } : {}),
  }
}

/** A view read in its key's own major or minor. */
function withoutMode(view: ProgressionsView): ProgressionsView {
  const { mode: _mode, ...rest } = view
  return rest
}

/**
 * What the Player opens on: the progression, its key, the hand's position (always named, so the
 * Player plays what the row showed, not a position kept from before), and its chord size and pattern
 * where they are not the Player's own.
 */
export interface InPlayer {
  readonly p: string
  readonly key: KeyParam
  readonly chordSize?: Exclude<ChordSize, 'triads'>
  readonly pattern?: PatternId
  readonly inversion: Inversion
  readonly nearest: boolean
}

/**
 * The Player's search for the view shown: the chords it plays, read in its mode and lead-ins written
 * out, with the pattern the library's progression is practised in, its hand where the row's stands.
 */
export function playerSearch(view: ProgressionsView, settings: ProgressionsSettings): InPlayer {
  const pattern = viewProgression(view)?.pattern
  return {
    p: numeralsParam(playedNumerals(view)),
    key: view.key,
    ...(view.size === 'triads' ? {} : { chordSize: view.size }),
    ...(pattern ? { pattern } : {}),
    ...rowPosition(settings),
  }
}

/**
 * A library's or the learner's own progression's URL (R30-4): the key it is shown in, its chord size
 * (its own where left out), what leads into each chord, and Passing chords' pair and In the key only.
 */
export interface ProgressionSearch {
  readonly key: KeyParam
  readonly size?: ChordSize
  readonly lead?: LeadIn
  readonly between?: number
  readonly inKey?: boolean
}

/** A progression's URL as a view, its line yet to be written in. */
const baseView = ({ size: _size, ...search }: ProgressionSearch): ProgressionsView => ({
  ...search,
  p: '',
  size: 'triads',
})

/**
 * What a library progression's page shows for its URL: its line in the key's mode where it has one,
 * else in the key of the same tonic and the mode it has; at the chord size the URL names, else its
 * own; in its church mode where it is heard in one (`chosenView`).
 */
export function libraryView(
  search: ProgressionSearch,
  progression: LibraryProgression,
): ProgressionsView {
  const view = chosenView(baseView(search), progression)
  return search.size ? { ...view, size: search.size } : view
}

/** A progression the learner keeps, as its page reads it: its line, the mode it is read in. */
export interface KeptLine {
  readonly line: string
  readonly minor: boolean
  readonly mode?: ChurchMode
}

/**
 * What the learner's own progression's page shows for its URL: its line in a key of the mode it was
 * typed in, on the URL's tonic, read in its church mode where it has one.
 */
export function keptView(search: ProgressionSearch, kept: KeptLine): ProgressionsView {
  const { tonic, minor } = keyFromParam(search.key)
  return {
    ...baseView(search),
    key: minor === kept.minor ? search.key : keyParam(writtenKey({ tonic, minor: kept.minor })),
    p: kept.line,
    size: search.size ?? 'triads',
    ...(kept.mode ? { mode: kept.mode } : {}),
  }
}

/** The URL of a progression's page for the view it changed to: all but its line and mode. */
export const progressionSearch = ({
  key,
  size,
  lead,
  between,
  inKey,
}: ProgressionsView): ProgressionSearch => ({ key, size, lead, between, inKey })
