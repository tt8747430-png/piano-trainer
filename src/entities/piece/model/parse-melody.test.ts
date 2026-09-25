import { describe, expect, it } from 'vitest'
import { ContentError } from './content-error'
import { parseMelody } from './parse-melody'
import { testSong } from '../testing/test-pieces'

const melodyOf = (melody: string) => parseMelody(testSong(['C'], { melody }))

describe('parseMelody', () => {
  it('reads notes and rests in beats, ignoring bar lines', () => {
    expect(melodyOf('E4/1 D4/.5 r/1 | C#5/1.5')).toEqual([
      { midi: 64, startTick: 0, durationTicks: 12 },
      { midi: 62, startTick: 12, durationTicks: 6 },
      { midi: 73, startTick: 30, durationTicks: 18 },
    ])
  })

  it('reads flats written either way', () => {
    expect(melodyOf('Bb3/1 B♭3/1')?.map((n) => n.midi)).toEqual([58, 58])
  })

  it('is undefined for a piece without one', () => {
    expect(parseMelody(testSong(['C']))).toBeUndefined()
  })

  it.each(['X4/1', 'E4', 'E4/0', 'E4/0.3', 'E/1'])('names the note it cannot read: %j', (token) => {
    let caught: unknown
    try {
      melodyOf(`C4/1 ${token}`)
    } catch (error) {
      caught = error
    }
    expect(caught).toBeInstanceOf(ContentError)
    expect((caught as ContentError).position).toEqual({ note: 2 })
    expect((caught as ContentError).message).toContain(token)
  })
})
