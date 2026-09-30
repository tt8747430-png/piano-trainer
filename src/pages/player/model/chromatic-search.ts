import { LEFT_FIGURES, needsKey, RIGHT_FIGURES } from '@/entities/pattern'
import {
  CHROMATIC,
  readChords,
  type ChromaticChoice,
  type ChromaticDirection,
} from '@/features/practice'
import { playsKeyTriads } from '@/shared/lib/arrangement'
import { noteFromParam, type NoteParam } from '@/shared/lib/music'
import type { FigureChange, SetupParams } from '@/widgets/player-setup'
import type { PracticeView } from '@/widgets/practice-player'
import { ownLeftOut } from './own-left-out'

/** The chromatic walk's URL: its chords, root and direction, how the Player goes, and its own choices (absent is its own). */
export type ChromaticSearch = PracticeView & {
  /** Chord qualities joined by `.`, in the table's order: `m9.maj9.n9`. */
  readonly chords: string
  readonly root: NoteParam
  readonly direction: ChromaticDirection
} & Omit<SetupParams, 'key' | 'chordSize'>

/**
 * The walk's URL read: what it leaves out is the walk's own, and so is From the chart (the walk
 * names no methods) and anything that plays the key's triads (the walk has no key).
 */
export function chromaticChoice(
  search: Pick<ChromaticSearch, 'chords' | 'root' | 'direction' | 'pattern' | 'rh' | 'lh'>,
): ChromaticChoice {
  const { pattern, rh, lh } = search
  return {
    root: noteFromParam(search.root),
    chords: readChords(search.chords),
    direction: search.direction,
    pattern:
      pattern === undefined || pattern === 'chart' || needsKey(pattern)
        ? CHROMATIC.pattern
        : pattern,
    rh: rh && !playsKeyTriads(RIGHT_FIGURES[rh].figure) ? rh : null,
    lh: lh && !playsKeyTriads(LEFT_FIGURES[lh].figure) ? lh : null,
  }
}

/** A Setup change as the walk's URL writes it: its own pattern left out. */
export const chromaticPatch = (change: FigureChange): Partial<ChromaticSearch> =>
  ownLeftOut(change, CHROMATIC)
