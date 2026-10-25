import { useCallback, useRef, useState } from 'react'
import type { ScoreViewSettings } from '@/entities/settings'
import type { EditorStore, Layer } from '@/features/score-editor'
import type { SheetField } from '@/widgets/score-sheet'
import { fieldClosedBy } from './fields'

/**
 * The field open over the sheet (ADR 0096), and how one opens: at the caret, where it can (the
 * chord symbol's taking the caret to its beat in the chord row from the staff it was on, and back
 * there as it closes); what was chosen let go, a field typing at one place.
 */
export function useOpenField(store: EditorStore, shown: Pick<ScoreViewSettings, 'chordNames'>) {
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
      if (fieldClosedBy(next.kind, shown) !== null) return
      const { layer, selection } = store.getState()
      if (next.kind === 'chord' && layer !== 'chords') {
        back.current = layer
        store.dispatch({ type: 'layer', layer: 'chords' })
      } else if (selection) store.dispatch({ type: 'deselect' })
      setField(next)
    },
    [store, shown],
  )
  return { field, openField }
}
