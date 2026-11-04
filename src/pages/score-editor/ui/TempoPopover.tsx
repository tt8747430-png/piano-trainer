import { useState, type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { PIECE_TEMPO } from '@/entities/piece'
import { notesOf } from '@/features/score-editor'
import { beatUnit, tempoMark, tempoUnitsFor, type Meter, type TempoUnit } from '@/shared/lib/music'
import { Button } from '@/shared/ui/primitives/button'
import { TempoField, type TempoValue } from '@/shared/ui/pickers/tempo-field'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { SignPicker } from './SignPicker'

/** The marks a piece's tempo may be written at in a unit: 40 to 160 of the song's beats a minute. */
function markRange(unit: TempoUnit, meter: Meter) {
  return {
    low: Math.ceil(tempoMark(PIECE_TEMPO.min, unit, meter)),
    high: Math.floor(tempoMark(PIECE_TEMPO.max, unit, meter)),
  }
}

/** What a tempo change mid-song may say: whole beats a minute, 20 to 400. */
const CHANGE = { low: 20, high: 400 } as const

/** Save, and Delete where there is a mark to take off. */
function Actions({
  onSave,
  onDelete,
  changed,
}: {
  onSave: () => void
  onDelete?: (() => void) | undefined
  changed: boolean
}) {
  const { t } = useTranslation('editor')
  return (
    <div className="flex items-center justify-end gap-2 pt-1">
      {onDelete ? (
        <Button variant="ghost" className="mr-auto text-destructive" onClick={onDelete}>
          {t('tempo.delete')}
        </Button>
      ) : null}
      <Button disabled={!changed} onClick={onSave}>
        {t('tempo.save')}
      </Button>
    </div>
  )
}

/**
 * The song's tempo mark (A34, Flat's tempo popover): Beat, BPM, Tempo text and Hear the tempo, then
 * Save, one step Undo takes back.
 */
export function TempoPicker({ onDone }: { onDone: () => void }) {
  const { actions } = useScoreEditorContext()
  const meter = useEditorState((state) => state.draft.meter)
  const wasUnit = useEditorState((state) => state.draft.tempoUnit ?? beatUnit(state.draft.meter))
  const wasMark = useEditorState((state) =>
    tempoMark(state.draft.tempo, wasUnit, state.draft.meter),
  )
  const wasText = useEditorState((state) => state.draft.tempoText ?? null)
  const was: TempoValue = { unit: wasUnit, mark: wasMark, text: wasText }
  const [value, setValue] = useState<TempoValue>(was)
  const { low, high } = markRange(value.unit, meter)
  const changed = value.mark !== was.mark || value.unit !== was.unit || value.text !== was.text
  return (
    <div className="flex flex-col gap-3">
      <TempoField
        value={value}
        units={tempoUnitsFor(meter)}
        low={low}
        high={high}
        onChange={(next) => {
          const range = markRange(next.unit, meter)
          setValue({ ...next, mark: Math.min(range.high, Math.max(range.low, next.mark)) })
        }}
      />
      <Actions
        changed={changed}
        onSave={() => {
          actions.dispatch({
            type: 'tempo',
            mark: value.mark,
            unit: value.unit,
            text: value.text?.trim() || null,
          })
          onDone()
        }}
      />
    </div>
  )
}

/**
 * A tempo change mid-song at the caret (A34, Flat's Tempo change in Text): its BPM in the song's beat
 * and Hear the tempo, then Save, or Delete where the notes there carry one.
 */
export function TempoChangePicker({ onDone }: { onDone: () => void }) {
  const { actions } = useScoreEditorContext()
  const unit = useEditorState((state) => beatUnit(state.draft.meter))
  const song = useEditorState((state) => Math.round(state.draft.tempo))
  const marked = useEditorState((state) =>
    state.layer === 'chords'
      ? undefined
      : notesOf(state.draft, state.layer).find((n) => n.startTick === state.caret)?.marks?.tempo,
  )
  const [value, setValue] = useState<TempoValue>({ mark: marked ?? song, unit, text: null })
  return (
    <div className="flex flex-col gap-3">
      <TempoField
        value={value}
        units={null}
        words={false}
        low={CHANGE.low}
        high={CHANGE.high}
        onChange={setValue}
      />
      <Actions
        changed={value.mark !== marked}
        onSave={() => {
          actions.dispatch({ type: 'tempoChange', tempo: value.mark })
          onDone()
        }}
        onDelete={
          marked === undefined
            ? undefined
            : () => {
                actions.dispatch({ type: 'tempoChange', tempo: null })
                onDone()
              }
        }
      />
    </div>
  )
}

/** The song's tempo mark's popover where the mark is printed (A34). */
export function TempoPopover({ trigger }: { trigger: ReactElement }) {
  const { t } = useTranslation('editor')
  return (
    <SignPicker title={t('song.tempo')} trigger={trigger}>
      {(close) => <TempoPicker onDone={close} />}
    </SignPicker>
  )
}

/** The Text group's Tempo change, opening its popover over the key (A34). */
export function TempoChangePopover({ trigger }: { trigger: ReactElement }) {
  const { t } = useTranslation('editor')
  return (
    <SignPicker title={t('tempo.change')} trigger={trigger}>
      {(close) => <TempoChangePicker onDone={close} />}
    </SignPicker>
  )
}
