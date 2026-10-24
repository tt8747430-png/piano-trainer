import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart } from '@/shared/lib/arrangement'
import { C_MAJOR, midi, note, parseChordSymbol } from '@/shared/lib/music'
import { playedMusic } from './played-music'

const CHART: Chart = {
  key: C_MAJOR,
  meter: '4/4',
  sections: [{ lines: [[{ chords: [{ ...parseChordSymbol('C'), beats: 4 }], beats: 4 }]] }],
}
const BLOCK = {
  id: 'block',
  rh: { kind: 'events', events: parseFigure('0/16 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
} as const
const tune = [{ midi: midi(72), spelled: note('C'), startTick: 0, durationTicks: 96 }]

describe('playedMusic', () => {
  it('writes the tune doubled an octave up as the song writes it, on its own staff', () => {
    const performance = arrange(CHART, {
      tonic: C_MAJOR.tonic,
      pattern: BLOCK,
      melody: tune,
      doubleMelody: true,
    })
    const music = playedMusic(performance, true)
    expect(music.melodyStaff).toBe(true)
    expect(music.notes.filter((n) => n.hand === 'melody').map((n) => n.midi)).toEqual([72])
    expect(playedMusic(performance, false)).toBe(performance)
  })
})
