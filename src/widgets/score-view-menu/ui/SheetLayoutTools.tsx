import { selectScoreView, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { SheetLayoutPicker } from '@/shared/ui'

/**
 * The score's layout in the sheet's pill (R34, Songscription's view pill), saved for every score: the
 * Player's and the editor's one place to choose it, beside the page view's zoom.
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
