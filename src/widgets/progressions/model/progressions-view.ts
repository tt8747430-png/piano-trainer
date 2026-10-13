import {
  libraryParam,
  libraryProgression,
  otherModeVersion,
  type LibraryProgression,
} from '@/entities/progression-library'
import type { PatternId } from '@/entities/pattern'
import {
  keyFromParam,
  keyParam,
  writtenKey,
  type ChordSize,
  type Inversion,
  type KeyParam,
} from '@/shared/lib/music'

/**
 * What the Progressions tool shows: numerals (`I-V-vi-IV`) in a key, at a chord size; the first
 * chord's inversion, and whether each after it moves to the nearest hand or keeps that inversion.
 */
export interface ProgressionsView {
  readonly key: KeyParam
  readonly p: string
  readonly size: ChordSize
  readonly inversion: Inversion
  readonly nearest: boolean
}

/** The library's progression a view shows; none for a line a learner typed. */
export const viewProgression = (view: ProgressionsView): LibraryProgression | undefined =>
  libraryProgression(view.p, keyFromParam(view.key).minor)

/**
 * A view changed. A key turned minor or major takes the library's progression shown to its version
 * in that mode, where it has one (the jazz cadence to the minor ii–V–i, and back), at the chord size
 * shown; any other line stays as it is written.
 */
export function changedView(
  view: ProgressionsView,
  change: Partial<ProgressionsView>,
): ProgressionsView {
  const next = { ...view, ...change }
  if (change.p !== undefined) return next
  if (keyFromParam(next.key).minor === keyFromParam(view.key).minor) return next
  const shown = viewProgression(view)
  const version = shown && otherModeVersion(shown)
  return version ? { ...next, p: libraryParam(version) } : next
}

/**
 * A view with a library progression chosen: its line in the key of the same tonic and its mode
 * (respelled only where no signature writes that key), at its chord size where it has one.
 */
export function chosenView(
  view: ProgressionsView,
  progression: LibraryProgression,
): ProgressionsView {
  const { tonic } = keyFromParam(view.key)
  return {
    ...view,
    key: keyParam(writtenKey({ tonic, minor: progression.minor })),
    p: libraryParam(progression),
    size: progression.size ?? view.size,
  }
}

/**
 * What the Player opens on: the progression, its key, and its chord size, pattern and the hand's
 * position where they are not the Player's own.
 */
export interface InPlayer {
  readonly p: string
  readonly key: KeyParam
  readonly chordSize?: Exclude<ChordSize, 'triads'>
  readonly pattern?: PatternId
  readonly inversion?: Exclude<Inversion, 0>
  readonly nearest?: false
}

/** The Player's search for the view shown, with the pattern the library's progression is practised in. */
export function playerSearch(view: ProgressionsView): InPlayer {
  const pattern = viewProgression(view)?.pattern
  return {
    p: view.p,
    key: view.key,
    ...(view.size === 'triads' ? {} : { chordSize: view.size }),
    ...(pattern ? { pattern } : {}),
    ...(view.inversion === 0 ? {} : { inversion: view.inversion }),
    ...(view.nearest ? {} : { nearest: false }),
  }
}
