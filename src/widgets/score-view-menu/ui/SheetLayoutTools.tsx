import { selectScoreView, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { SheetLayoutPicker } from '@/shared/ui'

/**
 * The score's layout, saved for every score: in the Player, the first row of its Sheet music
 * settings (the Player board); in the editor, its gear's View on a phone and the sheet's pill beside
 * the docked panel.
 */
export function SheetLayoutTools() {
  const store = useSettingsStoreApi()
  const layout = useSettings((state) => selectScoreView(state).layout)
  return (
    <SheetLayoutPicker
      value={layout}
      onChange={(chosen) => setScoreView(store, { layout: chosen })}
    />
  )
}
