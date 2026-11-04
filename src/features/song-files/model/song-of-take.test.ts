import { describe, expect, it } from 'vitest'
import type { FreeTake } from '@/entities/take'
import { midi } from '@/shared/lib/music'
import { songOfTake } from './song-of-take'

/** At 120 a beat is 500 ms: C E G up the right hand, a low C held under them, played a little off. */
const TAKE: FreeTake = {
  id: 'take-1',
  made: 0,
  tempo: 120,
  meter: '4/4',
  length: 2000,
  bars: [0, 2000],
  notes: [
    { midi: midi(48), at: 5, held: 1980, velocity: 70 },
    { midi: midi(60), at: 10, held: 480, velocity: 80 },
    { midi: midi(64), at: 495, held: 490, velocity: 80 },
    { midi: midi(67), at: 1012, held: 970, velocity: 80 },
  ],
  pedals: [],
}

describe('songOfTake (R29 B11)', () => {
  it('makes a song of a recording: titled, at its tempo and time, snapped to the beat, in two hands', () => {
    const song = songOfTake(TAKE, 'Morning idea')
    expect(song.title).toBe('Morning idea')
    expect(song.music).toMatchObject({ meter: '4/4', tempo: 120 })
    // In beats: a quarter each for C and E, a half for G; the low C a whole bar.
    expect(song.music.hands).toEqual({ rh: 'C4/1 E4/1 G4/2', lh: 'C3/4' })
  })
})
