import { isHandLayer, type Layer } from '@/features/score-editor'

/**
 * The kinds of the editor's tools, as tabs: the notes and their pitch, then the marks, lines and dynamics, the chord names, the bars and a hand's own.
 */
export const PALETTE_TABS = [
  'notes',
  'pitch',
  'articulations',
  'lines',
  'dynamics',
  'chords',
  'bars',
  'hand',
] as const
export type PaletteTab = (typeof PALETTE_TABS)[number]

/** Whether a tab's tools work where the caret writes: the chord names' in their row, a hand's own in a hand, the bars' anywhere. */
export function tabOpen(tab: PaletteTab, layer: Layer): boolean {
  switch (tab) {
    case 'notes':
    case 'pitch':
    case 'articulations':
    case 'lines':
    case 'dynamics':
      return layer !== 'chords'
    case 'chords':
      return layer === 'chords'
    case 'hand':
      return isHandLayer(layer)
    case 'bars':
      return true
  }
}

/**
 * The tab shown: the one chosen while its tools work there; else the chord names' in their
 * row, or the first that works.
 */
export function shownTab(chosen: PaletteTab, layer: Layer): PaletteTab {
  if (tabOpen(chosen, layer)) return chosen
  if (layer === 'chords') return 'chords'
  return PALETTE_TABS.find((tab) => tabOpen(tab, layer)) ?? 'bars'
}
