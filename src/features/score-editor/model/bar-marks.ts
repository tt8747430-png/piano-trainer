import type { Barline, Ending } from '@/shared/lib/music'
import type { BarRange } from './bars'
import type { Draft, DraftBar } from './draft'
import { withBar } from './notes'

/** What the + menu's Barlines put on the bars chosen (or the caret's). */
export const BAR_MARK_CHOICES = [
  'repeatStart',
  'repeatEnd',
  'ending1',
  'ending2',
  'double',
  'final',
  'plain',
] as const
export type BarMarkChoice = (typeof BAR_MARK_CHOICES)[number]

const BARLINE_OF: Partial<Record<BarMarkChoice, Barline>> = {
  repeatEnd: 'repeat',
  double: 'double',
  final: 'final',
}
const ENDING_OF: Partial<Record<BarMarkChoice, Ending>> = { ending1: 1, ending2: 2 }

/** A bar with its barline, or with none. */
const withBarline = ({ barline: _was, ...bar }: DraftBar, barline: Barline | null): DraftBar =>
  barline === null ? bar : { ...bar, barline }

/**
 * Barlines on the bars of `range`: a repeat starting at its first bar; a repeat's end, a double or
 * the final barline at its last; an ending over them all; Plain taking every mark off. A mark a bar
 * already has is taken off it.
 */
export function markBars(draft: Draft, { from, to }: BarRange, choice: BarMarkChoice): Draft {
  const barline = BARLINE_OF[choice]
  const ending = ENDING_OF[choice]
  if (choice === 'repeatStart')
    return withBar(draft, from, ({ repeatStart, ...bar }) =>
      repeatStart ? bar : { ...bar, repeatStart: true },
    )
  if (barline)
    return withBar(draft, to, (bar) => withBarline(bar, bar.barline === barline ? null : barline))
  let marked = draft
  for (let index = from; index <= to; index += 1) {
    marked = withBar(marked, index, (bar) => {
      if (choice === 'plain') {
        const { repeatStart: _start, barline: _end, ending: _ending, ...plain } = bar
        return plain
      }
      const { ending: was, ...rest } = bar
      return ending === undefined || was === ending ? rest : { ...rest, ending }
    })
  }
  return marked
}
