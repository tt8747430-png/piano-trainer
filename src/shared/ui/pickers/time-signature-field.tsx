import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  METER_COUNTS,
  METER_UNITS,
  meterOf,
  meterParts,
  type Meter,
  type MeterUnit,
} from '@/shared/lib/music'
import { Segmented } from '../Segmented'
import { Stepper } from '../Stepper'
import { TimeSignatureSign } from '../smufl'
import { MenuPicker } from './MenuPicker'
import { PickerCell } from './PickerGrid'

/** A time signature as the score writes it: its meter, and whether 4/4 or 2/2 prints as C or ¢. */
export interface TimeSignatureValue {
  readonly meter: Meter
  readonly symbol: boolean
}

/** Flat's tiles, in its order: the common meters, C and ¢ among them. */
const TILES = [
  { meter: '2/4', symbol: false },
  { meter: '3/4', symbol: false },
  { meter: '4/4', symbol: false },
  { meter: '4/4', symbol: true },
  { meter: '2/2', symbol: true },
  { meter: '3/8', symbol: false },
  { meter: '6/8', symbol: false },
  { meter: '9/8', symbol: false },
  { meter: '12/8', symbol: false },
  { meter: '5/4', symbol: false },
  { meter: '7/8', symbol: false },
  { meter: '3/2', symbol: false },
  { meter: '2/2', symbol: false },
] as const satisfies readonly TimeSignatureValue[]

const sameValue = (a: TimeSignatureValue, b: TimeSignatureValue) =>
  a.meter === b.meter && a.symbol === b.symbol

/** Where a time signature written from the palette applies: from the bar chosen on, or the whole song. */
export type TimeApplyTo = 'from' | 'whole'

/** A time signature drawn as it prints, its figures Bravura's, for a tile or the Other's picture. */
export function TimeSignatureTile({ value }: { value: TimeSignatureValue }) {
  const { count, unit } = meterParts(value.meter)
  const symbol = value.symbol ? (value.meter === '4/4' ? 'common' : 'cut') : null
  return (
    <svg aria-hidden viewBox="0 0 40 40" className="size-10" fill="currentColor">
      <TimeSignatureSign count={count} unit={unit} symbol={symbol} x={20} y={20} space={6} />
    </svg>
  )
}

/** A control's name at its left, as a settings row has it. */
function Named({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden className="w-24 shrink-0 text-sm">
        {name}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

/**
 * The one time signature control (A34; the palette, New song's third step, the score's Settings and
 * the Metronome): Flat's tiles, engraved; Other, a Beats stepper over a Beat unit menu drawn as the
 * signature it makes; Pickup, a number of beats (0 none) where the song's head is changed; Apply to,
 * From this bar · Whole song, in the palette alone. A tap reports at once; `barred` greys a meter the
 * song cannot take here.
 */
export function TimeSignatureField({
  value,
  onChange,
  barred = () => false,
  pickup,
  applyTo,
}: {
  value: TimeSignatureValue
  onChange: (value: TimeSignatureValue) => void
  barred?: (meter: Meter) => boolean
  /** The first bar's pickup in beats of the meter's unit, 0 for none, up to `most`. */
  pickup?:
    | { readonly beats: number; readonly most: number; readonly onChange: (beats: number) => void }
    | undefined
  applyTo?:
    { readonly value: TimeApplyTo; readonly onChange: (value: TimeApplyTo) => void } | undefined
}) {
  const { t } = useTranslation('music')
  const { count, unit } = meterParts(value.meter)
  const name = (tile: TimeSignatureValue) =>
    tile.symbol ? t(tile.meter === '4/4' ? 'timeField.common' : 'timeField.cut') : tile.meter
  const tiled = TILES.some((tile) => sameValue(tile, value))
  const choose = (meter: Meter | undefined) =>
    meter && !barred(meter) ? onChange({ meter, symbol: false }) : undefined
  return (
    <div className="flex flex-col gap-3">
      {applyTo ? (
        <Segmented
          label={t('timeField.applyTo')}
          value={applyTo.value}
          options={[
            { value: 'from', label: t('timeField.fromBar') },
            { value: 'whole', label: t('timeField.wholeSong') },
          ]}
          onChange={applyTo.onChange}
        />
      ) : null}
      <div
        role="group"
        aria-label={t('timeField.label')}
        className="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-px overflow-hidden rounded-control border border-hairline bg-hairline"
      >
        {TILES.map((tile) => (
          <PickerCell
            key={name(tile)}
            label={name(tile)}
            pressed={sameValue(tile, value)}
            disabled={barred(tile.meter)}
            onClick={() => onChange(tile)}
          >
            <TimeSignatureTile value={tile} />
          </PickerCell>
        ))}
      </div>
      <div
        role="group"
        aria-label={t('timeField.other')}
        aria-current={tiled ? undefined : 'true'}
        className="flex items-center gap-3 rounded-control border border-hairline bg-card p-2 aria-[current=true]:border-chosen"
      >
        <span className="grid size-12 shrink-0 place-items-center text-foreground/80">
          <TimeSignatureTile value={{ meter: value.meter, symbol: false }} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="text-sm font-semibold text-muted-foreground">
            {t('timeField.other')}
          </span>
          <Named name={t('timeField.beats')}>
            <Stepper
              label={t('timeField.beats')}
              value={count}
              min={METER_COUNTS[0] ?? 1}
              max={METER_COUNTS.at(-1) ?? 12}
              typed
              decrease={t('timeField.fewerBeats')}
              increase={t('timeField.moreBeats')}
              onChange={(next) => choose(meterOf(next, unit))}
            />
          </Named>
          <MenuPicker
            label={t('timeField.beatUnit')}
            value={unit}
            options={METER_UNITS.map((each: MeterUnit) => ({
              value: each,
              label: String(each),
              ...(barred(`${count}/${each}`) ? { reason: t('timeField.barred') } : {}),
            }))}
            onChange={(next) => choose(meterOf(count, next))}
          />
        </div>
      </div>
      {pickup ? (
        <Named name={t('timeField.pickup')}>
          <Stepper
            label={t('timeField.pickup')}
            value={pickup.beats}
            min={0}
            max={pickup.most}
            typed
            format={(beats) => (beats === 0 ? t('timeField.noPickup') : String(beats))}
            decrease={t('timeField.shorterPickup')}
            increase={t('timeField.longerPickup')}
            onChange={pickup.onChange}
          />
        </Named>
      ) : null}
    </div>
  )
}
