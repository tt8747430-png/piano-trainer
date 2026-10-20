import { isHandLayer, type Layer } from '@/features/score-editor'

/** The kinds of the palette's tools, in its row of tabs. */
export const PALETTE_TABS = ['notes', 'pitch', 'hand', 'chords', 'bars'] as const
export type PaletteTab = (typeof PALETTE_TABS)[number]

/** Whether a tab's tools work on what the keys write: a hand's own only in a hand, the bars' anywhere. */
export function tabOpen(tab: PaletteTab, layer: Layer): boolean {
  switch (tab) {
    case 'notes':
    case 'pitch':
      return layer !== 'chords'
    case 'hand':
      return isHandLayer(layer)
    case 'chords':
      return layer === 'chords'
    case 'bars':
      return true
  }
}

/** The tab shown: the one chosen while its tools work there, else the first that does. */
export const shownTab = (chosen: PaletteTab, layer: Layer): PaletteTab =>
  tabOpen(chosen, layer) ? chosen : layer === 'chords' ? 'chords' : 'notes'
