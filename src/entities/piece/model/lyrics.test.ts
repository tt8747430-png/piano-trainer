import { describe, expect, it } from 'vitest'
import type { Syllable } from '@/shared/lib/music'
import { ContentError } from './content-error'
import { parseChart } from './parse-chart'
import { parseStaff } from './parse-staff'
import {
  gatherLyrics,
  parseLyrics,
  readLyrics,
  singingNotes,
  tuneLength,
  withHandLyrics,
  withStaffLyrics,
  writeLyrics,
} from './lyrics'
import { testSong } from '../testing/test-pieces'

const syl = (text: string, hyphen = false, held = 0): Syllable => ({ text, hyphen, held })

describe('readLyrics', () => {
  it('reads a verse as syllables under the tune’s notes in order, a dash where a word goes on', () => {
    expect(readLyrics('A- ma- zing grace')).toEqual([
      syl('A', true),
      syl('ma', true),
      syl('zing'),
      syl('grace'),
    ])
  })

  it('holds a syllable over the next notes with an underscore each (a melisma), and leaves a place empty with ~', () => {
    expect(readLyrics('Si-_ lent night, ~ sleep__')).toEqual([
      syl('Si', true, 1),
      null,
      syl('lent'),
      syl('night,'),
      null,
      syl('sleep', false, 2),
      null,
      null,
    ])
  })

  it('reads nothing from an empty verse', () => {
    expect(readLyrics('')).toEqual([])
    expect(readLyrics('   ')).toEqual([])
  })
})

describe('writeLyrics', () => {
  it('writes a verse back as it was read', () => {
    for (const text of ['A- ma- zing grace', 'Si-_ lent night, ~ sleep__', 'one ~ ~ two'])
      expect(writeLyrics(readLyrics(text))).toBe(text)
  })

  it('writes a melisma over no more than the empty places that follow it', () => {
    expect(writeLyrics([syl('a', false, 1), null, syl('b')])).toBe('a_ b')
    expect(writeLyrics([syl('a', false, 1), syl('b')])).toBe('a b')
    expect(writeLyrics([syl('a', false, 1), null, null])).toBe('a_ ~')
    expect(writeLyrics([syl('a'), null, syl('b')])).toBe('a ~ b')
  })
})

describe('the tune a piece sings on', () => {
  const sung = testSong(['C G', 'C G'], { staves: [{ notes: 'C4/2 D4/2 | E4/4 | r/4 | G4/4' }] })

  it('is its single staff’s notes where the words are on one, else the right hand’s onsets, each chord one note', () => {
    expect(tuneLength(parseChart(sung), parseStaff(sung, 0))).toBe(4)
    const played = testSong(['C G'], { hands: { rh: 'C4+E4/1 G4/1 r/1 E4/.5 F4/.5 | C4/4' } })
    expect(tuneLength(parseChart(played), undefined)).toBe(5)
    expect(tuneLength(parseChart(testSong(['C'])), undefined)).toBe(0)
  })

  it('puts each verse on a single staff’s notes, trailing a verse that sings nothing there', () => {
    const staff = withStaffLyrics(parseStaff(sung, 0), [
      readLyrics('one two three four'),
      readLyrics('eins zwei'),
    ])
    expect(staff.map((n) => n.lyrics)).toEqual([
      [syl('one'), syl('eins')],
      [syl('two'), syl('zwei')],
      [syl('three')],
      [syl('four')],
    ])
    expect(gatherLyrics(staff).map(writeLyrics)).toEqual(['one two three four', 'eins zwei ~ ~'])
  })

  it('puts a verse on the right hand’s highest note at each onset where the words are on the upper staff', () => {
    const played = testSong(['C G'], { hands: { rh: 'C4+E4/1 G4/1 r/1 E4/.5 F4/.5 | C4/4' } })
    const chart = withHandLyrics(parseChart(played), [readLyrics('a- b_ c d')])
    const bars = chart.sections.flatMap((section) => section.lines.flat())
    const rh = bars.flatMap((bar) => bar.hands?.rh ?? [])
    expect(rh.map((n) => [n.midi, n.lyrics?.[0]?.text ?? null])).toEqual([
      [60, null],
      [64, 'a'],
      [67, 'b'],
      [64, null],
      [65, 'c'],
      [60, 'd'],
    ])
    // Each bar's notes are timed from its own start: the tune is gathered bar by bar.
    const tune = bars.flatMap((bar) => singingNotes(bar.hands?.rh ?? []))
    expect(gatherLyrics(tune).map(writeLyrics)).toEqual(['a- b_ c d'])
  })

  it('gives the verse to the right hand’s singing notes in time, however the bar writes them', () => {
    // The lower voice written first, then the upper from beat 1 (`@`): the upper sings first.
    const voiced = testSong(['C'], { hands: { rh: 'C4/2 D4/2 E5/1@1 F5/1@2' } })
    const chart = withHandLyrics(parseChart(voiced), [readLyrics('one two three')])
    const rh = chart.sections
      .flatMap((section) => section.lines.flat())
      .flatMap((bar) => bar.hands?.rh ?? [])
    expect(rh.map((n) => [n.midi, n.lyrics?.[0]?.text ?? null])).toEqual([
      [60, null],
      [62, 'three'],
      [76, 'one'],
      [77, 'two'],
    ])
  })

  it('sings a chord on the note that carries words, else its highest', () => {
    const low = { startTick: 0, midi: 60, lyrics: [syl('a')] }
    const high = { startTick: 0, midi: 64 }
    expect(singingNotes([low, high])).toEqual([low])
    expect(singingNotes([high, low])).toEqual([low])
    expect(singingNotes([{ startTick: 0, midi: 60 }, high, { startTick: 24, midi: 62 }])).toEqual([
      high,
      { startTick: 24, midi: 62 },
    ])
  })

  it('reads a piece’s verses, and names a verse longer than its tune', () => {
    expect(parseLyrics({ ...sung, lyrics: ['one two three four', 'eins'] }, 4)).toHaveLength(2)
    expect(parseLyrics(sung, 4)).toBeUndefined()
    let caught: unknown
    try {
      parseLyrics({ ...sung, lyrics: ['one two', 'one two three four five'] }, 4)
    } catch (error) {
      caught = error
    }
    expect(caught).toBeInstanceOf(ContentError)
    expect((caught as ContentError).position).toEqual({ verse: 2 })
  })
})
