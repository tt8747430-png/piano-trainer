import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { takeSounds } from './sounds'
import type { Take } from './types'

const TAKE: Take = {
  id: 'take-1',
  pieceId: 'bz1',
  made: 0,
  tempo: 90,
  meter: '4/4',
  length: 3000,
  notes: [],
  pedal: [],
}

const note = (key: number, at: number, held: number, velocity = 80) => ({
  midi: midi(key),
  at,
  held,
  velocity,
})

describe('takeSounds', () => {
  it('sounds each key from its onset while it was held, louder as it was struck harder', () => {
    const sounds = takeSounds({ ...TAKE, notes: [note(60, 0, 500, 127), note(64, 250, 250, 64)] })
    expect(sounds.map(({ midi: key, at, duration }) => [key, at, duration])).toEqual([
      [60, 0, 0.5],
      [64, 0.25, 0.25],
    ])
    const [loud, soft] = sounds
    expect(loud?.velocity).toBeGreaterThan(soft?.velocity ?? 1)
    expect(loud?.velocity).toBeCloseTo(0.3)
  })

  it('holds a key let go under the pedal on to the pedal’s release, never past the key struck again', () => {
    const sounds = takeSounds({
      ...TAKE,
      notes: [note(60, 0, 200), note(64, 100, 200), note(60, 800, 100), note(67, 1500, 100)],
      pedal: [{ down: 150, up: 1000 }],
    })
    expect(sounds.map(({ midi: key, at, duration }) => [key, at, duration])).toEqual([
      [60, 0, 0.8],
      [64, 0.1, 0.9],
      [60, 0.8, 0.2],
      [67, 1.5, 0.1],
    ])
  })
})
