/** The domain's unit of time: 12 per beat, so 16ths (3) and triplet 8ths (4) are whole. */
export type Tick = number
export const TICKS_PER_BEAT = 12

export const METERS = ['2/4', '3/4', '4/4', '6/8', '12/8'] as const
export type Meter = (typeof METERS)[number]

/** Whether stored or typed text names one of the meters. */
export const isMeter = (value: unknown): value is Meter => METERS.some((meter) => meter === value)

/** Compound meters count dotted quarters: 6/8 has two beats, 12/8 four. */
const BEATS_PER_BAR: Readonly<Record<Meter, number>> = {
  '2/4': 2,
  '3/4': 3,
  '4/4': 4,
  '6/8': 2,
  '12/8': 4,
}
export const beatsPerBar = (meter: Meter): number => BEATS_PER_BAR[meter]

/**
 * A pickup: a first bar shorter than the meter's, which is the end of a bar (its first note an
 * upbeat). The beats of the meter's bar it leaves out before it; none for any other bar.
 */
export function beatsBefore(
  bars: readonly { readonly beats: number }[],
  index: number,
  meter: Meter,
): number {
  const bar = bars[index]
  const full = beatsPerBar(meter)
  return index === 0 && bar !== undefined && bar.beats < full ? full - bar.beats : 0
}

/** A meter in eighths whose beat is a dotted quarter. */
export const isCompound = (meter: Meter): boolean => meter.endsWith('/8')

export interface TimeSignature {
  readonly count: number
  readonly unit: 4 | 8 | 16
}

const isWhole = (n: number) => Math.abs(n - Math.round(n)) < 1e-9

/** A bar of `beats` beats as a time signature writes it: quarters in x/4, eighths in x/8 or for half a beat. */
export function timeSignature(beats: number, meter: Meter): TimeSignature {
  if (!isCompound(meter) && Number.isInteger(beats)) return { count: beats, unit: 4 }
  const eighths = beats * (isCompound(meter) ? 3 : 2)
  if (isWhole(eighths)) return { count: Math.round(eighths), unit: 8 }
  if (isWhole(eighths * 2)) return { count: Math.round(eighths * 2), unit: 16 }
  throw new RangeError(`No time signature writes a bar of ${beats} beats in ${meter}`)
}

export const timeSignatureText = ({ count, unit }: TimeSignature): string => `${count}/${unit}`
