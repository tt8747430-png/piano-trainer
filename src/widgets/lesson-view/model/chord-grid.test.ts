import { describe, expect, it } from 'vitest'
import { gridSymbols } from './chord-grid'

describe('gridSymbols', () => {
  it('writes a quality on all twelve roots, each spelled by the kernel’s one rule', () => {
    expect(gridSymbols('maj')).toEqual([
      'C',
      'D♭',
      'D',
      'E♭',
      'E',
      'F',
      'F#',
      'G',
      'A♭',
      'A',
      'B♭',
      'B',
    ])
    expect(gridSymbols('min')).toEqual([
      'Cm',
      'C#m',
      'Dm',
      'E♭m',
      'Em',
      'Fm',
      'F#m',
      'Gm',
      'G#m',
      'Am',
      'B♭m',
      'Bm',
    ])
  })
})
