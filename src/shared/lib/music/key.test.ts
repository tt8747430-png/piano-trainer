import { describe, expect, it } from 'vitest'
import {
  keyName,
  keyPrefersSharps,
  keySignature,
  parseKey,
  tonicSpelling,
  transposeNote,
  type Key,
} from './key'
import { note, noteName, rootSpelling } from './note'
import { pitchClass } from './pitch'

const key = (text: string): Key => {
  const parsed = parseKey(text)
  if (!parsed) throw new Error(`test key ${text} did not parse`)
  return parsed
}

describe('parseKey', () => {
  it.each([
    ['G', { tonic: note('G'), minor: false }],
    ['G#m', { tonic: note('G', 1), minor: true }],
    ['Ebm', { tonic: note('E', -1), minor: true }],
    ['B♭', { tonic: note('B', -1), minor: false }],
  ])('reads %s', (text, expected) => {
    expect(parseKey(text)).toEqual(expected)
  })

  it.each(['H', 'Xm', 'm', ''])('refuses %j', (text) => {
    expect(parseKey(text)).toBeNull()
  })
})

describe('keyName', () => {
  it.each([
    ['C', 'C'],
    ['F#', 'F#'],
    ['Bbm', 'B♭m'],
    ['G#m', 'G#m'],
  ])('%s is named %s', (text, name) => {
    expect(keyName(key(text))).toBe(name)
  })
})

describe('keySignature', () => {
  it.each([
    ['C', 0],
    ['G', 1],
    ['F', -1],
    ['F#', 6],
    ['Db', -5],
    ['Am', 0],
    ['G#m', 5],
    ['Ebm', -6],
    ['Bm', 2],
    ['Dm', -1],
  ])('%s has %i', (text, signature) => {
    expect(keySignature(key(text))).toBe(signature)
  })
})

describe('keyPrefersSharps', () => {
  it.each([
    ['C', false],
    ['D', true],
    ['Dm', false],
    ['Em', true],
  ])('%s → %s', (text, sharps) => {
    expect(keyPrefersSharps(key(text))).toBe(sharps)
  })
})

describe('tonicSpelling', () => {
  it.each([
    [1, 'major', 'D♭'],
    [1, 'minor', 'C#'],
    [8, 'minor', 'G#'],
    [3, 'minor', 'E♭'],
    [10, 'minor', 'B♭'],
  ] as const)('pc %i in %s → %s', (pc, key, name) => {
    expect(noteName(tonicSpelling(pitchClass(pc), key === 'minor'))).toBe(name)
  })
})

describe('transposeNote', () => {
  it.each([
    [note('D'), note('G'), note('A', -1), note('E', -1)],
    [note('F', 1), note('G'), note('A', -1), note('G')],
    [note('E'), note('G', 1), note('A', 1), note('F', 1)],
    [note('D', 1), note('G', 1), note('A', 1), note('E', 1)],
  ])('keeps the interval: %j from %j to %j → %j', (spelled, from, to, expected) => {
    expect(transposeNote(spelled, from, to)).toEqual(expected)
  })

  it('falls back to the plain spelling where a double accidental would be needed', () => {
    expect(transposeNote(note('A', 1), note('C'), note('C', 1))).toEqual(note('B'))
  })

  it('leaves every root unchanged when the tonic stays', () => {
    for (let pc = 0; pc < 12; pc++) {
      for (const sharps of [true, false]) {
        const root = rootSpelling(pitchClass(pc), sharps)
        expect(transposeNote(root, note('G'), note('G'))).toEqual(root)
      }
    }
  })
})
