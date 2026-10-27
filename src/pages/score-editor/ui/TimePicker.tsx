import { useState, type KeyboardEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { barsOf, meterBar, sectionMeter } from '@/features/score-editor'
import {
  barTicks,
  eighthTicks,
  METER_COUNTS,
  METER_UNITS,
  meterOf,
  meterParts,
  meterSymbol,
  TICKS_PER_BEAT,
  timeSignature,
  type Meter,
  type Tick,
} from '@/shared/lib/music'
import { InfoTip, SwitchRow, Wheel, type WheelOption } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useSignatureFrom } from '../model/use-signature-from'
import { PickerActions } from './SignPicker'

/** A staff space of the picker's time signature, in CSS px: each figure two spaces tall. */
const SPACE = 28
const FIGURE = 2 * SPACE

/** The music font's common and cut time. */
const SYMBOL_GLYPH = { common: '\u{1D134}', cut: '\u{1D135}' } as const

/** The notes a pickup is counted in: a half, a quarter, an eighth, a sixteenth. */
const PICKUP_UNITS = [2, 4, 8, 16] as const
type PickupUnit = (typeof PICKUP_UNITS)[number]
const pickupUnitTicks = (unit: PickupUnit, meter: Meter): Tick => (eighthTicks(meter) * 8) / unit

/** A pickup as a count of a note: none (0), or one to as many as stay under the bar. */
interface Pickup {
  readonly count: number
  readonly unit: PickupUnit
}

/** How many of a note a pickup may hold in a meter's bar: fewer than a whole bar's. */
const mostIn = (unit: PickupUnit, meter: Meter): number => {
  const ticks = pickupUnitTicks(unit, meter)
  return Number.isInteger(ticks) ? Math.floor((barTicks(meter) - 1) / ticks) : 0
}

/** The pickup a first bar of `ticks` is, as its time signature writes it; none for a whole bar. */
function pickupOf(ticks: Tick, meter: Meter): Pickup {
  const unit = meterParts(meter).unit
  if (ticks >= barTicks(meter)) return { count: 0, unit }
  const { count, unit: written } = timeSignature(ticks / TICKS_PER_BEAT, meter)
  return { count, unit: written }
}

/** A pickup's first bar in ticks: a whole bar for none. */
const pickupTicks = ({ count, unit }: Pickup, meter: Meter): Tick =>
  count === 0 ? barTicks(meter) : count * pickupUnitTicks(unit, meter)

/** The pickup kept as a meter changes: as it was where the new bar holds it, else none. */
const keptPickup = (pickup: Pickup, meter: Meter): Pickup =>
  pickup.count <= mostIn(pickup.unit, meter) ? pickup : { count: 0, unit: meterParts(meter).unit }

/**
 * A column of the picker: its name over it, then its two figures on a staff's five faint lines, the
 * top one's neighbours showing above the staff and the bottom one's below.
 */
function TimeColumn({
  name,
  info,
  children,
}: {
  name: string
  info?: string | undefined
  children: ReactNode
}) {
  return (
    <div role="group" aria-label={name} className="flex flex-col items-center gap-2">
      <span className="flex h-6 items-center gap-1 text-sm font-semibold text-muted-foreground">
        {name}
        {info ? <InfoTip name={name}>{info}</InfoTip> : null}
      </span>
      <div className="relative w-24 py-11" style={{ height: 4 * SPACE + 88 }}>
        <div aria-hidden className="absolute inset-x-0 top-11" style={{ height: 4 * SPACE }}>
          {[0, 1, 2, 3, 4].map((line) => (
            <span
              key={line}
              className="absolute inset-x-0 h-px bg-foreground/15"
              style={{ top: line * SPACE }}
            />
          ))}
        </div>
        <div className="relative flex flex-col items-center">{children}</div>
      </div>
    </div>
  )
}

/** The wheels' face in the picker: its figures large in the serif, the value on a soft round band. */
const FIGURE_WHEEL =
  'w-20 [&_[data-value]]:text-5xl [&_[data-value]]:font-extrabold [&_[data-slot=wheel-band]]:inset-x-2 [&_[data-slot=wheel-band]]:rounded-full [&_[data-slot=wheel-band]]:border-0 [&_[data-slot=wheel-band]]:bg-foreground/7'

/**
 * The time signature's picker (ADR 0114, after notation apps' wheels): Current and Pickup side by side,
 * each a time signature as it prints, its two figures large on a staff's lines and each a wheel slid up
 * and down (typed, or stepped with ↑ ↓), Beat and Beat type named once at their left. Any count of one
 * to twelve over a half, a quarter or an eighth; one the song cannot take there greyed (a meter
 * counted in dotted quarters after a section in quarters, or notes that fall between its ticks). At
 * the song's head, the Pickup: its first bar as a count of a note, or none (–). For 4/4 or 2/2, Use
 * common or cut time symbol, the C or ¢ drawn over both figures in the accent. Nothing changes until ✓
 * (Enter), one step Undo takes back; ✗ (Escape) leaves it. From a bar's section on (`bar`, a sign's on
 * the sheet, else the first bar chosen's), the whole song's in its first section.
 */
export function TimePicker({ bar, onDone }: { bar?: number | undefined; onDone: () => void }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const { from, section, song } = useSignatureFrom(bar)
  const draft = useEditorState((state) => state.draft)
  const was = {
    meter: sectionMeter(draft, section),
    timeSymbol: draft.timeSymbol ?? false,
    pickup: barsOf(draft)[0]?.bar.ticks ?? 0,
  }
  const [meter, setMeter] = useState(was.meter)
  const [symbol, setSymbol] = useState(was.timeSymbol)
  const [pickup, setPickup] = useState<Pickup>(() => pickupOf(was.pickup, was.meter))
  const { count, unit } = meterParts(meter)
  const barred = (each: Meter | undefined) => !each || meterBar(draft, section, each) !== null

  const choose = (next: Meter | undefined) => {
    if (!next || barred(next)) return
    setMeter(next)
    setPickup((now) => keptPickup(now, next))
  }
  const beats: WheelOption<number>[] = METER_COUNTS.map((value) => ({
    value,
    label: String(value),
    disabled: barred(meterOf(value, unit)),
  }))
  const units: WheelOption<number>[] = METER_UNITS.map((value) => ({
    value,
    label: String(value),
    disabled: barred(meterOf(count, value)),
  }))
  const most = mostIn(pickup.unit, meter)
  const pickupCounts: WheelOption<number>[] = [
    { value: 0, label: '–' },
    ...Array.from({ length: Math.min(most, 12) }, (_, at) => ({
      value: at + 1,
      label: String(at + 1),
    })),
  ]
  const pickupUnits: WheelOption<number>[] = PICKUP_UNITS.map((value) => ({
    value,
    label: pickup.count === 0 ? '–' : String(value),
    disabled: mostIn(value, meter) < Math.max(1, pickup.count),
  }))

  const sign = meterSymbol(meter)
  const shown = sign !== null && symbol ? sign : null
  const ticks = pickupTicks(pickup, meter)
  const changed =
    meter !== was.meter ||
    (sign !== null && symbol !== was.timeSymbol) ||
    (song && ticks !== Math.min(was.pickup, barTicks(was.meter)))
  const apply = () => {
    if (!changed) return
    actions.dispatch({
      type: 'time',
      bar: from,
      time: {
        meter,
        ...(sign !== null ? { timeSymbol: symbol } : {}),
        ...(song ? { pickup: ticks } : {}),
      },
    })
    onDone()
  }
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' || event.target instanceof HTMLButtonElement) return
    event.preventDefault()
    apply()
  }
  const wheel = { row: FIGURE, className: FIGURE_WHEEL } as const

  return (
    <div className="flex flex-col gap-4" onKeyDown={onKeyDown}>
      <div className="flex items-start justify-center gap-3 min-[380px]:gap-5">
        {/* Beat and Beat type, named once at the left, level with the figures they name. */}
        <div className="flex flex-col items-end pt-8 text-sm text-muted-foreground">
          <span aria-hidden className="flex items-center" style={{ height: 44 + FIGURE }}>
            <span className="mt-11">{t('time.beat')}</span>
          </span>
          <span className="flex items-center gap-1" style={{ height: FIGURE }}>
            <span aria-hidden>{t('time.beatType')}</span>
            <InfoTip name={t('time.beatType')}>{t('time.beatTypeInfo')}</InfoTip>
          </span>
        </div>
        <TimeColumn name={t('time.current')}>
          {shown ? (
            <span
              role="img"
              aria-label={t(`time.symbolName.${shown}`)}
              className="grid place-items-center font-music leading-none text-link"
              style={{ height: 2 * FIGURE, fontSize: 4.4 * SPACE }}
            >
              {SYMBOL_GLYPH[shown]}
            </span>
          ) : (
            <>
              <Wheel
                label={t('time.beat')}
                options={beats}
                value={count}
                onChange={(next) => choose(meterOf(next, unit))}
                reveal="above"
                {...wheel}
              />
              <Wheel
                label={t('time.beatType')}
                options={units}
                value={unit}
                onChange={(next) => choose(meterOf(count, next))}
                reveal="below"
                {...wheel}
              />
            </>
          )}
        </TimeColumn>
        {song ? (
          <TimeColumn name={t('time.pickup')} info={t('time.pickupInfo')}>
            <Wheel
              label={t('time.pickupBeats')}
              options={pickupCounts}
              value={pickup.count}
              onChange={(next) => setPickup({ count: next, unit: pickup.unit })}
              reveal="above"
              {...wheel}
            />
            <Wheel
              label={t('time.pickupBeatType')}
              options={pickupUnits}
              value={pickup.unit}
              onChange={(next) => setPickup({ count: pickup.count, unit: next as PickupUnit })}
              reveal="below"
              {...wheel}
            />
          </TimeColumn>
        ) : null}
      </div>
      {sign ? (
        <SwitchRow
          label={t(`time.symbol.${sign}`)}
          info={t(`time.symbolInfo.${sign}`)}
          checked={symbol}
          onCheckedChange={setSymbol}
          className="min-h-12 border-b-0 py-0 text-base"
        />
      ) : null}
      <PickerActions onCancel={onDone} onApply={apply} changed={changed} />
    </div>
  )
}
