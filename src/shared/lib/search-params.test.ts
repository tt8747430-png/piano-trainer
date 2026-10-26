import { describe, expect, it } from 'vitest'
import { isOneOf } from './is-one-of'
import { midi, note } from './music'
import {
  chordListParam,
  keyListParam,
  readChordList,
  readKeyList,
  readNote,
  readText,
  valueOr,
  wholeIn,
} from './search-params'

const isMode = isOneOf(['listen', 'step', 'wait'] as const)

describe('valueOr', () => {
  it('keeps a value the guard accepts and replaces anything else', () => {
    expect(valueOr(isMode, 'step', 'listen')).toBe('step')
    expect(valueOr(isMode, 'dance', 'listen')).toBe('listen')
    expect(valueOr(isMode, 3, 'listen')).toBe('listen')
  })
})

describe('readText', () => {
  it('keeps text as typed, and a number as written, which the router reads out of `?q=1999`', () => {
    expect(readText('Yesterday', '')).toBe('Yesterday')
    expect(readText(1999, '')).toBe('1999')
    expect(readText(undefined, 'C')).toBe('C')
    expect(readText(['a'], 'C')).toBe('C')
  })
})

describe('wholeIn', () => {
  it('reads a whole number in range, written as a number or as text', () => {
    expect(wholeIn(72, 40, 160, 80)).toBe(72)
    expect(wholeIn('96', 40, 160, 80)).toBe(96)
  })

  it('falls back for anything out of range, fractional or not a number', () => {
    for (const raw of [999, 39, 72.5, 'fast', '', null, undefined, [72]]) {
      expect(wholeIn(raw, 40, 160, 80)).toBe(80)
    }
  })

  it('falls back to nothing when the default is not known here', () => {
    expect(wholeIn('fast', 40, 160, undefined)).toBeUndefined()
  })
})

describe('readNote', () => {
  it('reads a note with at most one sharp or flat', () => {
    expect(readNote('Bb')).toEqual(note('B', -1))
    expect(readNote('B♭')).toEqual(note('B', -1))
    expect(readNote('F#')).toEqual(note('F', 1))
  })

  it('reads nothing from a double accidental, H, lower case or not a note', () => {
    for (const raw of ['Ebb', 'H', 'c', '', 7]) expect(readNote(raw)).toBeNull()
  })
})

describe('readKeyList', () => {
  it('reads keys written 60-64-67: whole numbers on the piano, each once, lowest first', () => {
    expect(readKeyList('67-60-64-60')).toEqual([60, 64, 67])
    expect(readKeyList(60)).toEqual([60])
    expect(readKeyList('60-x-200-64')).toEqual([60, 64])
    expect(readKeyList(undefined)).toEqual([])
  })

  it('writes them back the same way', () => {
    expect(keyListParam([midi(67), midi(60), midi(64)])).toBe('60-64-67')
    expect(keyListParam([])).toBe('')
  })
})

describe('readChordList', () => {
  it('reads chord symbols as they are written, each once, a bass left out', () => {
    expect(readChordList('C.G.Bb.F#m7b5.Am7.C/E.G')).toEqual(['C', 'G', 'B♭', 'F#m7♭5', 'Am7'])
  })

  it('reads none from anything else, and leaves out what is not a chord', () => {
    expect(readChordList(undefined)).toEqual([])
    expect(readChordList(7)).toEqual([])
    expect(readChordList('C.H.zz..G')).toEqual(['C', 'G'])
  })

  it('reads at most a hundred', () => {
    const roots = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C#', 'Eb', 'F#', 'Ab', 'Bb']
    const kinds = ['', 'm', '7', 'm7', 'Maj7', 'sus4', 'sus2', '6', 'm6', '9', 'dim']
    const many = roots.flatMap((root) => kinds.map((kind) => root + kind))
    expect(many).toHaveLength(132)
    expect(readChordList(many.join('.'))).toHaveLength(100)
  })
})

describe('chordListParam', () => {
  it('writes chords as a URL holds them, in ASCII and in one order, and reads back', () => {
    const param = chordListParam(['G', 'B♭', 'F#m7♭5', 'C'])
    expect(param).toBe('Bb.C.F#m7b5.G')
    expect(readChordList(param)).toEqual(['B♭', 'C', 'F#m7♭5', 'G'])
  })
})
