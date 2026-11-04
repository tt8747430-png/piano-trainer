import { describe, expect, it } from 'vitest'
import { midi, note, TICKS_PER_BEAT } from '@/shared/lib/music'
import { annotate } from './annotate'
import { notate } from './notate'
import type { NotesEvent, Score, TimedNote } from './types'

const B = TICKS_PER_BEAT
const played = (key: number, beat: number): TimedNote => ({
  midi: midi(key),
  spelled: note('C'),
  hand: 'rh',
  startTick: beat * B,
  durationTicks: B,
})
const SCORE = notate({
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  bars: [{ startTick: 0, beats: 4 }],
  notes: [played(60, 0), played(64, 0), played(62, 1), played(64, 2), played(65, 3)],
  chords: [],
})
const at = (score: Score, beat: number) =>
  score.measures[0]?.staves.treble[0]?.events.find(
    (event): event is NotesEvent => event.kind === 'notes' && event.tick === beat * B,
  )

describe('annotate', () => {
  it('writes each typed mark as the engraving’s own, on the notes that start there', () => {
    const marked = annotate(SCORE, [
      { at: 0, staff: 'treble', kind: 'fingering', value: 3 },
      { at: B, staff: 'treble', kind: 'text', value: 'lightly' },
      { at: 2 * B, staff: 'treble', kind: 'dynamic', value: 'mf' },
      { at: 3 * B, staff: 'treble', kind: 'pause' },
      { at: 3 * B, staff: 'treble', kind: 'breath' },
    ])
    expect(at(marked, 0)?.notes.map((each) => each.finger)).toEqual([undefined, 3])
    expect(at(marked, 1)?.marks?.text).toBe('lightly')
    expect(at(marked, 2)?.marks?.dynamic).toBe('mf')
    expect(at(marked, 3)?.marks?.articulations).toEqual(['fermata', 'breath'])
  })

  it('leaves out a mark where no note starts, and a score with none as it is', () => {
    expect(annotate(SCORE, [])).toBe(SCORE)
    const marked = annotate(SCORE, [{ at: 1, staff: 'bass', kind: 'text', value: 'x' }])
    expect(marked.measures[0]?.staves.bass).toEqual(SCORE.measures[0]?.staves.bass)
  })
})
