import { useCallback, useMemo } from 'react'
import {
  barAt,
  notesAt,
  placesIn,
  selectionSpan,
  tapsIn,
  type Layer,
} from '@/features/score-editor'
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
export function EditorSheet({ room }: { room?: number | undefined }) {
  const {
    store,
    actions: { dispatch },
    view,
    meta,
  } = useScoreEditorContext()
  const draft = useEditorState((state) => state.draft)
  const caret = useEditorState((state) => state.caret)
  const layer = useEditorState((state) => state.layer)
  const selection = useEditorState((state) => state.selection)
  const chordNote = useEditorState((state) => state.chordNote)
  const chosen = useMemo(() => (selection ? selectionSpan(selection) : null), [selection])
  const onPlace = useCallback(
    (tick: Tick, to: Layer, extend: boolean, key?: Midi) =>
      dispatch(
        key === undefined
          ? { type: 'place', tick, layer: to, extend }
          : { type: 'place', tick, layer: to, extend, key },
      ),
    [dispatch],
  )
  // A held finger dragged onto a bar: what is chosen reaches its last note on, its first back.
  const onReach = useCallback(
    (start: Tick) => {
      const state = store.getState()
      const bar = barAt(state.draft, start)
      const end = bar.start + bar.bar.ticks
      const taps = tapsIn(state, state.layer).filter((tick) => tick >= bar.start && tick < end)
      const from = state.selection?.anchor.from ?? state.caret
      const tick = start > from ? taps.at(-1) : taps[0]
      dispatch({ type: 'place', tick: tick ?? start, layer: state.layer, extend: true })
    },
    [dispatch, store],
  )
  const onDeselect = useCallback(() => dispatch({ type: 'deselect' }), [dispatch])
  const { openSettings: open } = view
  const openSettings = useCallback(() => open(true), [open])
  // Read when a bar is clicked, so a line's row does not change with every note written elsewhere.
  const placesOf = useCallback((to: Layer) => placesIn(store.getState(), to), [store])
  const tapsOf = useCallback((to: Layer) => tapsIn(store.getState(), to), [store])
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
      chordNote={chordNote}
      layer={layer}
      selection={chosen}
      onPlace={onPlace}
      onReach={onReach}
      onDeselect={onDeselect}
      placesOf={placesOf}
      tapsOf={tapsOf}
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
