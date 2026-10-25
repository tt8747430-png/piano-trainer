/** The domain's unit of time: 24 per beat, so 32nds (3), 16ths (6) and triplet 8ths (8) are whole. */
export type Tick = number
export const TICKS_PER_BEAT = 24

/** Beats in ticks, to the nearest tick (a third of a beat written `.3333` is 8). */
export const beatsToTicks = (beats: number): Tick => Math.round(beats * TICKS_PER_BEAT)

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
 * A pickup: a first bar shorter than its meter's (its own, ADR 0095, else `meter`), which is the end
 * of a bar (its first note an upbeat). The beats of the meter's bar it leaves out before it; none for
 * any other bar.
 */
export function beatsBefore(
  bars: readonly { readonly beats: number; readonly meter?: Meter | undefined }[],
  index: number,
  meter: Meter,
): number {
  const bar = bars[index]
  const full = beatsPerBar(bar?.meter ?? meter)
  // In ticks: a bar's beats summed as fractions is a pickup only when it is a tick short.
  return index === 0 && bar !== undefined && beatsToTicks(bar.beats) < beatsToTicks(full)
    ? full - bar.beats
    : 0
}

/** A meter in eighths whose beat is a dotted quarter. */
export const isCompound = (meter: Meter): boolean => meter.endsWith('/8')

/**
 * The note a tempo counts, as a metronome mark prints it (LilyPond's `\tempo 4. = 58`): the beat, a
 * quarter in x/4 and a dotted quarter in x/8.
 */
export const tempoNote = (meter: Meter): string =>
  isCompound(meter) ? '\u{1D15F}\u{1D16D}' : '\u{1D15F}'

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
