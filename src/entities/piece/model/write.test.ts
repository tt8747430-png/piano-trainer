import { describe, expect, it } from 'vitest'
import {
  CHORD_QUALITIES,
  chordSymbol,
  midi,
  note,
  parseChordSymbol,
  TICKS_PER_BEAT,
  type Key,
} from '@/shared/lib/music'
import type { ChartBar, HandNote, Melody } from '@/shared/lib/arrangement'
import { readBeats, ticksIn } from './beats'
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
    expect([48, 36, 12, 6, 3, 54].map(beatsText)).toEqual(['2', '1.5', '.5', '.25', '.125', '2.25'])
  })

  it('writes thirds of a beat as a fraction in its lowest terms, which reads back as them', () => {
    expect([8, 16, 4, 40].map(beatsText)).toEqual(['1:3', '2:3', '1:6', '5:3'])
    for (const ticks of [8, 4, 40]) expect(ticksIn(readBeats(beatsText(ticks)) ?? 0)).toBe(ticks)
  })
})

describe('writeHand with marks', () => {
  it('writes a token’s marks after its beats, and reads them back', () => {
    const text = 'C4+E4/1[acc,stacc] G4/1@2[tr] r/1 A4/1[8va,(,p]'
    const parsed = parseChart(testSong(['C'], { hands: { rh: text } }))
    const bar = parsed.sections[0]?.lines[0]?.[0]
    expect(writeHand([bar?.hands?.rh ?? []], [4 * TICKS_PER_BEAT])).toBe(
      'C4+E4/1[acc,stacc] G4/1[tr] r/1 A4/1[(,8va,p]',
    )
  })

  it('writes notes struck together with other marks as tokens of their own', () => {
    const text = 'C4/4[acc] E4/4@1'
    const parsed = parseChart(testSong(['C'], { hands: { rh: text } }))
    const bar = parsed.sections[0]?.lines[0]?.[0]
    expect(writeHand([bar?.hands?.rh ?? []], [4 * TICKS_PER_BEAT])).toBe('C4/4[acc] E4/4@1')
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
    expect(firstBar(written)?.chords.map((chord) => chord.beats * 24)).toEqual([8, 88])
  })
})

const bars4 = [
  { startTick: 0, ticks: 96 },
  { startTick: 96, ticks: 96 },
]
const melodyNote = (m: number, startTick: number, durationTicks: number) => ({
  midi: midi(m),
  spelled: m === 61 ? note('C', 1) : note('E'),
  startTick,
  durationTicks,
})

describe('writeMelody', () => {
  it('writes notes and the rests between them, a bar line where one falls between notes', () => {
    const melody: Melody = [melodyNote(64, 24, 48), melodyNote(64, 96, 96)]
    expect(writeMelody(melody, bars4)).toBe('r/1 E4/2 r/1 | E4/4')
  })

  it('writes a note across a bar line as one note', () => {
    expect(writeMelody([melodyNote(61, 48, 96)], bars4)).toBe('r/2 C#4/4')
  })

  it('writes nothing for no notes', () => {
    expect(writeMelody([], bars4)).toBeUndefined()
  })

  it('writes a note’s marks after its beats, and reads them back', () => {
    const text = 'E4/1[stacc,p] r/1 E4/2[ferm]'
    const melody = parseMelody(testSong(['C'], { melody: text }))
    expect(melody?.[0]?.marks).toEqual({ articulations: ['staccato'], dynamic: 'p' })
    expect(writeMelody(melody ?? [], bars4)).toBe(text)
    expect(() => parseMelody(testSong(['C'], { melody: 'r/1[acc]' }))).toThrow()
  })

  it('reads back as written', () => {
    const melody: Melody = [melodyNote(64, 0, 8), melodyNote(61, 8, 88), melodyNote(64, 120, 24)]
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
  it('writes a silent bar as a rest, chords joined, fingers, and @ only where a note starts under another', () => {
    const written = writeHand(
      [
        [],
        [
          handNote(48, 0, 96, 1),
          handNote(52, 24, 24),
          handNote(55, 24, 24, 3),
          handNote(52, 48, 24),
          handNote(55, 48, 24),
        ],
      ],
      [96, 96],
    )
    expect(written).toBe('r/4 | C3^1/4 E3+G3^3/1@2 E3+G3/1')
  })

  it('writes every bar, a silent one as a rest of the bar’s length', () => {
    expect(writeHand([[], []], [96, 72])).toBe('r/4 | r/3')
  })

  it('reads back as written', () => {
    const notes = [handNote(48, 0, 144), handNote(52, 48, 24)]
    const text = writeHand([notes, [handNote(55, 72, 24)]], [96, 96])
    const bars = parseChart(testSong(['C G'], { hands: { lh: text } })).sections[0]?.lines[0]
    expect(bars?.map((read) => read.hands?.lh)).toEqual([notes, [handNote(55, 72, 24)]])
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
