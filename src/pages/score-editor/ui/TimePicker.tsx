import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { barsOf, meterBar, sectionMeter } from '@/features/score-editor'
import { barTicks, meterParts, meterSymbol, type Meter, type Tick } from '@/shared/lib/music'
import { usePickerLayout } from '@/shared/ui/pickers/picker-layout'
import {
  TimeSignatureTiles,
  TimeSignatureWheels,
  type TimeSignatureValue,
} from '@/shared/ui/pickers/time-signature-field'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useSignatureFrom } from '../model/use-signature-from'
import { PickerActions, SignPicker } from './SignPicker'

/** A beat of a meter's written unit, in ticks: a quarter in 3/4, an eighth in 6/8. */
const unitTicks = (meter: Meter): Tick => barTicks(meter) / meterParts(meter).count

/** A first bar of `ticks` as a pickup of whole beats of the written unit: none for a whole bar. */
function pickupBeats(ticks: Tick, meter: Meter): number {
  if (ticks >= barTicks(meter)) return 0
  return Math.max(0, Math.round(ticks / unitTicks(meter)))
}

/** A time signature being customized, before ✓ writes it: its value and, at the song's head, its pickup. */
interface Chosen {
  readonly value: TimeSignatureValue
  readonly pickup: number
}

const sameChosen = (a: Chosen, b: Chosen) =>
  a.value.meter === b.value.meter && a.value.symbol === b.value.symbol && a.pickup === b.pickup

/**
 * The time signature where the palette writes it (ADR 0114, R32-C): from the first bar chosen's
 * section on (a time signature tapped on the score chooses its bar), the whole song's in its first
 * section, with its pickup there; what is written, and a meter the song cannot take there.
 */
function useTimeAt() {
  const { actions } = useScoreEditorContext()
  const { from, section, song } = useSignatureFrom()
  const draft = useEditorState((state) => state.draft)
  const meter = sectionMeter(draft, section)
  const first = barsOf(draft)[0]?.bar.ticks ?? barTicks(draft.meter)
  const written: Chosen = {
    value: { meter, symbol: meterSymbol(meter) !== null && draft.timeSymbol === true },
    pickup: song ? pickupBeats(first, draft.meter) : 0,
  }
  const barred = (each: Meter) => each !== meter && meterBar(draft, section, each) !== null
  const write = ({ value, pickup: asked }: Chosen) => {
    // Never a whole bar's beats: a pickup is a beat short of its bar at most.
    const pickup = Math.min(asked, meterParts(value.meter).count - 1)
    actions.dispatch({
      type: 'time',
      bar: from,
      time: {
        meter: value.meter,
        ...(meterSymbol(value.meter) !== null ? { timeSymbol: value.symbol } : {}),
        ...(song
          ? { pickup: pickup === 0 ? barTicks(value.meter) : pickup * unitTicks(value.meter) }
          : {}),
      },
    })
  }
  return { song, written, barred, write }
}

/**
 * Flat's Customize (R32-C; help.flat.io: "slide the Pickup numbers … and tap ✓"): the meter as it
 * prints, its figures wheels, and at the song's head the pickup; ✓ writes it as one step Undo takes
 * back, ✗ leaves the score as it was. A sheet on a phone, a popover by its key on a laptop.
 */
function Customize() {
  const { t } = useTranslation('music')
  const { song, written, barred, write } = useTimeAt()
  const [staged, setStaged] = useState<Chosen | null>(null)
  const row = usePickerLayout() === 'row'
  const chosen = staged ?? written
  const blocked = barred(chosen.value.meter)
  const label = t('timeField.customize')
  const trigger = row ? (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      className="h-10 min-w-11 shrink-0 rounded-control text-foreground/75"
    >
      <Pencil aria-hidden />
    </Button>
  ) : (
    <Button variant="outline" className="h-12 justify-start gap-2.5 rounded-control px-4">
      <Pencil data-icon="inline-start" aria-hidden />
      {label}
    </Button>
  )
  return (
    <SignPicker title={t('timeField.customizeTitle')} trigger={trigger}>
      {(close) => {
        const finish = () => {
          setStaged(null)
          close()
        }
        return (
          <div className="flex flex-col gap-4">
            <TimeSignatureWheels
              value={chosen.value}
              onChange={(value) => setStaged({ ...chosen, value })}
              pickup={
                song
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
      }}
    </SignPicker>
  )
}

/**
 * The palette's Time signature (R32-C, Flat's): the tiles 2/4, 3/4, 4/4, C, ¢ and 6/8, a tap writing
 * it at once as one Undo step, then Customize for any other meter and the pickup. It changes from the
 * first bar chosen's section on, the whole song's in its first; a meter the song cannot take there
 * has no tile.
 */
export function TimePicker() {
  const { written, barred, write } = useTimeAt()
  return (
    <TimeSignatureTiles
      value={written.value}
      onChange={(value) => write({ value, pickup: written.pickup })}
      barred={barred}
      customize={<Customize />}
    />
  )
}
