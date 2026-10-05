import { useCallback, useMemo } from 'react'
import { caretTicks, placesIn, selectedBars, type Layer } from '@/features/score-editor'
import type { Tick } from '@/shared/lib/music'
import { ScoreSheet } from '@/widgets/score-sheet'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { SectionHeading } from './SectionHeading'

/** The sheet the editor writes on: the caret where the next note or chord goes. */
export function EditorSheet() {
  const {
    store,
    actions: { dispatch },
    view,
  } = useScoreEditorContext()
  const draft = useEditorState((state) => state.draft)
  const caret = useEditorState((state) => state.caret)
  const layer = useEditorState((state) => state.layer)
  const width = useEditorState(caretTicks)
  const selection = useEditorState((state) => state.selection)
  const chosen = useMemo(() => (selection ? selectedBars(selection) : null), [selection])
  const onPlace = useCallback(
    (tick: Tick, to: Layer, extend: boolean) =>
      dispatch({ type: 'place', tick, layer: to, extend }),
    [dispatch],
  )
  const { openSettings: open } = view
  const openSettings = useCallback(() => open(true), [open])
  // Read when a bar is clicked, so a line's row does not change with every note written elsewhere.
  const placesOf = useCallback((to: Layer) => placesIn(store.getState(), to), [store])
  return (
    <ScoreSheet
      draft={draft}
      caret={caret}
      layer={layer}
      caretTicks={width}
      selection={chosen}
      onPlace={onPlace}
      placesOf={placesOf}
      heading={(section) => <SectionHeading section={section} />}
      chordNames={view.chordNames}
      onSignature={openSettings}
    />
  )
}
