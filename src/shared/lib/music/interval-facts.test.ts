import { describe, expect, it } from 'vitest'
import { INTERVALS } from './interval'
import { consonanceOf, INTERVAL_GROUP_IDS, INTERVAL_GROUPS } from './interval-facts'

describe('the reference’s intervals', () => {
  it('run from the unison to the octave, a semitone at a time but for the one tritone', () => {
    expect(INTERVAL_GROUP_IDS).toEqual(['simple', 'compound'])
    expect(INTERVAL_GROUPS.simple.map((name) => INTERVALS[name].semitones)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ])
  })

  it('go past the octave to the degrees a chord symbol writes', () => {
    expect(INTERVAL_GROUPS.compound.map((name) => INTERVALS[name].degree)).toEqual([
      '♭9',
      '9',
      '#9',
      '11',
      '#11',
      '♭13',
      '13',
    ])
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

  it('hears a compound interval as its simple one, an augmented one as a dissonance', () => {
    expect(INTERVAL_GROUPS.compound.map((name) => consonanceOf(INTERVALS[name]))).toEqual([
      'dissonance',
      'dissonance',
      'dissonance',
      'perfect',
      'dissonance',
      'imperfect',
      'imperfect',
    ])
  })
})
