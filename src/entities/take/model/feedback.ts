import type { Performance } from '@/shared/lib/arrangement'
import { TICKS_PER_BEAT, type Midi, type Tick } from '@/shared/lib/music'
import type { Take, TakeNote } from './types'

/** What a take is judged against: the music's notes and its bars. */
type Played = Pick<Performance, 'notes' | 'bars'>

/** How a written note was played in a take (R29 B8, Feedback). */
export type Verdict = 'right' | 'wrong' | 'missed' | 'early' | 'late'
export const VERDICTS: readonly Verdict[] = ['right', 'wrong', 'missed', 'early', 'late']

/** A written note judged: where it is, and how it was played (`by`: ms off its time, where played). */
export interface NoteVerdict {
  readonly tick: Tick
  readonly midi: Midi
  readonly verdict: Verdict
  readonly by?: number
}

export interface Feedback {
  readonly notes: readonly NoteVerdict[]
  readonly counts: Readonly<Record<Verdict, number>>
  /** The share judged right, a whole percent; 0 where nothing was judged. */
  readonly percent: number
}

/** A take is judged within ±80 ms of each note's time unless said. */
export const FEEDBACK_TOLERANCE_MS = 80

/** A written note on the take's clock: where it is due, in ms from the take's first downbeat. */
interface Due {
  readonly tick: Tick
  readonly midi: Midi
  readonly at: number
}

/** The piano's written notes under the take, each timed by the take's barlines (as the click fell). */
function dueNotes(performance: Played, take: Take): Due[] {
  const first = take.fromBar - 1
  const due: Due[] = []
  for (const note of performance.notes) {
    if (note.hand === 'staff' || note.silent) continue
    const index = performance.bars.findLastIndex((bar) => bar.startTick <= note.startTick)
    const bar = performance.bars[index]
    const from = take.bars[index - first]
    const to = take.bars[index - first + 1]
    if (!bar || from === undefined || to === undefined) continue
    const share = (note.startTick - bar.startTick) / (bar.beats * TICKS_PER_BEAT)
    due.push({ tick: note.startTick, midi: note.midi, at: from + share * (to - from) })
  }
  return due.sort((a, b) => a.at - b.at || a.midi - b.midi)
}

/** The played note nearest `at` within `reach`, not yet taken, and of this key where one is named. */
function nearest(
  played: readonly TakeNote[],
  taken: ReadonlySet<number>,
  at: number,
  reach: number,
  midi?: Midi,
): number | null {
  let best: number | null = null
  played.forEach((note, index) => {
    if (taken.has(index) || (midi !== undefined && note.midi !== midi)) return
    const off = Math.abs(note.at - at)
    if (off > reach) return
    if (best === null || off < Math.abs((played[best]?.at ?? 0) - at)) best = index
  })
  return best
}

const timed = (by: number, tolerance: number): Verdict =>
  Math.abs(by) <= tolerance ? 'right' : by < 0 ? 'early' : 'late'

/**
 * A take against the written music (R29 B8): each written note of the piano's under the take matched
 * to the played note of its key nearest its time (within half a beat at the take's tempo): right,
 * early or late beyond ±`tolerance` ms; a note matched by no key of its own but by another key
 * there is wrong, by none missed. In `rhythm` (the Rhythm game) the keys do not count: each onset is
 * matched to the nearest key struck, on its time alone.
 */
export function feedbackOf(
  performance: Played,
  take: Take,
  { tolerance = FEEDBACK_TOLERANCE_MS, rhythm = false } = {},
): Feedback {
  const due = dueNotes(performance, take)
  const reach = 30_000 / take.tempo
  const taken = new Set<number>()
  const verdicts = new Map<Due, NoteVerdict>()
  if (rhythm) {
    const onsets = [...new Set(due.map((note) => note.at))]
    for (const at of onsets) {
      const hit = nearest(take.notes, taken, at, reach)
      if (hit !== null) taken.add(hit)
      const by = hit === null ? undefined : (take.notes[hit]?.at ?? at) - at
      for (const note of due.filter((each) => each.at === at))
        verdicts.set(note, {
          tick: note.tick,
          midi: note.midi,
          ...(by === undefined ? { verdict: 'missed' } : { verdict: timed(by, tolerance), by }),
        })
    }
  } else {
    for (const note of due) {
      const hit = nearest(take.notes, taken, note.at, reach, note.midi)
      if (hit === null) continue
      taken.add(hit)
      const by = (take.notes[hit]?.at ?? note.at) - note.at
      verdicts.set(note, { tick: note.tick, midi: note.midi, verdict: timed(by, tolerance), by })
    }
    for (const note of due) {
      if (verdicts.has(note)) continue
      const hit = nearest(take.notes, taken, note.at, reach)
      if (hit !== null) taken.add(hit)
      verdicts.set(note, {
        tick: note.tick,
        midi: note.midi,
        verdict: hit === null ? 'missed' : 'wrong',
      })
    }
  }
  const notes = due.flatMap((note) => verdicts.get(note) ?? [])
  const counts = Object.fromEntries(
    VERDICTS.map((verdict) => [verdict, notes.filter((note) => note.verdict === verdict).length]),
  ) as Record<Verdict, number>
  return {
    notes,
    counts,
    percent: notes.length === 0 ? 0 : Math.round((counts.right / notes.length) * 100),
  }
}
