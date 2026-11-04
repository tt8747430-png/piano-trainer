import type { BarAct, BarSurface, SettingsStore } from '@/entities/settings'
import { DEFAULT_BARS, normaliseBar } from '@/entities/settings'

/** A surface's bar arranged (R29 B10); null puts back its default (Reset). */
export function setBar(
  store: SettingsStore,
  surface: BarSurface,
  acts: readonly BarAct[] | null,
): void {
  store.setState((state) => ({
    bars: {
      ...state.bars,
      [surface]: acts === null ? DEFAULT_BARS[surface] : normaliseBar(surface, acts),
    },
  }))
}
