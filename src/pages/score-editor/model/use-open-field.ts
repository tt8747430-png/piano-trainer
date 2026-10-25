import { useCallback, useRef, useState } from 'react'
import type { ScoreViewSettings } from '@/entities/settings'
import { sungFrom, type EditorStore, type Layer } from '@/features/score-editor'
import type { SheetField } from '@/widgets/score-sheet'
import { fieldClosedBy } from './fields'

/**
 * The field open over the sheet (ADR 0096), and how one opens: at the caret, where it can (the
 * chord symbol's taking the caret to its beat in the chord row from the staff it was on, and back
 * there as it closes; the Lyrics field to the tune's note there, else the next); what was chosen let
 * go, a field typing at one place.
 */
export function useOpenField(
  store: EditorStore,
  shown: Pick<ScoreViewSettings, 'chordNames' | 'lyrics'>,
) {
  const [field, setField] = useState<SheetField | null>(null)
  // The staff the chord-symbol field took the caret from.
  const back = useRef<Layer | null>(null)
  const openField = useCallback(
    (next: SheetField | null) => {
      if (next === null) {
        const from = back.current
        back.current = null
        setField(null)
        if (from !== null) store.dispatch({ type: 'layer', layer: from })
        return
      }
      const state = store.getState()
      if (fieldClosedBy(next.kind, state, shown) !== null) return
      const { layer, selection, draft, caret } = state
      if (next.kind === 'chord' && layer !== 'chords') {
        back.current = layer
        store.dispatch({ type: 'layer', layer: 'chords' })
      } else if (next.kind === 'lyrics') {
        // Under the tune's note at the caret, else the next one, else the last.
        const sung = sungFrom(draft, caret) ?? caret
        if (sung !== caret || selection) store.dispatch({ type: 'place', tick: sung, layer })
      } else if (selection) store.dispatch({ type: 'deselect' })
      setField(next)
    },
    [store, shown],
  )
  return { field, openField }
}
