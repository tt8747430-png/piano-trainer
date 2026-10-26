import { describe, expect, it } from 'vitest'
import {
  C_MAJOR,
  keyFromParam,
  keySymbol,
  keyParam,
  keyPrefersSharps,
  keySignature,
  parseKey,
  signatureKey,
  signatureNotes,
  SIGNATURE_COUNTS,
  tonicSpelling,
  transposedKey,
  transposeNote,
  transposition,
  writtenKey,
  writtenKeyAccidentals,
  type Key,
} from './key'
import { note, noteName, rootSpelling } from './note'
import { pitchClass } from './pitch'

const key = (text: string): Key => {
  const parsed = parseKey(text)
  if (!parsed) throw new Error(`test key ${text} did not parse`)
  return parsed
}

describe('C_MAJOR', () => {
  it('is the key of C, major, as a URL and a symbol write it', () => {
    expect(keySymbol(C_MAJOR)).toBe('C')
    expect(keyParam(C_MAJOR)).toBe('C')
    expect(keySignature(C_MAJOR)).toBe(0)
  })
})

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

describe('keySymbol', () => {
  it.each([
    ['C', 'C'],
    ['F#', 'F#'],
    ['Bbm', 'B♭m'],
    ['G#m', 'G#m'],
  ])('%s is named %s', (text, name) => {
    expect(keySymbol(key(text))).toBe(name)
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
    // A note on the staff keeps a double sharp: E minor's D♯ is G♯ minor's F𝄪.
    expect(transposeNote(note('D', 1), note('E'), note('G', 1), 2)).toEqual(note('F', 2))
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

describe('transposedKey', () => {
  it.each([
    ['C', -1, 'B'],
    ['C', 1, 'D♭'],
    ['F', 1, 'F#'],
    ['G', -1, 'F#'],
    ['Dm', 1, 'E♭m'],
    ['Am', -1, 'G#m'],
    ['Dm', -4, 'B♭m'],
    ['Em', -3, 'C#m'],
  ])('moves %s by %i semitones to %s, the key its simplest signature writes', (from, by, to) => {
    expect(keySymbol(transposedKey(key(from), by))).toBe(to)
  })

  it('keeps the key as written where it does not move, or moves a whole octave', () => {
    expect(transposedKey(key('Gb'), 0)).toEqual(key('Gb'))
    expect(transposedKey(key('C#'), 12)).toEqual(key('C#'))
    expect(transposedKey(key('D#m'), -12)).toEqual(key('D#m'))
  })

  it('lands every key in one of six sharps or flats at most', () => {
    for (const from of ['C', 'C#', 'Gb', 'Am', 'D#m', 'Abm']) {
      for (let by = -11; by <= 11; by++) {
        if (by === 0) continue
        expect(Math.abs(keySignature(transposedKey(key(from), by))), `${from} ${by}`).toBeLessThan(
          7,
        )
      }
    }
  })
})

describe('transposition', () => {
  it.each([
    ['C', 'B', -1],
    ['C', 'D', 2],
    ['C', 'F#', 6],
    ['C', 'Gb', 6],
    ['C', 'G', -5],
    ['D', 'A', -5],
    ['Gb', 'F#', 0],
  ])('moves the music from %s to %s by %i semitones, the short way', (from, to, semitones) => {
    expect(transposition(key(from).tonic, key(to).tonic)).toBe(semitones)
  })
})

describe('keyParam', () => {
  it('writes a key as a URL does and reads it back', () => {
    expect(keyParam({ tonic: note('E', -1), minor: false })).toBe('Eb')
    expect(keyParam({ tonic: note('C', 1), minor: true })).toBe('C#m')
    expect(keyFromParam(keyParam({ tonic: note('B', -1), minor: true }))).toEqual({
      tonic: note('B', -1),
      minor: true,
    })
  })
})

describe('signatureNotes', () => {
  it('names a signature’s sharps or flats in the order they are written', () => {
    expect(signatureNotes(key('Eb')).map(noteName)).toEqual(['B♭', 'E♭', 'A♭'])
    expect(signatureNotes(key('F#m')).map(noteName)).toEqual(['F#', 'C#', 'G#'])
    expect(signatureNotes(key('Am'))).toEqual([])
  })
})

describe('the written keys', () => {
  it('offers the accidentals that make one of the 30 keys a signature writes', () => {
    expect(writtenKeyAccidentals('C', false)).toEqual([0, 1, -1])
    expect(writtenKeyAccidentals('D', false)).toEqual([0, -1])
    expect(writtenKeyAccidentals('D', true)).toEqual([0, 1])
    expect(writtenKeyAccidentals('B', false)).toEqual([0, -1])
    expect(writtenKeyAccidentals('A', true)).toEqual([0, 1, -1])
    expect(writtenKeyAccidentals('F', true)).toEqual([0, 1])
  })

  it('keeps a key as written, and respells one no signature writes', () => {
    expect(writtenKey(key('C#m'))).toEqual(key('C#m'))
    expect(writtenKey(key('Db'))).toEqual(key('Db'))
    expect(writtenKey(key('C#'))).toEqual(key('C#'))
    expect(writtenKey(key('Dbm'))).toEqual(key('C#m'))
    expect(writtenKey(key('D#'))).toEqual(key('Eb'))
  })
})

describe('signatureKey (ADR 0110)', () => {
  it('names the key each signature writes, major or minor', () => {
    expect(signatureKey(0, false)).toEqual({ tonic: note('C'), minor: false })
    expect(signatureKey(0, true)).toEqual({ tonic: note('A'), minor: true })
    expect(signatureKey(3, true)).toEqual({ tonic: note('F', 1), minor: true })
    expect(signatureKey(-3, false)).toEqual({ tonic: note('E', -1), minor: false })
    expect(signatureKey(7, false)).toEqual({ tonic: note('C', 1), minor: false })
    expect(signatureKey(-7, true)).toEqual({ tonic: note('A', -1), minor: true })
  })

  it('is the key whose signature it is, for each of the fifteen', () => {
    for (const count of SIGNATURE_COUNTS)
      for (const minor of [false, true])
        expect(keySignature(signatureKey(count, minor))).toBe(count)
  })
})
