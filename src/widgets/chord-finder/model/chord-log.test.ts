import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { EMPTY_LOG, LOGGED_CHORDS, logKeys, type ChordLog } from './chord-log'

const keys = (...numbers: number[]) => numbers.map((n) => midi(n))
const play = (...steps: number[][]) =>
  steps.reduce<ChordLog>((log, step) => logKeys(log, keys(...step)), EMPTY_LOG)

describe('logKeys', () => {
  it('grows the newest chord while keys are added and none let go, lowest first', () => {
    expect(play([64], [60, 64], [60, 64, 67]).chords).toEqual([keys(60, 64, 67)])
  })

  it('keeps the chord read as its keys are let go', () => {
    expect(play([60, 64, 67], [64, 67], [67], []).chords).toEqual([keys(60, 64, 67)])
  })

  it('starts the next chord once a key is struck after one was let go', () => {
    expect(play([60, 64, 67], [64, 67], [65, 64, 67]).chords).toEqual([
      keys(60, 64, 67),
      keys(64, 65, 67),
    ])
    expect(play([60, 64, 67], [], [60, 64, 67]).chords).toHaveLength(2)
  })

  it('keeps the newest chord and the five before it', () => {
    const steps = Array.from({ length: LOGGED_CHORDS + 2 }, (_, i) => [[60 + i], []]).flat()
    const log = play(...steps)
    expect(log.chords).toHaveLength(LOGGED_CHORDS)
    expect(log.chords.at(-1)).toEqual(keys(60 + LOGGED_CHORDS + 1))
  })
})
