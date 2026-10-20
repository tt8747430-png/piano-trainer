import { ChevronDown, ChevronUp, Piano } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { notesAt, notesOf, type EditorState } from '@/features/score-editor'
import { selectKeyboard, useSettings } from '@/entities/settings'
import { LiveKeyboard, useFoldKeys } from '@/features/live-keyboard'
import { keyboardRange, midi, type KeyRange, type Midi } from '@/shared/lib/music'
import { LANDSCAPE_PHONE, useMediaQuery } from '@/shared/lib'
import { FabPill, RailButton, RailGroup, RoundButton } from '@/shared/ui'
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

/**
 * The keyboard: a key played is written at the caret; the notes there are chosen keys. While a take
 * records, Space stops it rather than holding the pedal. It folds from its rail into a Keys button
 * floating over the sheet's corner (at the bar's end on a phone on its side), as every screen's keys
 * do (ADR 0055), and the sheet takes the height; folded, it stays folded on every screen until
 * unfolded. On a phone on its side, too short
 * for the keys and a grand staff, it opens folded, its fold kept apart there (ADR 0062).
 */
export function EditorKeyboard() {
  const { t } = useTranslation('common')
  const { actions, takes } = useScoreEditorContext()
  const here = useEditorState(useShallow(caretKeys))
  const range = useEditorState(useShallow(layerSpan))
  const selected = useMemo(() => new Set(here), [here])
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const { folded, fold } = useFoldKeys()
  const onSide = useMediaQuery(LANDSCAPE_PHONE)
  if (folded)
    return (
      <div data-area="unfold">
        {onSide ? (
          // At the bar's end, among its round buttons, where the width is short.
          <RoundButton label={t('rail.unfold')} icon={Piano} onClick={() => fold(false)} />
        ) : (
          <FabPill
            label={t('rail.unfold')}
            icon={Piano}
            onClick={() => fold(false)}
            className="vt-keys"
          />
        )}
      </div>
    )
  return (
    <div data-area="keys" className="vt-keys min-w-0 shrink-0">
      <LiveKeyboard
        range={range}
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
