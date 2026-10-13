import { describe, expect, it } from 'vitest'
import { arrange, type Chart, type EventPattern, parseFigure } from '@/shared/lib/arrangement'
import { note } from '@/shared/lib/music'
import { chordPositions } from './chord-positions'

const BLOCK: EventPattern = {
  id: 'block',
  rh: { kind: 'events', events: parseFigure('0/16 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
}
const C = note('C')
const bar = (root: 'C' | 'F' | 'G', quality: 'maj' | 'min') => ({
  chords: [{ root: note(root), quality, beats: 4 }],
  beats: 4,
})
const CHART: Chart = {
  key: { tonic: C, minor: false },
  meter: '4/4',
  sections: [{ lines: [[bar('C', 'maj'), bar('F', 'maj'), bar('G', 'maj')]] }],
}

describe('chordPositions', () => {
  it('names each chord’s right hand by its lowest key', () => {
    const performance = arrange(CHART, { tonic: C, pattern: BLOCK, inversion: 1 })
    expect(chordPositions(performance)).toEqual([
      { inversion: 1 },
      { inversion: 1 },
      { inversion: 1 },
    ])
  })

  it('follows Nearest from the first chord’s inversion', () => {
    const performance = arrange(CHART, { tonic: C, pattern: BLOCK, inversion: 0, nearest: true })
    expect(chordPositions(performance)[0]).toEqual({ inversion: 0 })
    expect(chordPositions(performance)[1]).toEqual({ inversion: 2 }) // C F A over F
  })
})
