import type { DrawnAs, Measure, ScoreEvent } from './types'

/** A measure's music timed from its start: what a bar repeat compares. */
function musicOf(measure: Measure): string {
  const from = (event: ScoreEvent) => ({
    ...event,
    tick: event.tick - measure.startTick,
    ...(event.tupletAt === undefined ? {} : { tupletAt: event.tupletAt - measure.startTick }),
  })
  const staves = Object.entries(measure.staves).map(([staff, voices]) => [
    staff,
    (voices ?? []).map((voice) => ({ ...voice, events: voice.events.map(from) })),
  ])
  return JSON.stringify([measure.ticks, measure.time, measure.key, measure.clefs, staves])
}

/** Whether two measures play the same music, each in its own time. */
const same = (a: Measure | undefined, b: Measure | undefined) =>
  a !== undefined && b !== undefined && musicOf(a) === musicOf(b)

/** A measure with nothing in it to play: each staff's voices rests alone. */
const isEmpty = (measure: Measure) =>
  Object.values(measure.staves).every((voices) =>
    (voices ?? []).every((voice) => voice.events.every((event) => event.kind === 'rest')),
  )

/** What a bar inside a multi-bar rest may not have: a mark or a change printed at its start. */
const startsAnew = (measure: Measure, before: Measure) =>
  measure.repeatStart !== undefined ||
  measure.ending !== undefined ||
  measure.segno !== undefined ||
  measure.coda !== undefined ||
  measure.pageBreak !== undefined ||
  measure.tempo !== undefined ||
  measure.barRepeat !== undefined ||
  measure.multiRest !== undefined ||
  measure.key !== before.key ||
  JSON.stringify(measure.clefs) !== JSON.stringify(before.clefs) ||
  measure.time.count !== before.time.count ||
  measure.time.unit !== before.time.unit

/** What a bar may not have and a multi-bar rest go on past it: a mark printed at its end. */
const endsRun = (measure: Measure) =>
  measure.barline !== undefined ||
  measure.jump !== undefined ||
  measure.fine !== undefined ||
  measure.toCoda !== undefined

/**
 * How each measure is drawn (ADR 0087): a bar repeat's sign where its bar (or its pair) plays the
 * bar (or the two) before it again, its notes where they do not; a multi-bar rest over the bars it
 * counts while they stay empty, with no mark or change between them, where that is two bars or more.
 */
export function drawnAs(measures: readonly Measure[]): Measure[] {
  const drawn: (DrawnAs | undefined)[] = measures.map(() => undefined)
  measures.forEach((measure, i) => {
    if (measure.barRepeat === 1 && same(measure, measures[i - 1])) drawn[i] = 'repeat'
    if (
      measure.barRepeat === 2 &&
      same(measure, measures[i - 2]) &&
      same(measures[i + 1], measures[i - 1])
    ) {
      drawn[i] = 'repeat2'
      drawn[i + 1] = 'repeat2'
    }
    if (measure.multiRest !== undefined && isEmpty(measure)) {
      let end = i + 1
      while (end < i + measure.multiRest) {
        const next = measures[end]
        const before = measures[end - 1]
        if (!next || !before || !isEmpty(next) || startsAnew(next, before) || endsRun(before)) break
        end += 1
      }
      if (end - i >= 2) for (let at = i; at < end; at += 1) drawn[at] = at === i ? 'rest' : 'restOn'
    }
  })
  return measures.map((measure, i) => {
    const as = drawn[i]
    if (as === measure.drawn) return measure
    if (as !== undefined) return { ...measure, drawn: as }
    const { drawn: _was, ...plain } = measure
    return plain
  })
}
