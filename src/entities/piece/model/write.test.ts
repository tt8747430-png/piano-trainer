import { describe, expect, it } from 'vitest'
import {
  CHORD_QUALITIES,
  chordSymbol,
  midi,
  note,
  parseChordSymbol,
  type Key,
} from '@/shared/lib/music'
import type { ChartBar, HandNote, Melody } from '@/shared/lib/arrangement'
import { ticksIn } from './beats'
import { keyText, musicOf, pitchText, sameMusic } from './music'
import { parseChart } from './parse-chart'
import { parseMelody } from './parse-melody'
import { testSong } from '../testing/test-pieces'
import { beatsText, writeBar } from './write-chart'
import { writeHand } from './write-hands'
import { writeMelody } from './write-melody'

const bar = (...chords: [string, number, string?][]): ChartBar => ({
  chords: chords.map(([symbol, beats, method]) => ({
    ...parseChordSymbol(symbol),
    beats,
    ...(method ? { method } : {}),
  })),
  beats: chords.reduce((sum, [, beats]) => sum + beats, 0),
})
const firstBar = (line: string) => parseChart(testSong([line])).sections[0]?.lines[0]?.[0]

describe('beatsText', () => {
  it('writes ticks as beats in the shortest decimal that reads back as them', () => {
    expect([24, 18, 6, 3, 27].map(beatsText)).toEqual(['2', '1.5', '.5', '.25', '2.25'])
    expect(beatsText(4)).toBe('.3333333333')
    expect(ticksIn(Number(beatsText(4)))).toBe(4)
    expect(ticksIn(Number(beatsText(20)))).toBe(20)
  })
})

describe('writeBar', () => {
  it('leaves out beats where the chords share a full bar equally', () => {
    expect(writeBar(bar(['G', 2], ['C', 2]), '4/4')).toBe('G-C')
    expect(writeBar(bar(['Am7', 4]), '4/4')).toBe('Am7')
  })

  it('gives every chord its beats otherwise, in the shortest decimal', () => {
    expect(writeBar(bar(['C', 1], ['G', 3]), '4/4')).toBe('C@1-G@3')
    expect(writeBar(bar(['Fm', 1]), '4/4')).toBe('Fm@1')
    expect(writeBar(bar(['C', 1.5], ['G', 0.5]), '4/4')).toBe('C@1.5-G@.5')
  })

  it('writes a method code once when every chord shares it, else on each', () => {
    expect(writeBar(bar(['C', 2, 't1'], ['F', 2, 't1']), '4/4')).toBe('C:t1-F')
    expect(writeBar(bar(['C', 2, 't1'], ['F', 2, '3ch']), '4/4')).toBe('C:t1-F:3ch')
  })

  it('writes every chord quality and slash chord so the chart reads it back', () => {
    for (const quality of CHORD_QUALITIES) {
      const chord = { root: note('F', 1), quality, bass: note('C', 1) }
      const written = writeBar({ chords: [{ ...chord, beats: 4 }], beats: 4 }, '4/4')
      expect(firstBar(written)?.chords.map(chordSymbol)).toEqual([chordSymbol(chord)])
    }
  })

  it('reads back thirds of a beat exactly', () => {
    const written = writeBar(bar(['C', 1 / 3], ['G', 11 / 3]), '4/4')
    expect(firstBar(written)?.chords.map((chord) => chord.beats * 12)).toEqual([4, 44])
  })
})

const bars4 = [
  { startTick: 0, ticks: 48 },
  { startTick: 48, ticks: 48 },
]
const melodyNote = (m: number, startTick: number, durationTicks: number) => ({
  midi: midi(m),
  spelled: m === 61 ? note('C', 1) : note('E'),
  startTick,
  durationTicks,
})

describe('writeMelody', () => {
  it('writes notes and the rests between them, a bar line where one falls between notes', () => {
    const melody: Melody = [melodyNote(64, 12, 24), melodyNote(64, 48, 48)]
    expect(writeMelody(melody, bars4)).toBe('r/1 E4/2 r/1 | E4/4')
  })

  it('writes a note across a bar line as one note', () => {
    expect(writeMelody([melodyNote(61, 24, 48)], bars4)).toBe('r/2 C#4/4')
  })

  it('writes nothing for no notes', () => {
    expect(writeMelody([], bars4)).toBeUndefined()
  })

  it('reads back as written', () => {
    const melody: Melody = [melodyNote(64, 0, 4), melodyNote(61, 4, 44), melodyNote(64, 60, 12)]
    const text = writeMelody(melody, bars4)
    expect(parseMelody(testSong(['C C'], { melody: text }))).toEqual(melody)
  })
})

const handNote = (
  m: number,
  startTick: number,
  durationTicks: number,
  finger?: 1 | 3,
): HandNote => ({
  midi: midi(m),
  spelled: { 48: note('C'), 52: note('E'), 55: note('G') }[m] ?? note('C'),
  startTick,
  durationTicks,
  ...(finger ? { finger } : {}),
})

describe('writeHand', () => {
  it('writes the pattern’s bars as -, chords joined, fingers, and @ only where a note starts under another', () => {
    const written = writeHand(
      [
        null,
        [
          handNote(48, 0, 48, 1),
          handNote(52, 12, 12),
          handNote(55, 12, 12, 3),
          handNote(52, 24, 12),
          handNote(55, 24, 12),
        ],
      ],
      [48, 48],
    )
    expect(written).toBe('- | C3^1/4 E3+G3^3/1@2 E3+G3/1')
  })

  it('writes a written bar of silence as a rest, and nothing for a hand written nowhere', () => {
    expect(writeHand([[], null], [48, 48])).toBe('r/4 | -')
    expect(writeHand([null, null], [48, 48])).toBeUndefined()
  })

  it('reads back as written', () => {
    const notes = [handNote(48, 0, 72), handNote(52, 24, 12)]
    const text = writeHand([notes, [handNote(55, 36, 12)]], [48, 48])
    const bars = parseChart(testSong(['C G'], { hands: { lh: text } })).sections[0]?.lines[0]
    expect(bars?.map((read) => read.hands?.lh)).toEqual([notes, [handNote(55, 36, 12)]])
  })
})

describe('the music of a piece', () => {
  it('writes a key as content does', () => {
    const keys: Key[] = [
      { tonic: note('G'), minor: false },
      { tonic: note('F', 1), minor: true },
      { tonic: note('E', -1), minor: true },
    ]
    expect(keys.map(keyText)).toEqual(['G', 'F#m', 'Ebm'])
  })

  it('writes a pitch in ASCII with its written octave', () => {
    expect(pitchText({ midi: midi(60), spelled: note('B', 1) })).toBe('B#3')
    expect(pitchText({ midi: midi(57), spelled: note('B', -2) })).toBe('Bbb3')
  })

  it('takes a piece’s music, and tells equal music apart from changed', () => {
    const song = testSong(['C G'], { melody: 'E4/4' })
    const music = musicOf(song)
    expect(music).toEqual({
      key: 'C',
      meter: '4/4',
      tempo: 72,
      pattern: 'r4',
      sections: [{ kind: 'verse', lines: ['C G'] }],
      melody: 'E4/4',
    })
    expect(sameMusic(music, { ...music, sections: [{ lines: ['C G'], kind: 'verse' }] })).toBe(true)
    expect(sameMusic(music, { ...music, tempo: 80 })).toBe(false)
    expect(sameMusic(music, { ...music, hands: { lh: '- | r/4' } })).toBe(false)
  })
})
