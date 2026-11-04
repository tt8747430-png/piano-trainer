import { describe, expect, it } from 'vitest'
import {
  chordSymbol,
  midi,
  note,
  parseKey,
  spellChord,
  spellScale,
  type ChordQuality,
  type Key,
  type SpelledNote,
} from '@/shared/lib/music'
import { voiceCadence } from './ladders/cadences'
import type { Question } from './round-machine'
import { notePlace, whyAnswer } from './why'

const key = (text: string): Key => {
  const read = parseKey(text)
  if (!read) throw new Error(text)
  return read
}

const chord = (root: SpelledNote, quality: ChordQuality, inversion: number | null = null) =>
  ({
    mode: 'build-chord',
    root,
    quality,
    symbol: chordSymbol({ root, quality }),
    tones: spellChord(root, quality),
    inversion,
  }) as const satisfies Question

describe('whyAnswer', () => {
  it('says a chord’s notes, its formula and its quality on its root', () => {
    expect(whyAnswer(chord(note('F'), 'maj'))).toEqual({
      key: 'chord',
      values: { notes: 'F A C', formula: '1 3 5', quality: 'maj', root: 'F' },
    })
    expect(whyAnswer(chord(note('D'), 'm7')).values).toMatchObject({
      notes: 'D F A C',
      formula: '1 ♭3 5 ♭7',
    })
    expect(whyAnswer(chord(note('B'), 'hd')).values).toMatchObject({
      notes: 'B D F A',
      formula: '1 ♭3 ♭5 ♭7',
    })
  })

  it('names the bass of an inversion', () => {
    expect(whyAnswer(chord(note('C'), 'maj', 1))).toEqual({
      key: 'inversion',
      values: expect.objectContaining({ position: 1, bass: 'E', notes: 'C E G' }) as unknown,
    })
  })

  it('counts an interval’s letter names and its semitones, past the octave too', () => {
    const interval = (
      name: 'P5' | 'M9' | 'A4' | 'm3',
      low: number,
      high: number,
      lowNote: SpelledNote,
      highNote: SpelledNote,
    ): Question => ({
      mode: 'build-interval',
      interval: name,
      low: midi(low),
      high: midi(high),
      lowNote,
      highNote,
      way: 'up',
    })
    expect(whyAnswer(interval('P5', 60, 67, note('C'), note('G'))).values).toMatchObject({
      low: 'C',
      high: 'G',
      number: 5,
      count: 7,
    })
    expect(whyAnswer(interval('M9', 60, 74, note('C'), note('D'))).values).toMatchObject({
      number: 9,
      count: 14,
    })
    expect(whyAnswer(interval('A4', 60, 66, note('C'), note('F', 1))).values).toMatchObject({
      high: 'F♯',
      number: 4,
      count: 6,
    })
    expect(whyAnswer(interval('m3', 69, 72, note('A'), note('C'))).values).toMatchObject({
      number: 3,
      count: 3,
    })
  })

  it('spells a scale and its steps, a harmonic minor’s step and a half included', () => {
    const scale = (root: SpelledNote, kind: 'major' | 'harmonic'): Question => ({
      mode: 'build-scale',
      root,
      kind,
      notes: spellScale(root, kind),
    })
    expect(whyAnswer(scale(note('D'), 'major')).values).toEqual({
      root: 'D',
      notes: 'D E F♯ G A B C♯',
      kind: 'major',
      steps: '2 2 1 2 2 2 1',
    })
    expect(whyAnswer(scale(note('A'), 'harmonic')).values).toMatchObject({
      notes: 'A B C D E F G♯',
      steps: '2 1 2 2 1 3 1',
    })
  })

  it('places a note on its staff as players count lines and spaces', () => {
    const at = (n: number, spelled: SpelledNote, clef: 'treble' | 'bass') =>
      notePlace(midi(n), spelled, clef)
    expect(at(64, note('E'), 'treble')).toBe('line1')
    expect(at(65, note('F'), 'treble')).toBe('space1')
    expect(at(71, note('B'), 'treble')).toBe('line3')
    expect(at(77, note('F'), 'treble')).toBe('line5')
    expect(at(62, note('D'), 'treble')).toBe('under')
    expect(at(60, note('C'), 'treble')).toBe('ledgerBelow:1')
    expect(at(59, note('B'), 'treble')).toBe('byLedgerBelow:1')
    expect(at(79, note('G'), 'treble')).toBe('over')
    expect(at(81, note('A'), 'treble')).toBe('ledgerAbove:1')
    expect(at(43, note('G'), 'bass')).toBe('line1')
    expect(at(57, note('A'), 'bass')).toBe('line5')
    expect(at(60, note('C'), 'bass')).toBe('ledgerAbove:1')
    // B♯3 sounds as C4 but is written a step lower: just over the bass staff.
    expect(at(60, note('B', 1), 'bass')).toBe('over')
    expect(
      whyAnswer({ mode: 'read-note', key: midi(57), spelled: note('A'), clef: 'bass' }),
    ).toEqual({ key: 'note', values: { note: 'A3', clef: 'bass', place: 'line5' } })
  })

  it('lists a key’s sharps or flats in the order they are written', () => {
    const signature = (text: string): Question => ({
      mode: 'key-signature',
      key: key(text),
      ask: 'count',
      options: [],
      answer: '',
    })
    expect(whyAnswer(signature('D'))).toEqual({
      key: 'signature',
      values: { key: 'D', count: 2, sign: 'sharps', notes: 'F♯ C♯' },
    })
    expect(whyAnswer(signature('Fm')).values).toMatchObject({
      count: 4,
      sign: 'flats',
      notes: 'B♭ E♭ A♭ D♭',
    })
    expect(whyAnswer(signature('Am'))).toEqual({ key: 'noSignature', values: { key: 'Am' } })
  })

  it('builds a numeral’s chord on its degree of the key', () => {
    const role = (text: string, numeral: string): Question => ({
      mode: 'chord-role',
      key: key(text),
      numeral,
      tonicKeys: [],
      chordKeys: [],
      options: [],
    })
    expect(whyAnswer(role('G', 'IV')).values).toEqual({
      key: 'G',
      numeral: 'IV',
      degree: 4,
      root: 'C',
      notes: 'C E G',
    })
    // A minor key's V is major: its leading note raised.
    expect(whyAnswer(role('Am', 'V')).values).toMatchObject({ degree: 5, notes: 'E G♯ B' })
    expect(whyAnswer(role('C', 'vii°')).values).toMatchObject({ degree: 7, notes: 'B D F' })
  })

  it('spells a progression’s chords in its key', () => {
    expect(
      whyAnswer({
        mode: 'name-progression',
        key: key('C'),
        line: 'I V vi IV',
        tonicKeys: [],
        chordKeys: [],
        options: [],
      }).values,
    ).toEqual({ key: 'C', numerals: 'I–V–vi–IV', chords: 'C – G – Am – F' })
  })

  it('writes a cadence’s chords as numerals', () => {
    const cadence = (name: 'plagal' | 'imperfect' | 'phrygian', text: string): Question => ({
      mode: 'name-cadence',
      cadence: name,
      key: key(text),
      voicing: voiceCadence(name, key(text)),
      heard: false,
      options: [],
    })
    expect(whyAnswer(cadence('plagal', 'C')).values).toEqual({
      cadence: 'plagal',
      numerals: 'IV–I',
      key: 'C',
    })
    expect(whyAnswer(cadence('imperfect', 'G')).values).toMatchObject({ numerals: 'V6–I' })
    expect(whyAnswer(cadence('phrygian', 'Am')).values).toMatchObject({ numerals: 'iv6–V' })
  })
})
