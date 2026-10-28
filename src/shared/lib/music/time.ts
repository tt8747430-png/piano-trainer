/**
 * The domain's unit of time: 5040 per beat (2⁴·3²·5·7), so every value to the 64th and every tuplet
 * of two to nine of them is whole (ADR 0097).
 */
export type Tick = number
export const TICKS_PER_BEAT = 5040

/** Beats in ticks, to the nearest tick (a third of a beat written `.3333` is 1680). */
export const beatsToTicks = (beats: number): Tick => Math.round(beats * TICKS_PER_BEAT)

/** The notes a time signature's lower figure may count (ADR 0114): a half, a quarter, an eighth. */
export const METER_UNITS = [2, 4, 8] as const
export type MeterUnit = (typeof METER_UNITS)[number]
/** How many of them a bar may have: one to twelve. */
export const METER_COUNTS: readonly number[] = Array.from({ length: 12 }, (_, at) => at + 1)

/** A time signature: a count of one to twelve over a half, a quarter or an eighth (ADR 0114). */
export type Meter = `${number}/${MeterUnit}`

/** Every meter, by its lower figure, then its count: 1/2 … 12/2, 1/4 … 12/4, 1/8 … 12/8. */
export const METERS: readonly Meter[] = METER_UNITS.flatMap((unit) =>
  METER_COUNTS.map((count): Meter => `${count}/${unit}`),
)

/** The meters a learner meets most, offered first where a list is short (a new song's). */
export const COMMON_METERS: readonly Meter[] = [
  '4/4',
  '3/4',
  '2/4',
  '2/2',
  '6/8',
  '3/8',
  '9/8',
  '12/8',
  '3/2',
  '5/4',
  '6/4',
  '7/4',
]

/** Whether stored or typed text names one of the meters. */
export const isMeter = (value: unknown): value is Meter => {
  if (typeof value !== 'string') return false
  const match = /^([1-9]\d?)\/([248])$/.exec(value)
  return match !== null && Number(match[1]) <= 12
}

/** A meter's two figures. */
export function meterParts(meter: Meter): { readonly count: number; readonly unit: MeterUnit } {
  const [count, unit] = meter.split('/').map(Number)
  return { count: count ?? 4, unit: unit === 2 || unit === 8 ? unit : 4 }
}

/** The meter of two figures, where they make one. */
export const meterOf = (count: number, unit: number): Meter | undefined => {
  const text = `${count}/${unit}`
  return isMeter(text) ? text : undefined
}

/**
 * A meter in eighths whose beat is a dotted quarter: 3/8, 6/8, 9/8 and 12/8. Its beat (24 ticks) is
 * a dotted quarter, where every other meter's is a quarter: the kind of a song's ticks.
 */
export const isCompound = (meter: Meter): boolean => {
  const { count, unit } = meterParts(meter)
  return unit === 8 && count % 3 === 0
}

/**
 * A bar's length in beats of its kind (24 ticks each): a quarter's in simple time, so 2/2 has four
 * and 7/8 three and a half; a dotted quarter's in compound, so 6/8 has two and 12/8 four.
 */
export function beatsPerBar(meter: Meter): number {
  const { count, unit } = meterParts(meter)
  if (unit === 2) return count * 2
  if (unit === 4) return count
  return isCompound(meter) ? count / 3 : count / 2
}

/** A bar's length in ticks. */
export const barTicks = (meter: Meter): Tick => beatsToTicks(beatsPerBar(meter))

/** Ticks in an eighth: half a beat in simple time, a third in compound. */
export const eighthTicks = (meter: Meter): Tick =>
  isCompound(meter) ? TICKS_PER_BEAT / 3 : TICKS_PER_BEAT / 2

/** A bar of x/8 in simple time, its eighths in twos and threes, as LilyPond's `beatStructure`. */
const EIGHTHS: Readonly<Record<number, readonly number[]>> = {
  1: [1],
  2: [2],
  4: [2, 2],
  5: [3, 2],
  7: [2, 2, 3],
  8: [3, 3, 2],
  10: [3, 3, 2, 2],
  11: [3, 3, 3, 2],
}

/**
 * The beats a bar is counted in, each its length in ticks (ADR 0114): what the click sounds on and
 * a count-in counts. A half each in x/2, a quarter in x/4, a dotted quarter in 6/8; a bar of x/8 in
 * simple time its eighths in twos and threes (7/8 as 2+2+3).
 */
export function meterBeats(meter: Meter): Tick[] {
  const { count, unit } = meterParts(meter)
  if (unit === 2) return Array.from({ length: count }, () => 2 * TICKS_PER_BEAT)
  if (unit === 4) return Array.from({ length: count }, () => TICKS_PER_BEAT)
  if (isCompound(meter)) return Array.from({ length: count / 3 }, () => TICKS_PER_BEAT)
  return (EIGHTHS[count] ?? [count]).map((eighths) => eighths * eighthTicks(meter))
}

/** Five, six, seven … beats a bar felt in groups: 5/4 as 3+2, 6/4 as 3+3, 7/4 as 4+3. */
const GROUPS: Readonly<Record<number, readonly number[]>> = {
  5: [3, 2],
  6: [3, 3],
  7: [4, 3],
  8: [4, 4],
  9: [3, 3, 3],
  10: [3, 3, 2, 2],
  11: [3, 3, 3, 2],
  12: [3, 3, 3, 3],
}

/**
 * How a bar's counted beats (`meterBeats`) fall into groups (ADR 0114): one group in a bar of up to
 * four, else 5/4 as 3+2, 6/4 as 3+3, 7/4 as 4+3 and so on; each group's first beat accented by the
 * click, and a pattern played once in each.
 */
export function meterGroups(meter: Meter): number[] {
  const beats = meterBeats(meter).length
  return [...(beats > 4 ? (GROUPS[beats] ?? [beats]) : [beats])]
}

/** A group's length in ticks, each in turn: a bar of 5/4 is 72 and 48. */
export function groupTicks(meter: Meter): Tick[] {
  const beats = meterBeats(meter)
  let at = 0
  return meterGroups(meter).map((size) => {
    const ticks = beats.slice(at, at + size).reduce((sum, each) => sum + each, 0)
    at += size
    return ticks
  })
}

/**
 * The counted beats' starts in a bar, in ticks from its start, each saying whether it is accented:
 * the bar's first, and each group's first after it.
 */
export function beatStarts(meter: Meter): { readonly tick: Tick; readonly accent: boolean }[] {
  const accented = new Set<number>()
  meterGroups(meter).reduce((at, size) => {
    accented.add(at)
    return at + size
  }, 0)
  let tick = 0
  return meterBeats(meter).map((length, at) => {
    const start = { tick, accent: accented.has(at) }
    tick += length
    return start
  })
}

/**
 * How a bar's eighths fall into its counted beats (ADR 0115, 0114, as notation apps print it under
 * a time signature): two to a quarter's beat, three to a dotted quarter's, four to a half's; 7/8 is
 * 2, 2, 3.
 */
export const beatGrouping = (meter: Meter): number[] =>
  meterBeats(meter).map((ticks) => ticks / eighthTicks(meter))

/**
 * A pickup: a first bar shorter than its meter's (its own, ADR 0097, else `meter`), which is the end
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

/** The notes a tempo mark may count (ADR 0114): a value, a dot after it where dotted. */
export const TEMPO_UNITS = ['2', '2.', '4', '4.', '8', '8.', '16'] as const
export type TempoUnit = (typeof TEMPO_UNITS)[number]
export const isTempoUnit = (value: unknown): value is TempoUnit =>
  TEMPO_UNITS.some((unit) => unit === value)

/**
 * The beat a song's ticks count (`TICKS_PER_BEAT`), its tempo's: a quarter in simple time, a dotted
 * quarter in compound (LilyPond's `\tempo 4. = 58`). A tempo mark counts it unless it says another.
 */
export const beatUnit = (meter: Meter): TempoUnit => (isCompound(meter) ? '4.' : '4')

/**
 * The notes a tempo mark is offered in, the meter's beat first (ADR 0114, as notation apps offer
 * them): a half, a dotted half and a quarter in x/2; a quarter, a dotted quarter, an eighth, a
 * dotted eighth and a sixteenth in x/4 and in x/8 of simple time; in compound, the dotted quarter
 * first, then the eighth, the quarter, the dotted eighth and the dotted half.
 */
export function tempoUnitsFor(meter: Meter): TempoUnit[] {
  if (isCompound(meter)) return ['4.', '8', '4', '8.', '2.']
  if (meterParts(meter).unit === 2) return ['2', '2.', '4']
  if (meterParts(meter).unit === 8) return ['8', '8.', '4', '4.', '16']
  return ['4', '4.', '8', '8.', '16']
}

/** A tempo unit's length in a meter's ticks: a quarter 24 in simple time, 16 in compound. */
export function unitTicks(unit: TempoUnit, meter: Meter): Tick {
  const value = Number.parseInt(unit, 10)
  const plain = (eighthTicks(meter) * 8) / value
  return unit.endsWith('.') ? (plain * 3) / 2 : plain
}

/**
 * A tempo's mark in a unit: how many of it a minute, to the nearest whole, of a tempo in the song's
 * beats (`tempo`, beats a minute); 120 in 4/4 is ♪ = 240, ♩. = 80.
 */
export const tempoMark = (tempo: number, unit: TempoUnit, meter: Meter): number =>
  Math.round((tempo * TICKS_PER_BEAT) / unitTicks(unit, meter))

/** A tempo in the song's beats a minute of a mark in a unit: ♪ = 93 in 4/4 is 46.5. */
export const tempoOfMark = (mark: number, unit: TempoUnit, meter: Meter): number =>
  (mark * unitTicks(unit, meter)) / TICKS_PER_BEAT

/** A tempo unit as music text: 𝅗𝅥, ♩, ♪ or 𝅘𝅥𝅯 (SMuFL's text notes), a dot after it where dotted. */
export function unitNote(unit: TempoUnit): string {
  const note =
    { '2': '\u{1D15E}', '4': '\u{1D15F}', '8': '\u{1D160}', '16': '\u{1D161}' }[
      unit.replace('.', '') as '2' | '4' | '8' | '16'
    ] ?? '\u{1D15F}'
  return unit.endsWith('.') ? `${note}\u{1D16D}` : note
}

/**
 * The note a tempo mark prints (LilyPond's `\tempo 4. = 58`): its own unit where it has one, else the
 * song's beat, a quarter in simple time and a dotted quarter in compound.
 */
export const tempoNote = (meter: Meter, unit?: TempoUnit): string =>
  unitNote(unit ?? beatUnit(meter))

export interface TimeSignature {
  readonly count: number
  readonly unit: 2 | 4 | 8 | 16
}

const isWhole = (n: number) => Math.abs(n - Math.round(n)) < 1e-9

/**
 * A bar of `beats` beats as a time signature writes it: a whole bar its meter's own; a shorter one
 * in quarters in x/2 and x/4, in eighths in x/8 or for half a beat, in sixteenths for a quarter of one.
 */
export function timeSignature(beats: number, meter: Meter): TimeSignature {
  if (beatsToTicks(beats) === barTicks(meter)) return meterParts(meter)
  const eighthsFirst = meterParts(meter).unit === 8
  if (!eighthsFirst && Number.isInteger(beats)) return { count: beats, unit: 4 }
  const eighths = (beats * TICKS_PER_BEAT) / eighthTicks(meter)
  if (isWhole(eighths)) return { count: Math.round(eighths), unit: 8 }
  if (isWhole(eighths * 2)) return { count: Math.round(eighths * 2), unit: 16 }
  throw new RangeError(`No time signature writes a bar of ${beats} beats in ${meter}`)
}

export const timeSignatureText = ({ count, unit }: TimeSignature): string => `${count}/${unit}`

/** The sign a meter may print in place of its figures: common time, C, or cut time, ¢. */
export type MeterSymbol = 'common' | 'cut'

/** The sign a meter may print for its figures (ADR 0114): C for 4/4 and ¢ for 2/2; none for another. */
export function meterSymbol(meter: Meter): MeterSymbol | null {
  if (meter === '4/4') return 'common'
  if (meter === '2/2') return 'cut'
  return null
}
