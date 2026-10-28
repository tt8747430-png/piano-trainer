import { describe, expect, it } from 'vitest'
import { chordSymbol, note, parseChordSymbol, TICKS_PER_BEAT } from '@/shared/lib/music'
import { draftOf, form } from '../testing/test-draft'
import { chordSuggestions, deleteChord, keyChords, setChord } from './chords'

const B = TICKS_PER_BEAT

describe('setChord', () => {
  it('replaces the chord starting there', () => {
    expect(form(setChord(draftOf(), 0, 0, parseChordSymbol('Em')))).toEqual([[['Em@0', 'C@0']]])
  })

  it('splits the bar at a later beat', () => {
    expect(form(setChord(draftOf(), 0, 2 * B, parseChordSymbol('D7')))).toEqual([
      [['G@0 D7@2', 'C@0']],
    ])
  })

  it('sets a chord into a bar of no chord at its start, where a bar’s chords begin (ADR 0114)', () => {
    const empty = draftOf({ sections: [{ kind: 'verse', lines: ['G _'] }] })
    expect(form(setChord(empty, 1, 0, parseChordSymbol('Em')))).toEqual([[['G@0', 'Em@0']]])
    expect(form(setChord(empty, 1, 48, parseChordSymbol('Em')))).toEqual([[['G@0', 'Em@0']]])
  })

  it('keeps a chord’s method code, and gives a new one its bar’s', () => {
    const coded = draftOf({ sections: [{ kind: 'verse', lines: ['G:t1 C'] }] })
    const replaced = setChord(coded, 0, 0, parseChordSymbol('Em'))
    expect(replaced.sections[0]?.lines[0]?.[0]?.chords[0]?.method).toBe('t1')
    const added = setChord(coded, 0, 48, parseChordSymbol('D'))
    expect(added.sections[0]?.lines[0]?.[0]?.chords[1]?.method).toBe('t1')
  })
})

describe('deleteChord', () => {
  const split = draftOf({ sections: [{ kind: 'verse', lines: ['G-D-Em@2 C'] }] })

  it('gives its beats to the chord before it', () => {
    expect(form(deleteChord(split, 0, B))).toEqual([[['G@0 Em@2', 'C@0']]])
  })

  it('gives a bar’s first chord’s beats to the one after', () => {
    expect(form(deleteChord(split, 0, 0))).toEqual([[['D@0 Em@2', 'C@0']]])
  })

  it('takes a bar’s only chord, leaving a bar of no chord (ADR 0114)', () => {
    expect(form(deleteChord(draftOf(), 1, 0))).toEqual([[['G@0', '']]])
  })

  it('changes nothing where no chord starts', () => {
    const draft = draftOf()
    expect(deleteChord(draft, 1, B)).toBe(draft)
    const empty = draftOf({ sections: [{ kind: 'verse', lines: ['G _'] }] })
    expect(deleteChord(empty, 1, 0)).toBe(empty)
  })
})

describe('keyChords', () => {
  it('gives a key’s triads I to vii, then its sevenths (a minor key’s V7 from its harmonic minor)', () => {
    expect(keyChords({ tonic: note('G'), minor: false }).map(chordSymbol)).toEqual([
      'G',
      'Am',
      'Bm',
      'C',
      'D',
      'Em',
      'F#°',
      'GMaj7',
      'Am7',
      'Bm7',
      'CMaj7',
      'D7',
      'Em7',
      'F#m7♭5',
    ])
    expect(keyChords({ tonic: note('A'), minor: true }).map(chordSymbol)).toEqual([
      'Am',
      'B°',
      'C',
      'Dm',
      'Em',
      'F',
      'G',
      'Am7',
      'Bm7♭5',
      'CMaj7',
      'Dm7',
      'E7',
      'FMaj7',
      'G7',
    ])
  })
})

describe('chordSuggestions', () => {
  const song = draftOf({
    sections: [
      { kind: 'verse', lines: ['G Bb7 C'] },
      { kind: 'chorus', key: 'D', lines: ['D Bb7'] },
    ],
  })
  const symbols = (...args: Parameters<typeof chordSuggestions>) =>
    chordSuggestions(...args).map(chordSymbol)

  it('offers the key’s chords, then the song’s own it lacks, each once', () => {
    expect(symbols(song, 0, '')).toEqual([
      ...['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#°'],
      ...['GMaj7', 'Am7', 'Bm7', 'CMaj7', 'D7', 'Em7', 'F#m7♭5'],
      'B♭7',
    ])
  })

  it('takes the key at the place: a section’s own key there (ADR 0114)', () => {
    expect(symbols(song, 12 * B, '').slice(0, 7)).toEqual(['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#°'])
  })

  it('keeps those starting as typed, in any case and with ♯ or #', () => {
    expect(symbols(song, 0, 'b')).toEqual(['Bm', 'Bm7', 'B♭7'])
    expect(symbols(song, 0, 'bB')).toEqual(['B♭7'])
    expect(symbols(song, 0, ' f♯m')).toEqual(['F#m7♭5'])
    expect(symbols(song, 0, 'Cmaj9')).toEqual([])
  })
})
