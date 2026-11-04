import { useState } from 'react'
import { barsOf, meterBar, sectionMeter } from '@/features/score-editor'
import { barTicks, meterParts, meterSymbol, type Meter, type Tick } from '@/shared/lib/music'
import {
  TimeSignatureField,
  type TimeApplyTo,
  type TimeSignatureValue,
} from '@/shared/ui/pickers/time-signature-field'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useSignatureFrom } from '../model/use-signature-from'

/** A beat of a meter's written unit, in ticks: a quarter in 3/4, an eighth in 6/8. */
const unitTicks = (meter: Meter): Tick => barTicks(meter) / meterParts(meter).count

/** A first bar of `ticks` as a pickup of whole beats of the written unit: none for a whole bar. */
function pickupBeats(ticks: Tick, meter: Meter): number {
  if (ticks >= barTicks(meter)) return 0
  return Math.max(0, Math.round(ticks / unitTicks(meter)))
}

/**
 * The time signature written to the score (A34): the one control, `TimeSignatureField`, each choice
 * applied at once as one step Undo takes back. From a bar's section on (`bar`, a sign's on the sheet,
 * else the first bar chosen's), the whole song's in its first section with its pickup; in the palette
 * (`applyTo`), From this bar · Whole song.
 */
export function TimePicker({
  bar,
  applyTo = false,
}: {
  bar?: number | undefined
  applyTo?: boolean
}) {
  const { actions } = useScoreEditorContext()
  const { from, section, song } = useSignatureFrom(bar)
  const draft = useEditorState((state) => state.draft)
  const [where, setWhere] = useState<TimeApplyTo>('from')
  const whole = applyTo && where === 'whole'
  const meter = sectionMeter(draft, whole ? 0 : section)
  const value: TimeSignatureValue = {
    meter,
    symbol: meterSymbol(meter) !== null && draft.timeSymbol === true,
  }
  const first = barsOf(draft)[0]?.bar.ticks ?? barTicks(draft.meter)
  const atHead = song || whole
  const apply = (next: TimeSignatureValue, pickup?: Tick) =>
    actions.dispatch({
      type: 'time',
      bar: from,
      time: {
        meter: next.meter,
        ...(meterSymbol(next.meter) !== null ? { timeSymbol: next.symbol } : {}),
        ...(pickup !== undefined ? { pickup } : {}),
        ...(whole ? { whole: true } : {}),
      },
    })
  return (
    <TimeSignatureField
      value={value}
      onChange={(next) => apply(next)}
      barred={(each) => each !== meter && meterBar(draft, whole ? 0 : section, each) !== null}
      pickup={
        atHead
          ? {
              beats: pickupBeats(first, draft.meter),
              most: meterParts(draft.meter).count - 1,
              onChange: (beats) =>
                apply(value, beats === 0 ? barTicks(draft.meter) : beats * unitTicks(draft.meter)),
            }
          : undefined
      }
      applyTo={applyTo ? { value: where, onChange: setWhere } : undefined}
    />
  )
}
