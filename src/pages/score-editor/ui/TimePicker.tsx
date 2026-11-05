import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { barsOf, meterBar, sectionMeter } from '@/features/score-editor'
import { barTicks, meterParts, meterSymbol, type Meter, type Tick } from '@/shared/lib/music'
import { Segmented } from '@/shared/ui'
import { usePickerLayout } from '@/shared/ui/pickers/picker-layout'
import {
  TimeSignatureField,
  type TimeApplyTo,
  type TimeSignatureValue,
} from '@/shared/ui/pickers/time-signature-field'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useSignatureFrom } from '../model/use-signature-from'
import { PickerActions } from './SignPicker'

/** A beat of a meter's written unit, in ticks: a quarter in 3/4, an eighth in 6/8. */
const unitTicks = (meter: Meter): Tick => barTicks(meter) / meterParts(meter).count

/** A first bar of `ticks` as a pickup of whole beats of the written unit: none for a whole bar. */
function pickupBeats(ticks: Tick, meter: Meter): number {
  if (ticks >= barTicks(meter)) return 0
  return Math.max(0, Math.round(ticks / unitTicks(meter)))
}

/** A time signature being chosen, before ✓ writes it: its value and, at the song's head, its pickup. */
interface Chosen {
  readonly value: TimeSignatureValue
  readonly pickup: number
}

const sameChosen = (a: Chosen, b: Chosen) =>
  a.value.meter === b.value.meter && a.value.symbol === b.value.symbol && a.pickup === b.pickup

/**
 * The palette's Time signature (A34, R31-E, R32-B), the one place a meter is chosen: the one control,
 * `TimeSignatureField`, its choice written by ✓ as one step Undo takes back, ✗ leaving it as it was
 * (both at the bottom right, the owner's ruling). From the first bar chosen's section on (a time
 * signature tapped on the score chooses its bar), the whole song's in its first section with its
 * pickup. From this bar · Whole song only where the two differ: after the first section, or where a
 * later section has a meter of its own. In the folded palette's row, its tiles alone, a tap writing
 * at once.
 */
export function TimePicker() {
  const { t } = useTranslation('music')
  const { actions } = useScoreEditorContext()
  const { from, section, song } = useSignatureFrom()
  const draft = useEditorState((state) => state.draft)
  const [where, setWhere] = useState<TimeApplyTo>('from')
  const [staged, setStaged] = useState<Chosen | null>(null)
  const row = usePickerLayout() === 'row'
  // At the head of a song in one meter, from this bar and the whole song are the same.
  const applyTo =
    !song || draft.sections.some((each) => (each.heading.meter ?? draft.meter) !== draft.meter)
  const whole = applyTo && where === 'whole'
  const meter = sectionMeter(draft, whole ? 0 : section)
  const atHead = song || whole
  const first = barsOf(draft)[0]?.bar.ticks ?? barTicks(draft.meter)
  const written: Chosen = {
    value: { meter, symbol: meterSymbol(meter) !== null && draft.timeSymbol === true },
    pickup: atHead ? pickupBeats(first, draft.meter) : 0,
  }
  const chosen = staged ?? written
  const barred = (each: Meter) =>
    each !== meter && meterBar(draft, whole ? 0 : section, each) !== null
  const write = ({ value, pickup: asked }: Chosen) => {
    // Never a whole bar's beats: a pickup is a beat short of its bar at most.
    const pickup = Math.min(asked, meterParts(value.meter).count - 1)
    actions.dispatch({
      type: 'time',
      bar: from,
      time: {
        meter: value.meter,
        ...(meterSymbol(value.meter) !== null ? { timeSymbol: value.symbol } : {}),
        ...(atHead
          ? { pickup: pickup === 0 ? barTicks(value.meter) : pickup * unitTicks(value.meter) }
          : {}),
        ...(whole ? { whole: true } : {}),
      },
    })
  }
  if (row)
    return (
      <TimeSignatureField
        value={written.value}
        onChange={(value) => write({ value, pickup: written.pickup })}
        barred={barred}
      />
    )
  const blocked = barred(chosen.value.meter)
  const finish = () => setStaged(null)
  return (
    <div className="flex flex-col gap-3">
      {applyTo ? (
        <Segmented
          label={t('timeField.applyTo')}
          value={where}
          options={[
            { value: 'from', label: t('timeField.fromBar') },
            { value: 'whole', label: t('timeField.wholeSong') },
          ]}
          onChange={(next) => {
            setWhere(next)
            setStaged(null)
          }}
        />
      ) : null}
      <TimeSignatureField
        value={chosen.value}
        onChange={(value) => setStaged({ ...chosen, value })}
        barred={barred}
        pickup={
          atHead
            ? { beats: chosen.pickup, onChange: (pickup) => setStaged({ ...chosen, pickup }) }
            : undefined
        }
      />
      <div className="flex items-center justify-end gap-3">
        {blocked ? (
          <p role="status" className="min-w-0 flex-1 text-sm text-destructive">
            {t('timeField.barred')}
          </p>
        ) : null}
        <PickerActions
          changed={!blocked && !sameChosen(chosen, written)}
          onCancel={finish}
          onApply={() => {
            write(chosen)
            finish()
          }}
        />
      </div>
    </div>
  )
}
