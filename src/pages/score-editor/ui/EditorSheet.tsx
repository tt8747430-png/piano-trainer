import { useCallback, useMemo } from 'react'
import { caretTicks, notesAt, placesIn, selectedBars, type Layer } from '@/features/score-editor'
import type { Midi, Tick } from '@/shared/lib/music'
import { usePlay } from '@/shared/lib/services'
import { ScoreSheet } from '@/widgets/score-sheet'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { SectionHeading } from './SectionHeading'

/** How a note moved on its staff is heard: short and soft, as a notation app sounds it. */
const HEARD = { duration: 0.35, velocity: 0.15 } as const

/**
 * The sheet the editor writes on: the caret where the next note or chord goes; a double click on a
 * staff writes the note there, and a note dragged up or down moves by the key's notes, heard as it goes.
 */
export function EditorSheet({ room }: { room?: number }) {
  const {
    store,
    actions: { dispatch },
    view,
    meta,
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
  const play = usePlay()
  const onWrite = useCallback(
    (tick: Tick, to: Layer, key: Midi) => {
      dispatch({ type: 'place', tick, layer: to })
      dispatch({ type: 'key', key, time: performance.now() })
    },
    [dispatch],
  )
  const onDrag = useCallback(
    (steps: number, joins: boolean) => {
      dispatch({ type: 'step', steps, joins })
      const state = store.getState()
      if (state.layer === 'chords') return
      play(
        notesAt(state.draft, state.layer, state.caret).map((n) => ({
          kind: 'note' as const,
          midi: n.midi,
          at: 0,
          ...HEARD,
        })),
      )
    },
    [dispatch, store, play],
  )
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
      view={view.layout}
      title={meta.title}
      room={room}
      onWrite={onWrite}
      onDrag={onDrag}
    />
  )
}
