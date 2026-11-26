import { describe, expect, it } from 'vitest'
import { INTERVALS } from './interval'
import { consonanceOf, INTERVAL_GROUP_IDS, INTERVAL_GROUPS, spanInterval } from './interval-facts'

describe('the reference’s intervals', () => {
  it('run from the unison to the octave, a semitone at a time but for the one tritone', () => {
    expect(INTERVAL_GROUP_IDS).toEqual(['simple', 'compound'])
    expect(INTERVAL_GROUPS.simple.map((name) => INTERVALS[name].semitones)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ])
  })

  it('go past the octave to the double octave, a semitone at a time, the tritone’s 11th and 12th both', () => {
    expect(INTERVAL_GROUPS.compound.map((name) => INTERVALS[name].semitones)).toEqual([
      13, 14, 15, 16, 17, 18, 18, 19, 20, 21, 22, 23, 24,
    ])
    expect(INTERVALS.A11.degree).toBe('#11')
  })

  it('call the octave an 8th, twelve semitones up on the same letter', () => {
    expect(INTERVALS.P8).toEqual({ steps: 0, semitones: 12, degree: '8' })
  })
})

describe('consonanceOf', () => {
  it('hears perfect and imperfect consonances and dissonances as theory classes them', () => {
    expect(INTERVAL_GROUPS.simple.map((name) => consonanceOf(INTERVALS[name]))).toEqual([
      'perfect',
      'dissonance',
      'dissonance',
      'imperfect',
      'imperfect',
      'perfect',
      'dissonance',
      'perfect',
      'imperfect',
      'imperfect',
      'dissonance',
      'dissonance',
      'perfect',
    ])
  })

  it('hears a compound interval as its simple one, an augmented or diminished one as a dissonance', () => {
    expect(INTERVAL_GROUPS.compound.map((name) => consonanceOf(INTERVALS[name]))).toEqual([
      'dissonance',
      'dissonance',
      'imperfect',
      'imperfect',
      'perfect',
      'dissonance',
      'dissonance',
      'perfect',
      'imperfect',
      'imperfect',
      'dissonance',
      'dissonance',
      'perfect',
    ])
  })
})

describe('spanInterval', () => {
  it('names two keys’ distance, a compound one as its simple interval', () => {
    expect([0, 3, 6, 12, 16, 19].map(spanInterval)).toEqual(['r', 'm3', 'A4', 'P8', 'M3', 'P5'])
  })
})
