import { useId } from 'react'
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

/** The common meters, as tiles (R31-E, the owner's ruling). */
const TILES = ['2/2', '2/4', '3/4', '4/4', '6/8', '9/8', '12/8'] as const satisfies readonly Meter[]

/** Where a time signature written from the palette applies: from the bar chosen on, or the whole song. */
export type TimeApplyTo = 'from' | 'whole'

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

/**
 * The one time signature control (R31-E, the owner's ruling; the palette's Time, the score's
 * Settings and New song): the common meters as tiles; Current, its figures as wheels on a staff,
 * any count of one to sixteen over a whole note to a sixteenth; Pickup beside it, the beats before
 * the first bar line (0 none), where the song's head is changed (`pickup`); and Write as common or
 * cut time, for 4/4 and 2/2 alone. In a row (the folded palette) its tiles alone. Each change is
 * reported; `barred` greys a meter the song cannot take here.
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
  /** The first bar's pickup in beats of the meter's unit, 0 for none, up to a beat short of a bar. */
  pickup?: { readonly beats: number; readonly onChange: (beats: number) => void } | undefined
}) {
  const { t } = useTranslation('music')
  const switchId = useId()
  const { count, unit } = meterParts(value.meter)
  const symbolOf = meterSymbol(value.meter)
  const choose = (meter: Meter | undefined) =>
    meter ? onChange({ meter, symbol: value.symbol && meterSymbol(meter) !== null }) : undefined
  const tiles = (
    <div
      role="group"
      aria-label={t('timeField.label')}
      className={
        usePickerLayout() === 'row'
          ? 'flex shrink-0 items-center gap-0.5'
          : 'grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-px overflow-hidden rounded-control border border-hairline bg-hairline'
      }
    >
      {TILES.map((meter) => (
        <PickerCell
          key={meter}
          label={meter}
          pressed={meter === value.meter}
          disabled={barred(meter)}
          onClick={() => choose(meter)}
        >
          <TimeSignatureTile value={{ meter, symbol: false }} />
        </PickerCell>
      ))}
    </div>
  )
  if (usePickerLayout() === 'row') return tiles
  const most = count - 1
  return (
    <div className="flex flex-col gap-4">
      {tiles}
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
      <label
        htmlFor={switchId}
        title={symbolOf ? undefined : t('timeField.symbolOnly')}
        className="flex min-h-11 items-center justify-between gap-3 has-disabled:opacity-50"
      >
        <span className="text-base">{t('timeField.symbol')}</span>
        <Switch
          id={switchId}
          checked={value.symbol && symbolOf !== null}
          disabled={symbolOf === null}
          onCheckedChange={(symbol) => onChange({ meter: value.meter, symbol })}
        />
      </label>
    </div>
  )
}
