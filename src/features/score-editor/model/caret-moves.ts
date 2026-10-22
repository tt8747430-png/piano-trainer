import { TICKS_PER_BEAT, type Tick } from '@/shared/lib/music'
import { ticksOf } from '@/shared/lib/notation'
import { caretPlaces, nextCaret, snapToChord } from './caret'
import type { Draft, Layer } from './draft'
import type { CaretMove, EditorState, Selection } from './state'
import { barAt, barsOf, totalTicks } from './timeline'

/** The caret kept on the piece, and on the chords' places there. */
export function placed(draft: Draft, layer: Layer, caret: Tick): Tick {
  const kept = Math.max(0, Math.min(caret, totalTicks(draft)))
  return layer === 'chords' ? snapToChord(draft, kept) : kept
}

/** Where bar `index` starts; the last bar's start past the end. */
export const startOf = (draft: Draft, index: number): Tick => {
  const bars = barsOf(draft)
  return (bars[Math.min(index, bars.length - 1)] ?? bars[0])?.start ?? 0
}

/** The length of the next note: the value chosen in the meter. */
export const stepOf = ({ value, draft }: EditorState): Tick => ticksOf(value, draft.meter)

/** How wide the caret is drawn: a beat in the chords, else the next note's length. */
export const caretTicks = (state: EditorState): Tick =>
  state.layer === 'chords' ? TICKS_PER_BEAT : stepOf(state)

/** Every place the caret may stand in a layer: where a click on the sheet lands. */
export const placesIn = (state: EditorState, layer: Layer): Tick[] =>
  caretPlaces(state.draft, layer, stepOf(state))

/** The bars chosen once the caret moves to `next` with Shift, in any row (a range of notes or chords), else none. */
function selectionTo(state: EditorState, next: Tick, extend: boolean): Selection | null {
  if (!extend) return null
  return {
    anchor: state.selection?.anchor ?? barAt(state.draft, state.caret).index,
    head: barAt(state.draft, next).index,
  }
}

/** The caret put at a tick in a layer (a click on the sheet), Shift choosing bars. */
export function placeCaret(
  state: EditorState,
  tick: Tick,
  layer: Layer,
  extend: boolean,
): EditorState {
  const next = placed(state.draft, layer, tick)
  const selection = selectionTo(state, next, extend)
  return { ...state, layer, caret: next, selection, struck: null }
}

/**
 * The start of the next chart line (none past the last: the caret stays), or back: the start
 * of the caret's line, else of the line before.
 */
function lineStart(bars: ReturnType<typeof barsOf>, caret: Tick, direction: -1 | 1): Tick {
  const starts = bars
    .filter((bar, i) => {
      const before = bars[i - 1]
      return !before || before.section !== bar.section || before.line !== bar.line
    })
    .map((bar) => bar.start)
  if (direction > 0) return starts.find((start) => start > caret) ?? caret
  return starts.findLast((start) => start < caret) ?? 0
}

/** The caret moved a step, a bar, a line or to an end, Shift choosing bars. */
export function moveCaret(
  state: EditorState,
  by: CaretMove,
  direction: -1 | 1,
  extend: boolean,
): EditorState {
  const { draft, layer, caret } = state
  const bars = barsOf(draft)
  let target: Tick
  if (by === 'step') {
    target = nextCaret(draft, layer, caret, stepOf(state), direction)
  } else if (by === 'end') {
    target = direction < 0 ? 0 : totalTicks(draft)
  } else if (by === 'line') {
    target = lineStart(bars, caret, direction)
  } else {
    const here = barAt(draft, caret)
    target =
      direction > 0
        ? (bars[here.index + 1]?.start ?? (layer === 'chords' ? caret : totalTicks(draft)))
        : caret > here.start
          ? here.start
          : (bars[here.index - 1]?.start ?? 0)
  }
  return placeCaret(state, target, layer, extend)
}
