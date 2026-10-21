import {
  JUMPS,
  withoutBarMarks,
  type BarMarks,
  type Barline,
  type Ending,
  type Jump,
} from '@/shared/lib/music'
import type { BarRange } from './bars'
import type { Draft, DraftBar } from './draft'
import { withBar } from './notes'

/** What the + menu's Barlines put on the bars chosen (or the caret's): the barlines and endings. */
export const BARLINE_CHOICES = [
  'repeatStart',
  'repeatEnd',
  'ending1',
  'ending2',
  'double',
  'final',
  'plain',
] as const
/** The signs and jumps beside them (ADR 0068). */
export const JUMP_CHOICES = ['segno', 'coda', 'toCoda', 'fine', ...JUMPS] as const
export const BAR_MARK_CHOICES = [...BARLINE_CHOICES, ...JUMP_CHOICES] as const
export type BarMarkChoice = (typeof BAR_MARK_CHOICES)[number]

const BARLINE_OF: Partial<Record<BarMarkChoice, Barline>> = {
  repeatEnd: 'repeat',
  double: 'double',
  final: 'final',
}
const ENDING_OF: Partial<Record<BarMarkChoice, Ending>> = { ending1: 1, ending2: 2 }
/** The marks that stand at a bar's start, and those at its end that are there or not. */
const AT_START = ['repeatStart', 'segno', 'coda'] as const
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
  const barline = BARLINE_OF[choice]
  const ending = ENDING_OF[choice]
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
