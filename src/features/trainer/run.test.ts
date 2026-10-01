import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import type { Question } from './round-machine'
import { runAnswered, runShown, runSummary, startRun, stopRun } from './run'

const question = (key: number): Question => ({
  mode: 'read-note',
  key: midi(key),
  spelled: note('C'),
  clef: 'treble',
})

describe('a run', () => {
  it('times each answer from the round shown and counts the streak', () => {
    let run = startRun(3, 1000)
    run = runAnswered(run, question(60), true, 2500)
    run = runAnswered(runShown(run, 3000), question(62), true, 3500)
    expect(run.answered.map((round) => round.ms)).toEqual([1500, 500])
    expect(run.streak).toBe(2)
    expect(run.over).toBe(false)
  })

  it('is over at its last round, keeping the best streak a wrong answer ends', () => {
    let run = startRun(3, 0)
    run = runAnswered(run, question(60), true, 1000)
    run = runAnswered(run, question(62), true, 2000)
    run = runAnswered(run, question(64), false, 3000)
    expect(run).toMatchObject({ streak: 0, bestStreak: 2, over: true })
  })

  it('runs until stopped when it has no number of rounds', () => {
    let run = startRun(0, 0)
    for (let i = 0; i < 30; i++) run = runAnswered(run, question(60), true, i)
    expect(run.over).toBe(false)
    expect(stopRun(run).over).toBe(true)
  })

  it('sums up its accuracy, average answer time and the rounds missed', () => {
    let run = startRun(4, 0)
    run = runAnswered(run, question(60), true, 1000)
    run = runAnswered(runShown(run, 1000), question(62), false, 4000)
    run = runAnswered(runShown(run, 4000), question(64), true, 5000)
    expect(runSummary(run)).toEqual({
      answered: 3,
      accuracy: 67,
      averageMs: 1667,
      bestStreak: 1,
      missed: [question(62)],
    })
  })

  it('sums up a run stopped before any answer', () => {
    expect(runSummary(stopRun(startRun(10, 0)))).toEqual({
      answered: 0,
      accuracy: 0,
      averageMs: 0,
      bestStreak: 0,
      missed: [],
    })
  })
})
