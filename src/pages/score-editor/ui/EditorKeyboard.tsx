import { ChevronDown, ChevronUp } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { keysRange } from '@/features/practice'
import { notesAt, type EditorState } from '@/features/score-editor'
import { selectKeyboard, useSettings } from '@/entities/settings'
import { LiveKeyboard, useFoldKeys } from '@/features/live-keyboard'
import { rangeOf, type KeyRange, type Midi } from '@/shared/lib/music'
import { RailButton, RailGroup } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** The keys of the notes at the caret. */
const caretKeys = ({ draft, caret, layer }: EditorState): Midi[] =>
  layer === 'chords' ? [] : notesAt(draft, layer, caret).map((n) => n.midi)

/**
 * The keys both hands play at the caret, as the Player's keys mark the beat it is on: what they
 * narrow to hold (the widest kept), so they are as wide in both modes (ADR 0110).
 */
const handsHere = ({ draft, caret }: EditorState): Midi[] =>
  (['rh', 'lh'] as const).flatMap((hand) => notesAt(draft, hand, caret).map((n) => n.midi))

/**
 * The keys the score's notes need, as the Player shows its keys (ADR 0110): the same keys as wide in
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
 * every screen's keys, under the palette at the foot or under the bar at the top; folded from its
 * rail, it leaves its room to the sheet and comes back from the palette's row of tabs or the View
 * menu, staying folded until unfolded (ADR 0055). On a phone on its
 * side, too short for the keys and a grand staff, it opens folded, its fold kept apart there (ADR 0062).
 */
export function EditorKeyboard() {
  const { t } = useTranslation('common')
  const { actions, takes } = useScoreEditorContext()
  const here = useEditorState(useShallow(caretKeys))
  const range = useEditorState(useShallow(scoreSpan))
  const hands = useEditorState(useShallow(handsHere))
  const inView = useMemo(() => rangeOf([...here, ...hands]), [here, hands])
  const selected = useMemo(() => new Set(here), [here])
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const { folded, fold } = useFoldKeys()
  if (folded) return null
  return (
    <div data-area="keys" className="vt-keys min-w-0 shrink-0">
      <LiveKeyboard
        range={range}
        // The caret's keys in sight with both hands' there, narrowing to hold them as the Player's
        // keys narrow to hold its chords, so the keys stand as long in both modes (ADR 0110).
        inView={inView}
        fitInView
        selected={selected}
        onKeyPress={actions.play}
        spacePedal={takes.stage === 'idle'}
        railEnd={
          <RailGroup>
            <RailButton
              label={t('rail.fold')}
              icon={dock === 'bottom' ? ChevronDown : ChevronUp}
              onClick={() => fold(true)}
            />
          </RailGroup>
        }
      />
    </div>
  )
}
