import type { Midi, Tick } from '@/shared/lib/music'
import { ticksOf } from '@/shared/lib/notation'
import { caretPlaces, itemAt, nextCaret, snapToChord, tapPlaces } from './caret'
import type { Draft, Layer } from './draft'
import { notesAt } from './notes'
import type { CaretMove, EditorState, Selection, TickSpan } from './state'
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

/** Every place the caret may stand in a layer: where a double click on the sheet writes a note. */
export const placesIn = (state: EditorState, layer: Layer): Tick[] =>
  caretPlaces(state.draft, layer, stepOf(state))

/** Where a click on the sheet lands in a layer: a note, or a bar's start (ADR 0082). */
export const tapsIn = (state: EditorState, layer: Layer): Tick[] => tapPlaces(state.draft, layer)

/** The span the notes chosen take, from the earlier's start to the later's end. */
export const selectionSpan = ({ anchor, head }: Selection): TickSpan => ({
  from: Math.min(anchor.from, head.from),
  to: Math.max(anchor.to, head.to),
})

/**
 * The notes chosen once the caret goes to `next` in `layer` with Shift (ADR 0088), as a notation app
 * extends a range: from what the choice began on (the caret's note, chord or empty place) to what it
 * reaches, both inside.
 */
const extendedTo = (state: EditorState, next: Tick, layer: Layer): Selection => ({
  anchor: state.selection?.anchor ?? itemAt(state.draft, state.layer, state.caret),
  head: itemAt(state.draft, layer, next),
})

/**
 * The caret put at a tick in a layer (a click on the sheet, else a move), Shift choosing notes; a key
 * names one note of the chord there, chosen alone (ADR 0088).
 */
export function placeCaret(
  state: EditorState,
  tick: Tick,
  layer: Layer,
  extend: boolean,
  key?: Midi,
): EditorState {
  const next = placed(state.draft, layer, tick)
  const selection = extend ? extendedTo(state, next, layer) : null
  const chord = layer === 'chords' || extend ? [] : notesAt(state.draft, layer, next)
  const chordNote =
    key !== undefined && chord.length > 1 && chord.some((n) => n.midi === key) ? key : null
  return { ...state, layer, caret: next, selection, chordNote, struck: null }
}

/** The places a click lands on in bar `index` of a layer: its notes', or its start. */
function placesOfBar(draft: Draft, layer: Layer, index: number): Tick[] {
  const bar = barsOf(draft)[index]
  if (!bar) return []
  const end = bar.start + bar.bar.ticks
  return tapPlaces(draft, layer).filter((tick) => tick >= bar.start && tick < end)
}

/**
 * Where Shift with a bar's move takes what is chosen (ADR 0088): on to its bar's last note, else the
 * next bar's; back to its bar's first, else the bar before's.
 */
function barReach(state: EditorState, direction: -1 | 1): Tick {
  const { draft, layer } = state
  const head = state.selection?.head ?? itemAt(draft, layer, state.caret)
  const bar = barAt(draft, head.from)
  if (direction > 0) {
    const last = placesOfBar(draft, layer, bar.index).at(-1)
    if (last !== undefined && last > head.from) return last
    return placesOfBar(draft, layer, bar.index + 1).at(-1) ?? head.from
  }
  if (head.from > bar.start) return bar.start
  return placesOfBar(draft, layer, bar.index - 1)[0] ?? head.from
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

/**
 * The caret moved a step, a bar, a line or to an end; with Shift, what is chosen reaches on by a
 * note, to a bar's end or start, or to an end of the piece (ADR 0088).
 */
export function moveCaret(
  state: EditorState,
  by: CaretMove,
  direction: -1 | 1,
  extend: boolean,
): EditorState {
  const { draft, layer, caret } = state
  if (extend && by !== 'line') {
    const target =
      by === 'bar'
        ? barReach(state, direction)
        : by === 'end'
          ? direction < 0
            ? 0
            : (tapPlaces(draft, layer).at(-1) ?? caret)
          : nextCaret(draft, layer, caret, stepOf(state), direction)
    return placeCaret(state, target, layer, true)
  }
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
  return placeCaret(state, target, layer, false)
}
