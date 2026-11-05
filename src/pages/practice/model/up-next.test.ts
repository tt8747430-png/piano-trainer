import { describe, expect, it } from 'vitest'
import { upNext } from './up-next'

const none = { gaps: 0, exercised: {}, recent: [], firstExercise: 'five-finger' } as const

describe('Practice’s Up next (R32)', () => {
  it('starts a new learner with the first exercise and Chords', () => {
    expect(upNext(none)).toEqual([
      { kind: 'firstExercise', id: 'five-finger' },
      { kind: 'firstPage', page: 'chords' },
    ])
  })

  it('puts skills due first, then the exercise last played, then the page last opened', () => {
    expect(
      upNext({
        ...none,
        gaps: 4,
        exercised: { hanon: '2026-11-01', 'five-finger': '2026-11-03' },
        recent: ['metronome', 'chords'],
      }),
    ).toEqual([
      { kind: 'review', count: 4 },
      { kind: 'exercise', id: 'five-finger', day: '2026-11-03' },
      { kind: 'page', page: 'metronome' },
    ])
  })

  it('never offers a page a card before it already stands for', () => {
    expect(
      upNext({
        ...none,
        gaps: 2,
        exercised: { hanon: '2026-11-01' },
        recent: ['quiz', 'exercises', 'scales'],
      }),
    ).toEqual([
      { kind: 'review', count: 2 },
      { kind: 'exercise', id: 'hanon', day: '2026-11-01' },
      { kind: 'page', page: 'scales' },
    ])
  })

  it('shows only what the record holds', () => {
    expect(upNext({ ...none, recent: ['tuner'] })).toEqual([{ kind: 'page', page: 'tuner' }])
  })
})
