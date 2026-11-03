import {
  libraryParam,
  libraryProgression,
  progressionMode,
  type LibraryProgression,
  type ProgressionStyle,
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

/** Progressions' tabs (A23): the progression shown, the library, and the passing chords. */
export const PROGRESSIONS_TABS = ['progression', 'library', 'passing'] as const
export type ProgressionsTab = (typeof PROGRESSIONS_TABS)[number]

/**
 * What Progressions shows (A23): the tab; numerals (`I-V-vi-IV`) in a key, at a chord size, read in
 * a church mode where one is chosen; what leads into each chord, where something does; the library's
 * style shown; and the two chords Passing chords looks at. How it is written and voiced is
 * Progressions' Settings (A24), not the URL's.
 */
export interface ProgressionsView {
  /** The tab shown; the progression where left out. */
  readonly tab?: Exclude<ProgressionsTab, 'progression'>
  readonly key: KeyParam
  readonly p: string
  /** The church mode the line is read in; the key's major or minor where left out. */
  readonly mode?: ChurchMode
  readonly size: ChordSize
  readonly lead?: LeadIn
  /** The library's style shown; every style where left out. */
  readonly style?: ProgressionStyle
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
