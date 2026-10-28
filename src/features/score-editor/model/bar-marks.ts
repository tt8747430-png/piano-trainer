import {
  JUMPS,
  withoutBarMarks,
  type BarMarks,
  type Barline,
  type Ending,
  type Jump,
} from '@/shared/lib/music'
import { newLine, type BarRange } from './bars'
import { barsOf } from './timeline'
import { withEveryStaff, type Draft, type DraftBar, type DraftNote } from './draft'
import { withBar } from './notes'

/** What the palette's Barlines & repeats puts on the bars chosen (or the caret's): the barlines and endings. */
export const BARLINE_CHOICES = [
  'repeatStart',
  'repeatEnd',
  'repeatTimes',
  'ending1',
  'ending2',
  'ending3',
  'ending4',
  'double',
  'final',
  'plain',
] as const
/** The signs and jumps beside them (ADR 0097). */
export const JUMP_CHOICES = ['segno', 'coda', 'toCoda', 'fine', ...JUMPS] as const
/** The page break before a bar (ADR 0097, Flat's Measure): its line starts a new page. */
export const LAYOUT_CHOICES = ['pageBreak'] as const
/** Flat's Measure's bar repeats, of one bar and two, and its multi-bar rest (ADR 0097). */
export const REPEAT_BAR_CHOICES = ['barRepeat1', 'barRepeat2', 'multiRest'] as const
export const BAR_MARK_CHOICES = [
  ...BARLINE_CHOICES,
  ...JUMP_CHOICES,
  ...LAYOUT_CHOICES,
  ...REPEAT_BAR_CHOICES,
] as const
export type BarMarkChoice = (typeof BAR_MARK_CHOICES)[number]

const BARLINE_OF: Partial<Record<BarMarkChoice, Barline>> = {
  repeatEnd: 'repeat',
  double: 'double',
  final: 'final',
}
const ENDING_OF: Partial<Record<BarMarkChoice, Ending>> = {
  ending1: 1,
  ending2: 2,
  ending3: 3,
  ending4: 4,
}
/** The marks that stand at a bar's start, and those at its end that are there or not. */
const AT_START = ['repeatStart', 'segno', 'coda', 'pageBreak'] as const
const AT_END = ['fine', 'toCoda'] as const

const isOne = <T extends string>(all: readonly T[], value: string): value is T =>
  (all as readonly string[]).includes(value)

/** A bar with one mark set to `value`, or without it where `value` is undefined. */
function withMark<K extends keyof BarMarks>(bar: DraftBar, key: K, value: BarMarks[K]): DraftBar {
  const { [key]: _was, ...rest } = bar
  return (value === undefined ? rest : { ...rest, [key]: value }) as DraftBar
}

/** A bar with `value` at `key`, or without it where it is there already. */
const toggled = <K extends keyof BarMarks>(bar: DraftBar, key: K, value: BarMarks[K]) =>
  withMark(bar, key, bar[key] === value ? undefined : value)

/**
 * Barlines on the bars of `range`: a repeat, the sign or the coda's sign starting at its first bar;
 * a repeat's end, a double or the final barline, Fine, To Coda or a jump at its last; an ending over
 * them all; Plain taking every mark off. A mark a bar already has is taken off it.
 */
export function markBars(draft: Draft, { from, to }: BarRange, choice: BarMarkChoice): Draft {
  if (choice === 'barRepeat1' || choice === 'barRepeat2')
    return barRepeat(draft, { from, to }, choice === 'barRepeat1' ? 1 : 2)
  if (choice === 'multiRest') return multiRest(draft, { from, to })
  const barline = BARLINE_OF[choice]
  const ending = ENDING_OF[choice]
  // A page break starts a line too: its bar the line's first (ADR 0097).
  if (choice === 'pageBreak') {
    const marked = withBar(draft, from, (bar) => toggled(bar, choice, true))
    return marked.sections === draft.sections || !barMarkOn(marked, from, 'pageBreak')
      ? marked
      : newLine(marked, from)
  }
  // Flat's repeat ×N: the passage played once more each time, up to nine, then twice again.
  if (choice === 'repeatTimes')
    return withBar(draft, to, (bar) => {
      const times = bar.barline === 'repeat' ? (bar.times ?? 2) + 1 : 3
      return withMark({ ...bar, barline: 'repeat' }, 'times', times > 9 ? undefined : times)
    })
  if (isOne(AT_START, choice)) return withBar(draft, from, (bar) => toggled(bar, choice, true))
  if (isOne(AT_END, choice)) return withBar(draft, to, (bar) => toggled(bar, choice, true))
  if (isOne<Jump>(JUMPS, choice)) return withBar(draft, to, (bar) => toggled(bar, 'jump', choice))
  if (barline) return withBar(draft, to, (bar) => toggled(bar, 'barline', barline))
  let marked = draft
  for (let index = from; index <= to; index += 1)
    marked = withBar(marked, index, (bar) =>
      choice === 'plain' ? (withoutBarMarks(bar) as DraftBar) : toggled(bar, 'ending', ending),
    )
  return marked
}

/** Whether the bar at `index` carries a mark. */
function barMarkOn(draft: Draft, index: number, key: keyof BarMarks): boolean {
  return barsOf(draft)[index]?.bar[key] !== undefined
}

/** A note `by` ticks later, ending by `end`. */
const movedNote = (n: DraftNote, by: number, end: number): DraftNote => ({
  ...n,
  startTick: n.startTick + by,
  durationTicks: Math.min(n.durationTicks, end - n.startTick - by),
})

/**
 * Bar `to` written as bar `from` is, on every staff and in the chord row, the notes timed from its
 * start; the draft itself where they are not of one length.
 */
function copiedBar(draft: Draft, from: number, to: number): Draft {
  const bars = barsOf(draft)
  const source = bars[from]
  const target = bars[to]
  if (!source || !target || source.bar.ticks !== target.bar.ticks) return draft
  const by = target.start - source.start
  const end = target.start + target.bar.ticks
  const inBar = (n: DraftNote, { start, bar }: typeof source) =>
    n.startTick >= start && n.startTick < start + bar.ticks
  const copied = withEveryStaff(draft, (notes) =>
    [
      ...notes.filter((n) => !inBar(n, target)),
      ...notes
        .filter((n) => inBar(n, source))
        .map(({ lyrics: _lyrics, ...n }) => movedNote(n, by, end)),
    ].sort((a, b) => a.startTick - b.startTick || a.midi - b.midi),
  )
  return withBar(copied, to, (bar) => ({ ...bar, chords: source.bar.chords }))
}

/**
 * Flat's bar repeat: each bar chosen written as the bar before (`1`), or the pairs from the first
 * bar chosen as the two bars before (`2`), marked so (ADR 0097); the mark taken off where the first
 * bar has it, the notes left. The draft itself where there are no bars before to repeat.
 */
function barRepeat(draft: Draft, { from, to }: BarRange, length: 1 | 2): Draft {
  const bars = barsOf(draft)
  if (bars[from]?.bar.barRepeat === length) {
    let plain = draft
    for (let index = from; index <= to; index += 1)
      plain = withBar(plain, index, (bar) => withMark(bar, 'barRepeat', undefined))
    return plain
  }
  let repeated = draft
  for (let index = from; index <= to; index += length) {
    if (index - length < 0 || index + length - 1 >= bars.length) continue
    for (let part = 0; part < length; part += 1)
      repeated = copiedBar(repeated, index - length + part, index + part)
    repeated = withBar(repeated, index, (bar) => withMark(bar, 'barRepeat', length))
  }
  return repeated
}

/**
 * Flat's multi-bar rest: the bars chosen (a lone bar with the next) emptied on every staff and of
 * their chords, marked at the first with their count, drawn as one (ADR 0097); the mark taken off
 * where the first bar has it.
 */
function multiRest(draft: Draft, { from, to }: BarRange): Draft {
  const bars = barsOf(draft)
  if (bars[from]?.bar.multiRest !== undefined)
    return withBar(draft, from, (bar) => withMark(bar, 'multiRest', undefined))
  const last = Math.max(to, from + 1)
  const first = bars[from]
  const after = bars[last]
  if (!first || !after) return draft
  const end = after.start + after.bar.ticks
  const emptied = withEveryStaff(draft, (notes) =>
    notes.filter((n) => n.startTick < first.start || n.startTick >= end),
  )
  let rested = emptied
  for (let index = from; index <= last; index += 1)
    rested = withBar(rested, index, (bar) => ({ ...bar, chords: [] }))
  return withBar(rested, from, (bar) => withMark(bar, 'multiRest', last - from + 1))
}
