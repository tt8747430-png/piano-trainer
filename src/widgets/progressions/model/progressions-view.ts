import {
  libraryParam,
  libraryProgression,
  progressionMode,
  type LibraryProgression,
} from '@/entities/progression-library'
import type { PatternId } from '@/entities/pattern'
import {
  chordSymbol,
  keyFromParam,
  keyParam,
  numeralChord,
  numeralsParam,
  parseNumerals,
  withLeadIns,
  writtenKey,
  type ChordSize,
  type Inversion,
  type KeyParam,
  type LeadIn,
  type Numeral,
} from '@/shared/lib/music'

/**
 * What the Progressions tool shows: numerals (`I-V-vi-IV`) in a key, at a chord size; the first
 * chord's inversion, and whether each after it moves to the nearest hand or keeps that inversion;
 * and what leads into each chord, where something does.
 */
export interface ProgressionsView {
  readonly key: KeyParam
  readonly p: string
  readonly size: ChordSize
  readonly inversion: Inversion
  readonly nearest: boolean
  readonly lead?: LeadIn
}

/** The chords a view plays: its numerals, each led into by its V or ii–V where the view says (ADR 0041). */
export function playedNumerals(view: ProgressionsView): Numeral[] {
  const numerals = parseNumerals(view.p) ?? []
  return view.lead ? withLeadIns(numerals, view.lead, keyFromParam(view.key)) : numerals
}

/** The library's progression a view shows; none for a line a learner typed. */
export const viewProgression = (view: ProgressionsView): LibraryProgression | undefined =>
  libraryProgression(view.p, keyFromParam(view.key).minor)

/**
 * A view changed. A key turned minor or major shows the library's progression in that mode's line,
 * where it has one (the jazz cadence's ii°–V–i, and back), at the chord size shown; any other line
 * stays as it is written (ADR 0041).
 */
export function changedView(
  view: ProgressionsView,
  change: Partial<ProgressionsView>,
): ProgressionsView {
  const next = { ...view, ...change }
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
 * its chord size where it has one.
 */
export function chosenView(
  view: ProgressionsView,
  progression: LibraryProgression,
): ProgressionsView {
  const { tonic, minor } = keyFromParam(view.key)
  const mode = progressionMode(progression, minor)
  return {
    ...view,
    key: mode === minor ? view.key : keyParam(writtenKey({ tonic, minor: mode })),
    p: libraryParam(progression, mode),
    size: progression.size ?? view.size,
  }
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
 * The Player's search for the view shown: the chords it plays, lead-ins written out, with the pattern
 * the library's progression is practised in.
 */
export function playerSearch(view: ProgressionsView): InPlayer {
  const pattern = viewProgression(view)?.pattern
  return {
    p: numeralsParam(playedNumerals(view)),
    key: view.key,
    ...(view.size === 'triads' ? {} : { chordSize: view.size }),
    ...(pattern ? { pattern } : {}),
    inversion: view.inversion,
    nearest: view.nearest,
  }
}

/** What the Passing chords tool opens on: a key and two chords, each as its field reads it. */
export interface PassingBetween {
  readonly key: KeyParam
  readonly from: string
  readonly to: string
}

/**
 * The view's first two chords as played, in its key and at its chord size, for the Passing chords tool
 * to find the ways between; none for a line of one chord.
 */
export function passingBetween(view: ProgressionsView): PassingBetween | undefined {
  const key = keyFromParam(view.key)
  const [from, to] = playedNumerals(view).map((numeral) =>
    chordSymbol(numeralChord(numeral, key, view.size)),
  )
  return from !== undefined && to !== undefined ? { key: view.key, from, to } : undefined
}
