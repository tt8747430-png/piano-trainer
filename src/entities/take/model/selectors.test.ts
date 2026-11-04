import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import {
  selectFreeTake,
  selectFreeTakes,
  selectRoomLeft,
  selectTake,
  selectTakesOf,
} from './selectors'
import type { TakesState } from './store'
import { NOTES_ROOM, type Take, type TakeId } from './types'

const take = (id: Take['id'], pieceId: string, notes: number): Take => ({
  id,
  pieceId,
  made: 0,
  tempo: 90,
  meter: '4/4',
  fromBar: 1,
  length: 1000,
  bars: [0, 2667],
  notes: Array.from({ length: notes }, () => ({ midi: midi(60), at: 0, held: 10, velocity: 80 })),
  pedals: [],
})

const STATE: TakesState = {
  takes: [take('take-1', 'bz1', 3), take('take-2', 'my-1', 2), take('take-3', 'bz1', 4)],
  free: [],
  nextTake: 4,
}

/** A free recording of the Recorder's: a take of no song (R29 B11). */
const free = (id: TakeId, notes: number) => {
  const { pieceId: _piece, fromBar: _bar, ...recording } = take(id, 'bz1', notes)
  return recording
}

describe('takes selectors', () => {
  it('lists a piece’s takes, the newest first', () => {
    expect(selectTakesOf(STATE, 'bz1').map((each) => each.id)).toEqual(['take-3', 'take-1'])
    expect(selectTakesOf(STATE, 'otche')).toEqual([])
  })

  it('finds a take by its id', () => {
    expect(selectTake(STATE, 'take-2')?.pieceId).toBe('my-1')
    expect(selectTake(STATE, 'take-9')).toBeUndefined()
  })

  it('says how many notes the takes still have room for', () => {
    expect(selectRoomLeft(STATE)).toBe(NOTES_ROOM - 9)
    expect(
      selectRoomLeft({ takes: [take('take-1', 'bz1', NOTES_ROOM + 5)], free: [], nextTake: 2 }),
    ).toBe(0)
  })

  it('lists the free recordings, the newest first, and counts their notes in the room (R29 B11)', () => {
    const state = { ...STATE, free: [free('take-4', 5), free('take-5', 1)], nextTake: 6 }
    expect(selectFreeTakes(state).map((each) => each.id)).toEqual(['take-5', 'take-4'])
    expect(selectFreeTake(state, 'take-4')?.notes).toHaveLength(5)
    expect(selectRoomLeft(state)).toBe(NOTES_ROOM - 15)
  })
})
