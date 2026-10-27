import type { MusicView } from '@/entities/settings'
import type { Performance } from '@/shared/lib/arrangement'

/** What a view of the music needs that the music may not have: words, or chord symbols. */
export type ViewNeed = 'words' | 'chords'

/**
 * The Player's views the music cannot show, each with what it needs (ADR 0108); a view left out can
 * show it. The sheet music shows any.
 */
export type ViewNeeds = Readonly<Partial<Record<MusicView, ViewNeed>>>

/** Where a view the music cannot show falls back to: Chords over lyrics to Diagrams, the rest to the sheet music. */
const FALLS_BACK: Readonly<Record<Exclude<MusicView, 'sheet'>, MusicView>> = {
  lyrics: 'diagrams',
  diagrams: 'sheet',
  grid: 'sheet',
}

/**
 * What the music lacks for each of the Player's views (ADR 0108): the three chord views need its
 * chord symbols, and Chords over lyrics its words too, sung on some note.
 */
export function viewNeeds(performance: Performance): ViewNeeds {
  if (performance.chords.length === 0)
    return { lyrics: 'chords', diagrams: 'chords', grid: 'chords' }
  const sung = performance.notes.some((note) => note.lyrics?.some((syllable) => syllable !== null))
  return sung ? {} : { lyrics: 'words' }
}

/**
 * The view the Player shows: the one saved, else, where the music cannot show it, the one it falls
 * back to (Chords over lyrics to Diagrams, Diagrams or the Grid to the sheet music). The saved view
 * stays, for the music that can.
 */
export function shownView(saved: MusicView, needs: ViewNeeds): MusicView {
  return saved === 'sheet' || needs[saved] === undefined
    ? saved
    : shownView(FALLS_BACK[saved], needs)
}
