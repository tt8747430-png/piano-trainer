import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { keysRange } from '@/features/practice'
import { notesAt, type EditorState } from '@/features/score-editor'
import { LiveKeyboard, useFoldKeys } from '@/features/live-keyboard'
import { cn } from '@/shared/lib'
import { midi, rangeOf, type KeyRange, type Midi } from '@/shared/lib/music'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** With nothing at the caret (a rest, an empty bar), the keys hold C3 to C5, middle C at their centre, as the boards draw them. */
const MIDDLE: KeyRange = { from: midi(48), to: midi(72) }

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
 * every screen's keys. As Flat's, it is shown or hidden by the piano button beside the selection
 * (R34) and leaves nothing behind when hidden, and it steps aside while the phone's palette is
 * unfolded (`stepAside`), back as the palette folds. On a phone on its side, too short for the keys
 * and a grand staff, it opens hidden, its fold kept apart there (ADR 0062).
 */
export function EditorKeyboard({
  stepAside = false,
  edge,
}: {
  stepAside?: boolean
  /** Under the sheet beside a docked panel: the screen's edge it reaches, past the gutter. */
  edge?: 'left' | 'right'
}) {
  const { actions } = useScoreEditorContext()
  const here = useEditorState(useShallow(caretKeys))
  const range = useEditorState(useShallow(scoreSpan))
  const hands = useEditorState(useShallow(handsHere))
  const inView = useMemo(() => rangeOf([...here, ...hands]) ?? MIDDLE, [here, hands])
  const selected = useMemo(() => new Set(here), [here])
  const { folded } = useFoldKeys()
  if (folded || stepAside) return null
  return (
    <div
      data-area="keys"
      className={cn(
        'vt-keys min-w-0 shrink-0',
        edge === undefined
          ? '-mx-gutter'
          : edge === 'left'
            ? '-mr-3 ml-[calc(-1*var(--gutter))]'
            : '-ml-3 mr-[calc(-1*var(--gutter))]',
      )}
    >
      <LiveKeyboard
        range={range}
        // The caret's keys in sight with both hands' there, narrowing to hold them as the Player's
        // keys narrow to hold its chords, so the keys stand as long in both modes (ADR 0115).
        inView={inView}
        fitInView
        selected={selected}
        onKeyPress={actions.play}
        spacePedal={false}
      />
    </div>
  )
}
