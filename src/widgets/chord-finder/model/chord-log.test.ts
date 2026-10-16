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

  it('keeps the chord before the next only if it names one: a note or interval on the way is not one', () => {
    expect(play([60], [], [60, 64], [], [48, 55], [], [60, 64, 67]).chords).toEqual([
      keys(48, 55),
      keys(60, 64, 67),
    ])
    expect(play([60, 61, 62], [], [60]).chords).toEqual([keys(60)])
  })

  it('keeps the newest chords, as many as the device remembers', () => {
    const steps = Array.from({ length: LOGGED_CHORDS + 2 }, (_, i) => [
      [48 + i, 52 + i, 55 + i],
      [],
    ]).flat()
    const log = play(...steps)
    expect(log.chords).toHaveLength(LOGGED_CHORDS)
    expect(log.chords.at(-1)).toEqual(
      keys(48 + LOGGED_CHORDS + 1, 52 + LOGGED_CHORDS + 1, 55 + LOGGED_CHORDS + 1),
    )
  })
})
