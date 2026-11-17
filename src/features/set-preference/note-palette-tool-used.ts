import { PALETTE_RECENT_MAX, type SettingsStore } from '@/entities/settings'

/** A palette tool used (loop round 57, Flat's recent notation): first in the Recent group, eight kept. */
export function notePaletteToolUsed(store: SettingsStore, tool: string): void {
  const { paletteRecent } = store.getState()
  if (paletteRecent[0] === tool) return
  store.setState({
    paletteRecent: [tool, ...paletteRecent.filter((id) => id !== tool)].slice(
      0,
      PALETTE_RECENT_MAX,
    ),
  })
}
