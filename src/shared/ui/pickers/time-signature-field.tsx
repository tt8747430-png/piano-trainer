import { useId, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  METER_COUNTS,
  METER_UNITS,
  meterOf,
  meterParts,
  meterSymbol,
  type Meter,
} from '@/shared/lib/music'
import { Switch } from '../primitives/switch'
import { TimeSignatureSign } from '../smufl'
import { PickerCell } from './PickerGrid'
import { usePickerLayout } from './picker-layout'
import { StaffWheel } from './StaffWheel'

/** A time signature as the score writes it: its meter, and whether 4/4 or 2/2 prints as C or ¢. */
export interface TimeSignatureValue {
  readonly meter: Meter
  readonly symbol: boolean
}

/** The common meters, as a new song's tiles (R31-E, the owner's ruling). */
const TILES = ['2/2', '2/4', '3/4', '4/4', '6/8', '9/8', '12/8'] as const satisfies readonly Meter[]

/**
 * Flat's palette tiles (R32-C, help.flat.io's time signature, the owner's captures): 2/4, 3/4, 4/4,
 * common time, cut time, 6/8, each written as it prints.
 */
const PALETTE_TILES: readonly TimeSignatureValue[] = [
  { meter: '2/4', symbol: false },
  { meter: '3/4', symbol: false },
  { meter: '4/4', symbol: false },
  { meter: '4/4', symbol: true },
  { meter: '2/2', symbol: true },
  { meter: '6/8', symbol: false },
]

const sameValue = (a: TimeSignatureValue, b: TimeSignatureValue) =>
  a.meter === b.meter && (a.symbol && meterSymbol(a.meter) !== null) === b.symbol

/** A time signature drawn as it prints, its figures Bravura's, for a tile. */
export function TimeSignatureTile({ value }: { value: TimeSignatureValue }) {
  const { count, unit } = meterParts(value.meter)
  const symbol = value.symbol ? meterSymbol(value.meter) : null
  return (
    <svg aria-hidden viewBox="0 0 40 40" className="size-10" fill="currentColor">
      <TimeSignatureSign count={count} unit={unit} symbol={symbol} x={20} y={20} space={6} />
    </svg>
  )
}

/** A tile's name: the meter, or common or cut time by its name. */
function useTileName() {
  const { t } = useTranslation('music')
  return (value: TimeSignatureValue) =>
    value.symbol ? t(value.meter === '2/2' ? 'timeField.cut' : 'timeField.common') : value.meter
}

/**
 * Flat's Time signature in the score editor's palette (R32-C): one row of tiles, 2/4, 3/4, 4/4, C,
 * ¢ and 6/8, the one in force pressed, then `customize` (Flat's Customize), its own cell in the row
 * and on the web, a wide button under the tiles in the palette's grid. A meter the song cannot take
 * here (`barred`) has no tile (R32-B). Each tap is reported.
 */
export function TimeSignatureTiles({
  value,
  onChange,
  barred = () => false,
  customize,
}: {
  value: TimeSignatureValue
  onChange: (value: TimeSignatureValue) => void
  barred?: (meter: Meter) => boolean
  customize: ReactNode
}) {
  const { t } = useTranslation('music')
  const name = useTileName()
  const row = usePickerLayout() === 'row'
  const cells = PALETTE_TILES.filter((tile) => !barred(tile.meter)).map((tile) => (
    <PickerCell
      key={name(tile)}
      label={name(tile)}
      pressed={sameValue(value, tile)}
      onClick={() => onChange(tile)}
    >
      <TimeSignatureTile value={tile} />
    </PickerCell>
  ))
  if (row)
    return (
      <div
        role="group"
        aria-label={t('timeField.label')}
        className="flex shrink-0 items-center gap-0.5"
      >
        {cells}
        {customize}
      </div>
    )
  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-control border border-hairline bg-card">
        <div
          role="group"
          aria-label={t('timeField.label')}
          className="-me-px -mb-px grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] [&>button]:shadow-[inset_-1px_-1px_0_var(--color-hairline)]"
        >
          {cells}
        </div>
      </div>
      {customize}
    </div>
  )
}

/**
 * The time signature's wheels (R31-E, the owner's ruling; Flat's mobile Customize): the meter as it
 * prints on a staff, its figures wheels, any count of one to sixteen over a whole note to a
 * sixteenth; Pickup beside it, the beats before the first bar line (0 none), where the song's head
 * is changed (`pickup`).
 */
export function TimeSignatureWheels({
  value,
  onChange,
  pickup,
}: {
  value: TimeSignatureValue
  onChange: (value: TimeSignatureValue) => void
  /** The first bar's pickup in beats of the meter's unit, 0 for none, up to a beat short of a bar. */
  pickup?: { readonly beats: number; readonly onChange: (beats: number) => void } | undefined
}) {
  const { t } = useTranslation('music')
  const { count, unit } = meterParts(value.meter)
  const choose = (meter: Meter | undefined) =>
    meter ? onChange({ meter, symbol: value.symbol && meterSymbol(meter) !== null }) : undefined
  const most = count - 1
  return (
    <div className="flex justify-center gap-5">
      <StaffWheel
        label={t('timeField.current')}
        top={{
          label: t('timeField.beats'),
          values: METER_COUNTS,
          value: count,
          onChange: (next) => choose(meterOf(next, unit)),
        }}
        bottom={{
          label: t('timeField.beatUnit'),
          values: METER_UNITS,
          value: unit,
          onChange: (next) => choose(meterOf(count, next)),
        }}
      />
      {pickup ? (
        <StaffWheel
          label={t('timeField.pickup')}
          top={{
            label: t('timeField.pickupBeats'),
            values: Array.from({ length: most + 1 }, (_, at) => at),
            value: Math.min(pickup.beats, most),
            onChange: pickup.onChange,
            text: (beats) => (beats === 0 ? '–' : String(beats)),
          }}
          bottom={unit}
        />
      ) : null}
    </div>
  )
}

/**
 * A new song's time signature (R31-E, the owner's ruling): the common meters as tiles, then the
 * wheels (`TimeSignatureWheels`), then Write as common or cut time, shown for 4/4 and 2/2 alone
 * (R32-B). Each change is reported; a meter the song cannot take here (`barred`) has no tile.
 */
export function TimeSignatureField({
  value,
  onChange,
  barred = () => false,
  pickup,
}: {
  value: TimeSignatureValue
  onChange: (value: TimeSignatureValue) => void
  barred?: (meter: Meter) => boolean
  pickup?: { readonly beats: number; readonly onChange: (beats: number) => void } | undefined
}) {
  const { t } = useTranslation('music')
  const switchId = useId()
  const symbolOf = meterSymbol(value.meter)
  const choose = (meter: Meter) =>
    onChange({ meter, symbol: value.symbol && meterSymbol(meter) !== null })
  const cells = TILES.filter((meter) => !barred(meter)).map((meter) => (
    <PickerCell
      key={meter}
      label={meter}
      pressed={meter === value.meter}
      onClick={() => choose(meter)}
    >
      <TimeSignatureTile value={{ meter, symbol: false }} />
    </PickerCell>
  ))
  // Each tile draws its lines at its right and its foot, the last column's and row's under the
  // grid's own border: a short last row keeps its lines, with no grey band after it.
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-control border border-hairline bg-card">
        <div
          role="group"
          aria-label={t('timeField.label')}
          className="-me-px -mb-px grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] [&>button]:shadow-[inset_-1px_-1px_0_var(--color-hairline)]"
        >
          {cells}
        </div>
      </div>
      <TimeSignatureWheels value={value} onChange={onChange} pickup={pickup} />
      {symbolOf === null ? null : (
        <label htmlFor={switchId} className="flex min-h-11 items-center justify-between gap-3">
          <span className="text-base">{t('timeField.symbol')}</span>
          <Switch
            id={switchId}
            checked={value.symbol}
            onCheckedChange={(symbol) => onChange({ meter: value.meter, symbol })}
          />
        </label>
      )}
    </div>
  )
}
