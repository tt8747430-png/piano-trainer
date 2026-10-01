import { useMemo } from 'react'
import { notesAt, notesOf, type EditorState } from '@/features/score-editor'
import { LiveKeyboard } from '@/features/live-keyboard'
import { keyboardRange, midi } from '@/shared/lib/music'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** The keys a hand writes in: the treble's from C4, the left hand's from C3, grown to its notes. */
const TREBLE = { from: midi(60), to: midi(83) }
const BASS = { from: midi(36), to: midi(59) }

/** The keys of the notes at the caret, as one string: the keyboard redraws only when they change. */
const caretKeys = ({ draft, caret, layer }: EditorState): string =>
  layer === 'chords'
    ? ''
    : notesAt(draft, layer, caret)
        .map((n) => n.midi)
        .join(' ')

/** The stretch the layer's notes cover, as one string. */
function layerSpan({ draft, layer }: EditorState): string {
  const keys = layer === 'chords' ? [] : notesOf(draft, layer).map((n) => n.midi)
  const { from, to } = keyboardRange(keys, layer === 'lh' ? BASS : TREBLE)
  return `${from} ${to}`
}

const keysOf = (text: string) =>
  text === '' ? [] : text.split(' ').map((key) => midi(Number(key)))

/** The keyboard: a key played is written at the caret; the notes there are chosen keys. */
export function EditorKeyboard() {
  const { actions } = useScoreEditorContext()
  const here = useEditorState(caretKeys)
  const span = useEditorState(layerSpan)
  const selected = useMemo(() => new Set(keysOf(here)), [here])
  const range = useMemo(() => {
    const [from = TREBLE.from, to = TREBLE.to] = keysOf(span)
    return { from, to }
  }, [span])
  return (
    <div className="flex h-40 min-w-0 shrink-0 lg:h-48">
      <LiveKeyboard range={range} height="fill" selected={selected} onKeyPress={actions.play} />
    </div>
  )
}
