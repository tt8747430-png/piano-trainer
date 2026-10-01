import { LEFT_FIGURES, playableFigure, playablePattern, RIGHT_FIGURES } from '@/entities/pattern'
import {
  chordsParam,
  CHROMATIC,
  readChords,
  type ChromaticChoice,
  type ChromaticChords,
  type ChromaticDirection,
} from '@/features/practice'
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
 * The walk's URL read: what it leaves out is the walk's own, and so is a pattern or figure it cannot
 * play (From the chart, a tune, the key's triads: the walk has no key).
 */
export function chromaticChoice(
  search: Pick<ChromaticSearch, 'chords' | 'root' | 'direction' | 'pattern' | 'rh' | 'lh'>,
): ChromaticChoice {
  return {
    root: noteFromParam(search.root),
    chords: readChords(search.chords),
    direction: search.direction,
    pattern: playablePattern(search.pattern, CHROMATIC.pattern, CHROMATIC.fit),
    rh: playableFigure(search.rh, RIGHT_FIGURES, CHROMATIC.fit),
    lh: playableFigure(search.lh, LEFT_FIGURES, CHROMATIC.fit),
  }
}

/** What the chromatic walk's Setup changes: its chords, root and direction, the pattern and figures. */
export type ChromaticChange = FigureChange & {
  readonly chords?: ChromaticChords
  readonly root?: NoteParam
  readonly direction?: ChromaticDirection
}

/** A Setup change as the walk's URL writes it: its chords as the URL holds them, its own pattern left out. */
export function chromaticPatch({ chords, ...change }: ChromaticChange): Partial<ChromaticSearch> {
  return { ...ownLeftOut(change, CHROMATIC), ...(chords ? { chords: chordsParam(chords) } : {}) }
}
