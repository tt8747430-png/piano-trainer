import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart } from '@/shared/lib/arrangement'
import { midi, note, parseChordSymbol } from '@/shared/lib/music'
import { playedMusic } from './played-music'

const C_MAJOR = { tonic: note('C'), minor: false } as const
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

  it('leaves the words out where the View hides them (ADR 0093)', () => {
    const sung = { text: 'one', hyphen: false, held: 0 }
    const performance = arrange(CHART, {
      tonic: C_MAJOR.tonic,
      pattern: BLOCK,
      melody: [{ ...tune[0]!, lyrics: [sung] }],
      doubleMelody: true,
    })
    const words = (music: { notes: readonly { lyrics?: unknown }[] }) =>
      music.notes.filter((n) => n.lyrics !== undefined).length
    expect(words(performance)).toBe(1)
    expect(words(playedMusic(performance, true))).toBe(1)
    expect(words(playedMusic(performance, true, false))).toBe(0)
    expect(words(playedMusic(performance, false, false))).toBe(0)
  })
})
