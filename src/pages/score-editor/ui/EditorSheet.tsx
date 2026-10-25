import { useCallback, useMemo } from 'react'
import { selectScoreView, useSettings } from '@/entities/settings'
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
import { ScoreSheet, type EditPrinted } from '@/widgets/score-sheet'
import type { TitlePlace } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { seenDraft } from '../model/seen-draft'
import { useHeardPlayhead } from '../model/use-heard-playhead'
import { PrintedEdit } from './PrintedEdit'
import { TitleField } from './TitleField'

/** The title printed where the sheet prints it, edited there (ADR 0094). */
const titleAt = (place: TitlePlace) => <TitleField place={place} />
/**
 * The tempo mark, a section's name, a key or time signature, a clef, a staff's name: each opening
 * its popover or menu where it is printed.
 */
const editPrinted: EditPrinted = (printed, trigger) => (
  <PrintedEdit printed={printed} trigger={trigger} />
)

/** How a note moved on its staff is heard: short and soft, as a notation app sounds it. */
const HEARD = { duration: 0.35, velocity: 0.15 } as const

/**
 * The sheet the editor writes on, as the View shows the score (ADR 0094: its staves, its chord
 * symbols): the caret where the next note or chord goes; a double click on a staff writes the note
 * there, and a note dragged up or down moves by the key's notes, heard as it goes. While Play plays,
 * the playhead follows the music apart from the caret (ADR 0096).
 */
export function EditorSheet({ room }: { room?: number | undefined }) {
  const {
    store,
    heard,
    actions: { dispatch },
    view,
  } = useScoreEditorContext()
  const playhead = useHeardPlayhead(heard)
  const draft = useEditorState((state) => state.draft)
  const shown = useSettings(selectScoreView)
  const seen = useMemo(() => seenDraft(draft, shown), [draft, shown])
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
      draft={seen}
      caret={caret}
      playhead={playhead}
      chordNote={chordNote}
      layer={layer}
      selection={chosen}
      onPlace={onPlace}
      onReach={onReach}
      onDeselect={onDeselect}
      placesOf={placesOf}
      tapsOf={tapsOf}
      chordNames={view.chordNames}
      lyrics={view.lyrics}
      edit={editPrinted}
      hidden={shown.hidden}
      view={view.layout}
      title={titleAt}
      room={room}
      onWrite={onWrite}
      onDrag={onDrag}
    />
  )
}
