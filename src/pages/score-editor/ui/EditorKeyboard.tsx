import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { notesAt, notesOf, type EditorState } from '@/features/score-editor'
import { LiveKeyboard } from '@/features/live-keyboard'
import { keyboardRange, midi, type KeyRange, type Midi } from '@/shared/lib/music'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** The keys a hand writes in: the treble's from C4, the left hand's from C3, grown to its notes. */
const TREBLE = { from: midi(60), to: midi(83) }
const BASS = { from: midi(36), to: midi(59) }

/** The keys of the notes at the caret. */
const caretKeys = ({ draft, caret, layer }: EditorState): Midi[] =>
  layer === 'chords' ? [] : notesAt(draft, layer, caret).map((n) => n.midi)

/** The stretch the layer's notes cover. */
function layerSpan({ draft, layer }: EditorState): KeyRange {
  const keys = layer === 'chords' ? [] : notesOf(draft, layer).map((n) => n.midi)
  return keyboardRange(keys, layer === 'lh' ? BASS : TREBLE)
}

/** The keyboard: a key played is written at the caret; the notes there are chosen keys. */
export function EditorKeyboard() {
  const { actions } = useScoreEditorContext()
  const here = useEditorState(useShallow(caretKeys))
  const range = useEditorState(useShallow(layerSpan))
  const selected = useMemo(() => new Set(here), [here])
  return (
    <div className="flex h-40 min-w-0 shrink-0 lg:h-48">
      <LiveKeyboard range={range} height="fill" selected={selected} onKeyPress={actions.play} />
    </div>
  )
}
