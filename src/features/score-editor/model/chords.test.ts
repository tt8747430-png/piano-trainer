import { describe, expect, it } from 'vitest'
import { chordSymbol, note, parseChordSymbol } from '@/shared/lib/music'
import { draftOf, form } from '../testing/test-draft'
import { deleteChord, keyChords, setChord } from './chords'

describe('setChord', () => {
  it('replaces the chord starting there', () => {
    expect(form(setChord(draftOf(), 0, 0, parseChordSymbol('Em')))).toEqual([[['Em@0', 'C@0']]])
  })

  it('splits the bar at a later beat', () => {
    expect(form(setChord(draftOf(), 0, 24, parseChordSymbol('D7')))).toEqual([
      [['G@0 D7@24', 'C@0']],
    ])
  })

  it('keeps a chord’s method code, and gives a new one its bar’s', () => {
    const coded = draftOf({ sections: [{ kind: 'verse', lines: ['G:t1 C'] }] })
    const replaced = setChord(coded, 0, 0, parseChordSymbol('Em'))
    expect(replaced.sections[0]?.lines[0]?.[0]?.chords[0]?.method).toBe('t1')
    const added = setChord(coded, 0, 24, parseChordSymbol('D'))
    expect(added.sections[0]?.lines[0]?.[0]?.chords[1]?.method).toBe('t1')
  })
})

describe('deleteChord', () => {
  const split = draftOf({ sections: [{ kind: 'verse', lines: ['G-D-Em@2 C'] }] })

  it('gives its beats to the chord before it', () => {
    expect(form(deleteChord(split, 0, 12))).toEqual([[['G@0 Em@24', 'C@0']]])
  })

  it('gives a bar’s first chord’s beats to the one after', () => {
    expect(form(deleteChord(split, 0, 0))).toEqual([[['D@0 Em@24', 'C@0']]])
  })

  it('keeps a bar’s only chord', () => {
    const draft = draftOf()
    expect(deleteChord(draft, 1, 0)).toBe(draft)
  })
})

describe('keyChords', () => {
  it('gives a key’s seven triads and its V7', () => {
    expect(keyChords({ tonic: note('G'), minor: false }).map(chordSymbol)).toEqual([
      'G',
      'Am',
      'Bm',
      'C',
      'D',
      'Em',
      'F#°',
      'D7',
    ])
    expect(keyChords({ tonic: note('A'), minor: true }).map(chordSymbol)).toEqual([
      'Am',
      'B°',
      'C',
      'Dm',
      'Em',
      'F',
      'G',
      'E7',
    ])
  })
})
