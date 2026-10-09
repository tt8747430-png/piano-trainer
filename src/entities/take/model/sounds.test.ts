import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { SOFT_GAIN } from '@/shared/lib/schedule'
import { takeSounds, takeSoundsFrom } from './sounds'
import type { Take } from './types'

const TAKE: Take = {
  id: 'take-1',
  pieceId: 'bz1',
  made: 0,
  tempo: 90,
  meter: '4/4',
  fromBar: 1,
  length: 3000,
  notes: [],
  pedals: [],
}

const note = (key: number, at: number, held: number, velocity = 80) => ({
  midi: midi(key),
  at,
  held,
  velocity,
})

describe('takeSounds', () => {
  it('sounds each key from its onset while it was held, louder as it was struck harder', () => {
    const sounds = takeSounds(
      { ...TAKE, notes: [note(60, 0, 500, 127), note(64, 250, 250, 64)] },
      'normal',
    )
    expect(sounds.map(({ midi: key, at, duration }) => [key, at, duration])).toEqual([
      [60, 0, 0.5],
      [64, 0.25, 0.25],
    ])
    const [loud, soft] = sounds
    expect(loud?.velocity).toBeGreaterThan(soft?.velocity ?? 1)
    expect(loud?.velocity).toBeCloseTo(0.3)
  })

  it('holds a key let go under the pedal on to the pedal’s release, never past the key struck again', () => {
    const sounds = takeSounds(
      {
        ...TAKE,
        notes: [note(60, 0, 200), note(64, 100, 200), note(60, 800, 100), note(67, 1500, 100)],
        pedals: [{ pedal: 'sustain', down: 150, up: 1000 }],
      },
      'normal',
    )
    expect(sounds.map(({ midi: key, at, duration }) => [key, at, duration])).toEqual([
      [60, 0, 0.8],
      [64, 0.1, 0.9],
      [60, 0.8, 0.2],
      [67, 1.5, 0.1],
    ])
  })

  const timing = (sounds: readonly { midi: number; at: number; duration: number }[]) =>
    sounds.map(({ midi: key, at, duration }) => [key, at, duration])

  it('holds with the sostenuto only the key held as it went down', () => {
    const sounds = takeSounds(
      {
        ...TAKE,
        notes: [note(60, 0, 300), note(64, 400, 100)],
        pedals: [{ pedal: 'sostenuto', down: 200, up: 1000 }],
      },
      'normal',
    )
    expect(timing(sounds)).toEqual([
      [60, 0, 1],
      [64, 0.4, 0.1],
    ])
  })

  it('sounds a key struck under the soft pedal two thirds as loud', () => {
    const [soft, full] = takeSounds(
      {
        ...TAKE,
        notes: [note(60, 100, 100, 100), note(62, 600, 100, 100)],
        pedals: [{ pedal: 'soft', down: 0, up: 500 }],
      },
      'normal',
    )
    expect(soft?.velocity).toBeCloseTo((full?.velocity ?? 0) * SOFT_GAIN)
  })

  it('hears a soft note softer under the Heavy touch, the take as played', () => {
    const take = { ...TAKE, notes: [note(60, 0, 100, 40)] }
    const [heavy] = takeSounds(take, 'heavy')
    const [normal] = takeSounds(take, 'normal')
    expect(heavy?.velocity).toBeLessThan(normal?.velocity ?? 0)
    expect(take.notes[0]?.velocity).toBe(40)
  })
})

describe('takeSoundsFrom', () => {
  it('sounds what starts from a moment on, its time from there', () => {
    const take = { ...TAKE, notes: [note(60, 0, 500), note(64, 1000, 500), note(67, 2000, 500)] }
    expect(takeSoundsFrom(take, 'normal', 1000).map(({ midi: key, at }) => [key, at])).toEqual([
      [64, 0],
      [67, 1],
    ])
  })
})
