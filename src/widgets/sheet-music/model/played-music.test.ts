import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart } from '@/shared/lib/arrangement'
import { C_MAJOR, midi, note, parseChordSymbol } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
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
  it('writes the single staves as the song writes them, heard or not, over the piano (ADR 0097)', () => {
    const performance = arrange(CHART, {
      tonic: C_MAJOR.tonic,
      pattern: BLOCK,
      staves: [{ clef: 'treble', notes: tune }],
    })
    const music = playedMusic(performance)
    expect(music).toBe(performance)
    expect(notate(music).staves).toEqual(['staff0', 'treble', 'bass'])
    expect(music.notes.filter((n) => n.hand === 'staff').map((n) => n.midi)).toEqual([72])
  })

  it('writes a lead sheet’s staves alone, the piano left out (ADR 0114)', () => {
    const performance = arrange(CHART, {
      tonic: C_MAJOR.tonic,
      pattern: BLOCK,
      staves: [{ clef: 'treble', notes: tune }],
      hearTune: true,
    })
    expect(notate(playedMusic(performance, { piano: false })).staves).toEqual(['staff0'])
  })

  it('leaves the words out where the View hides them (ADR 0097)', () => {
    const sung = { text: 'one', hyphen: false, held: 0 }
    const performance = arrange(CHART, {
      tonic: C_MAJOR.tonic,
      pattern: BLOCK,
      staves: [{ clef: 'treble', notes: [{ ...tune[0]!, lyrics: [sung] }] }],
    })
    const words = (music: { notes: readonly { lyrics?: unknown }[] }) =>
      music.notes.filter((n) => n.lyrics !== undefined).length
    expect(words(playedMusic(performance))).toBe(1)
    expect(words(playedMusic(performance, { lyrics: false }))).toBe(0)
  })
})
