import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { keysRange } from '@/features/practice'
import { notesAt, type EditorState } from '@/features/score-editor'
import { selectKeyboard, useSettings } from '@/entities/settings'
import { KeyboardStrip, LiveKeyboard, useFoldKeys } from '@/features/live-keyboard'
import { rangeOf, type KeyRange, type Midi } from '@/shared/lib/music'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** The keys of the notes at the caret. */
const caretKeys = ({ draft, caret, layer }: EditorState): Midi[] =>
  layer === 'chords' ? [] : notesAt(draft, layer, caret).map((n) => n.midi)

/**
 * The keys both hands play at the caret, as the Player's keys mark the beat it is on: what they
 * narrow to hold (the widest kept), so they are as wide in both modes (ADR 0115).
 */
const handsHere = ({ draft, caret }: EditorState): Midi[] =>
  (['rh', 'lh'] as const).flatMap((hand) => notesAt(draft, hand, caret).map((n) => n.midi))

/**
 * The keys the score's notes need, as the Player shows its keys (ADR 0115): the same keys as wide in
 * both modes, so the keys, the transport and the sheet stand still as Practise · Edit switches.
 */
function scoreSpan({ draft }: EditorState): KeyRange {
  return keysRange(
    [...draft.staves.flatMap((staff) => staff.notes), ...draft.hands.rh, ...draft.hands.lh].map(
      (n) => n.midi,
    ),
  )
}

/**
 * The keyboard: a key played is written at the caret; the notes there are chosen keys. While a take
 * records, Space stops it rather than holding the pedal. Docked where the keyboard settings dock
 * every screen's keys, under the palette at the foot or under the bar at the top; hidden from the
 * bar's Keyboard (R34), it folds into a thin strip that brings it back at a tap, as the bar does,
 * staying hidden until shown (ADR 0062). On a phone on its
 * side, too short for the keys and a grand staff, it opens folded, its fold kept apart there (ADR 0062).
 */
export function EditorKeyboard() {
  const { actions, takes } = useScoreEditorContext()
  const here = useEditorState(useShallow(caretKeys))
  const range = useEditorState(useShallow(scoreSpan))
  const hands = useEditorState(useShallow(handsHere))
  const inView = useMemo(() => rangeOf([...here, ...hands]), [here, hands])
  const selected = useMemo(() => new Set(here), [here])
  const { folded, fold } = useFoldKeys()
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const edge = dock === 'bottom' ? 'above' : 'below'
  return (
    <div data-area="keys" className="vt-keys -mx-gutter min-w-0 shrink-0">
      {folded ? (
        <KeyboardStrip edge={edge} onShow={() => fold(false)} />
      ) : (
        <LiveKeyboard
          range={range}
          // The caret's keys in sight with both hands' there, narrowing to hold them as the Player's
          // keys narrow to hold its chords, so the keys stand as long in both modes (ADR 0115).
          inView={inView}
          fitInView
          selected={selected}
          onKeyPress={actions.play}
          spacePedal={takes.stage === 'idle'}
          divider={edge}
        />
      )}
    </div>
  )
}
