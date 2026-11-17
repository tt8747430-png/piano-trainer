import type { Performance } from '@/shared/lib/arrangement'
import { TICKS_PER_BEAT, type Midi, type Tick } from '@/shared/lib/music'
import type { Take, TakeNote } from './types'

/** What a take is judged against: the music's notes and its bars. */
type Played = Pick<Performance, 'notes' | 'bars'>

/** How a written note was played in a take (R29 B8, Feedback). */
export type Verdict = 'right' | 'wrong' | 'missed' | 'early' | 'late'
export const VERDICTS: readonly Verdict[] = ['right', 'wrong', 'missed', 'early', 'late']

/**
 * A written note judged: where it is, how it was played (`by`: ms off its time, where played), and
 * what it costs the take's share (`penalty`, 0 on the beat to 1 wrong or missed).
 */
export interface NoteVerdict {
  readonly tick: Tick
  readonly midi: Midi
  readonly verdict: Verdict
  readonly by?: number
  readonly penalty: number
}

export interface Feedback {
  readonly notes: readonly NoteVerdict[]
  readonly counts: Readonly<Record<Verdict, number>>
  /** The share earned, a whole percent: each note's penalty taken off; 0 where nothing was judged. */
  readonly percent: number
}

/**
 * A take is judged by the beat (research item 10; Metronaut's windows, Scale Runner's on-beat and
 * close): on the beat within a tenth of a beat, never under 40 ms nor over 120; close (early or late,
 * a third off) to a quarter of a beat; further off, two thirds off; wrong or missed, all of it.
 */
const ON_BEAT = 0.1
const ON_BEAT_MS = { least: 40, most: 120 } as const
const CLOSE = 0.25
const PENALTY = { close: 0.33, off: 0.66, wrong: 1 } as const
/** A take this near whole reads as whole: the slips left are the instrument's, not the learner's. */
const WHOLE_FROM = 96

/** The on-the-beat window at a tempo, in ms either side of a note's time. */
export const onBeatMs = (tempo: number) =>
  Math.min(ON_BEAT_MS.most, Math.max(ON_BEAT_MS.least, (ON_BEAT * 60_000) / tempo))

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

/** A played note's verdict and penalty by how far off its time it fell, a beat being `beat` ms long. */
function timed(
  by: number,
  tolerance: number,
  beat: number,
): Pick<NoteVerdict, 'verdict' | 'penalty'> {
  if (Math.abs(by) <= tolerance) return { verdict: 'right', penalty: 0 }
  return {
    verdict: by < 0 ? 'early' : 'late',
    penalty: Math.abs(by) <= CLOSE * beat ? PENALTY.close : PENALTY.off,
  }
}

/**
 * A take against the written music (R29 B8): each written note of the piano's under the take matched
 * to the played note of its key nearest its time (within half a beat at the take's tempo): right
 * within ±`tolerance` ms (by the beat, `onBeatMs`, unless said), else early or late, close to a
 * quarter of a beat; a note matched by no key of its own but by another key there is wrong, by none
 * missed. The share is what the notes' penalties leave, whole from 96 %. In `rhythm` (the Rhythm game) the keys do not count: each onset is
 * matched to the nearest key struck, on its time alone.
 */
export function feedbackOf(
  performance: Played,
  take: Take,
  { tolerance = onBeatMs(take.tempo), rhythm = false } = {},
): Feedback {
  const due = dueNotes(performance, take)
  const beat = 60_000 / take.tempo
  const reach = beat / 2
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
          ...(by === undefined
            ? { verdict: 'missed', penalty: PENALTY.wrong }
            : { ...timed(by, tolerance, beat), by }),
        })
    }
  } else {
    for (const note of due) {
      const hit = nearest(take.notes, taken, note.at, reach, note.midi)
      if (hit === null) continue
      taken.add(hit)
      const by = (take.notes[hit]?.at ?? note.at) - note.at
      verdicts.set(note, { tick: note.tick, midi: note.midi, ...timed(by, tolerance, beat), by })
    }
    for (const note of due) {
      if (verdicts.has(note)) continue
      const hit = nearest(take.notes, taken, note.at, reach)
      if (hit !== null) taken.add(hit)
      verdicts.set(note, {
        tick: note.tick,
        midi: note.midi,
        verdict: hit === null ? 'missed' : 'wrong',
        penalty: PENALTY.wrong,
      })
    }
  }
  const notes = due.flatMap((note) => verdicts.get(note) ?? [])
  const counts = Object.fromEntries(
    VERDICTS.map((verdict) => [verdict, notes.filter((note) => note.verdict === verdict).length]),
  ) as Record<Verdict, number>
  return { notes, counts, percent: shareOf(notes) }
}

/** The whole percent the notes earn, their penalties taken off; whole from 96; 0 for none. */
export function shareOf(notes: readonly Pick<NoteVerdict, 'penalty'>[]): number {
  if (notes.length === 0) return 0
  const lost = notes.reduce((sum, note) => sum + note.penalty, 0) / notes.length
  const percent = Math.round(100 * (1 - lost))
  return percent >= WHOLE_FROM ? 100 : percent
}
