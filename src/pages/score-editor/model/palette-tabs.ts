import { isHandLayer, type Layer } from '@/features/score-editor'

/**
 * The kinds of the editor's tools, as tabs: the notes and their pitch (on a laptop, its left column),
 * then the marks, lines and dynamics, the chord names, the bars and a hand's own.
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

/** The tabs of a laptop's ribbon over the sheet: the notes and their pitch are its left column's. */
export const RIBBON_TABS = PALETTE_TABS.filter((tab) => tab !== 'notes' && tab !== 'pitch')

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
 * The tab shown of `tabs`: the one chosen while its tools work there; else the chord names' in their
 * row, or the first that works.
 */
export function shownTab(
  chosen: PaletteTab,
  layer: Layer,
  tabs: readonly PaletteTab[] = PALETTE_TABS,
): PaletteTab {
  if (tabs.includes(chosen) && tabOpen(chosen, layer)) return chosen
  if (layer === 'chords' && tabs.includes('chords')) return 'chords'
  return tabs.find((tab) => tabOpen(tab, layer)) ?? 'bars'
}
