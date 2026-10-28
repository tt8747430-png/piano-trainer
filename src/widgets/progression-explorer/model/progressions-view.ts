import {
  libraryParam,
  libraryProgression,
  progressionMode,
  type LibraryProgression,
} from '@/entities/progression-library'
import type { PatternId } from '@/entities/pattern'
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

/** How a row's chords are named: by numerals, Nashville numbers, or by the chords alone. */
export const PROGRESSION_NAMES = ['numerals', 'nashville', 'chords'] as const
export type ProgressionNames = (typeof PROGRESSION_NAMES)[number]

/**
 * What Progressions shows: numerals (`I-V-vi-IV`) in a key, at a chord size, read in a church mode
 * where one is chosen; the first chord's inversion, and whether each after it moves to the nearest
 * hand or keeps that inversion, or every chord a root-position block; what leads into each chord,
 * where something does; the two chords Between looks at; how the chords are named, and what the
 * row's chips say.
 */
export interface ProgressionsView {
  readonly key: KeyParam
  readonly p: string
  /** The church mode the line is read in; the key's major or minor where left out. */
  readonly mode?: ChurchMode
  /** Every chord in root position, the hand leaping: the row as blocks, to set against it voice-led. */
  readonly block?: true
  /** How the row's chords are named; by numerals where left out. */
  readonly names?: Exclude<ProgressionNames, 'numerals'>
  readonly size: ChordSize
  readonly inversion: Inversion
  readonly nearest: boolean
  readonly lead?: LeadIn
  /** Between: the chord the passing chords lead from, by its place in the row; the next one after it. */
  readonly between?: number
  /** Between: only the ways whose chords are all the key's. */
  readonly inKey?: boolean
  /** The row's chips over how each root moves; over each chord's function where left out. */
  readonly harmony?: 'motion'
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

/** Where the row's hand stands: the view's position, or every chord a root-position block. */
export const rowPosition = (
  view: ProgressionsView,
): RowPosition & { readonly inversion: Inversion } =>
  view.block
    ? { inversion: 0, nearest: false }
    : { inversion: view.inversion, nearest: view.nearest }

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
export function playerSearch(view: ProgressionsView): InPlayer {
  const pattern = viewProgression(view)?.pattern
  return {
    p: numeralsParam(playedNumerals(view)),
    key: view.key,
    ...(view.size === 'triads' ? {} : { chordSize: view.size }),
    ...(pattern ? { pattern } : {}),
    ...rowPosition(view),
  }
}
