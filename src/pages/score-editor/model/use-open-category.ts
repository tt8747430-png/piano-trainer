import { useSettingsStoreApi } from '@/entities/settings'
import { useFoldKeys } from '@/features/live-keyboard'
import { barsOf, staffLayer } from '@/features/score-editor'
import { setPaletteCategory, setPaletteFolded } from '@/features/set-preference'
import type { Printed } from '@/widgets/score-sheet'
import { useScoreEditorContext } from './editor-context'
import { usePalettePanel } from './use-palette-panel'

/** A sign printed on the score that the palette sets: a key or time signature, a clef. */
export type PrintedSign = Extract<Printed, { kind: 'key' | 'time' | 'clef' }>

/**
 * What a sign printed on the score does when tapped (R32-B, Flat's): its bar is chosen (a clef's on
 * its staff) and the palette opens at the sign's category, the one place it is set: the panel beside
 * the sheet on a laptop, the palette unfolded on a phone, the keys folding away for it.
 */
export function useOpenCategory(): (sign: PrintedSign) => void {
  const { store, actions } = useScoreEditorContext()
  const settings = useSettingsStoreApi()
  const panel = usePalettePanel()
  const keys = useFoldKeys()
  return (sign) => {
    const state = store.getState()
    const start = barsOf(state.draft)[sign.bar]?.start ?? 0
    const layer = sign.kind === 'clef' ? staffLayer(sign.staff) : state.layer
    actions.dispatch({ type: 'place', tick: start, layer, extend: false })
    setPaletteCategory(settings, sign.kind)
    if (panel) return
    if (!keys.folded) keys.fold(true)
    setPaletteFolded(settings, false)
  }
}
