import { describe, expect, it } from 'vitest'
import {
  chordSymbol,
  note,
  numeralChord,
  parseNumerals,
  type ChordSize,
  type Key,
} from '@/shared/lib/music'
import {
  COMMON_PROGRESSIONS,
  LIBRARY_BY_STYLE,
  libraryLine,
  libraryParam,
  libraryProgression,
  otherModeVersion,
  progressionById,
} from '../index'
import { PROGRESSION_STYLES } from '../model/types'
import { PROGRESSION_LIBRARY } from './library'

const C_MAJOR = { tonic: note('C'), minor: false }

/** A progression's chords in a key at a chord size, as the Progressions page shows them. */
const chordsOf = (id: string, key: Key, size: ChordSize): string[] =>
  (parseNumerals(progressionById(id)?.numerals ?? '') ?? []).map((numeral) =>
    chordSymbol(numeralChord(numeral, key, size)),
  )

describe('the progressions library', () => {
  it('has unique ids, every name in English and Russian', () => {
    const ids = PROGRESSION_LIBRARY.map((each) => each.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const each of PROGRESSION_LIBRARY) {
      expect(each.name.en.trim(), each.id).not.toBe('')
      expect(each.name.ru.trim(), each.id).not.toBe('')
    }
  })

  it('writes every progression in numerals the kernel reads', () => {
    for (const each of PROGRESSION_LIBRARY)
      expect(parseNumerals(each.numerals), each.id).not.toBeNull()
  })

  it('has a progression in every style, the minor ones in their own', () => {
    for (const style of PROGRESSION_STYLES) {
      expect(
        PROGRESSION_LIBRARY.some((each) => each.style === style),
        style,
      ).toBe(true)
    }
    for (const each of PROGRESSION_LIBRARY) expect(each.minor, each.id).toBe(each.style === 'minor')
  })

  it('writes each line of numerals once in its mode, so a line names its progression', () => {
    const lines = PROGRESSION_LIBRARY.map((each) => `${each.minor} ${libraryParam(each)}`)
    expect(new Set(lines).size).toBe(lines.length)
    for (const each of PROGRESSION_LIBRARY)
      expect(libraryProgression(libraryParam(each), each.minor), each.id).toBe(each)
    expect(libraryProgression('I-I-I', false)).toBeUndefined()
    expect(libraryProgression('I-V-vi-IV', true)).toBeUndefined()
  })

  it('holds a loop once: no progression is another with a chord held', () => {
    const loops = PROGRESSION_LIBRARY.map((each) => {
      const chords = libraryParam(each).split('-')
      return `${each.minor} ${chords.filter((chord, at) => chord !== chords[at - 1]).join('-')}`
    })
    expect(new Set(loops).size).toBe(loops.length)
  })

  it('says a note in both languages', () => {
    for (const each of PROGRESSION_LIBRARY) {
      if (!each.note) continue
      expect(each.note.en.trim(), each.id).not.toBe('')
      expect(each.note.ru.trim(), each.id).not.toBe('')
    }
  })

  it('finds a progression by its id, and none by another', () => {
    for (const each of PROGRESSION_LIBRARY) expect(progressionById(each.id), each.id).toBe(each)
    expect(progressionById('typed')).toBeUndefined()
  })

  it('lists the library by style, in the styles’ order, every progression once', () => {
    expect(LIBRARY_BY_STYLE.map((group) => group.style)).toEqual([...PROGRESSION_STYLES])
    expect(LIBRARY_BY_STYLE.flatMap((group) => group.progressions)).toHaveLength(
      PROGRESSION_LIBRARY.length,
    )
    for (const { style, progressions } of LIBRARY_BY_STYLE)
      for (const each of progressions) expect(each.style, each.id).toBe(style)
  })

  it('writes a progression’s line as it is read, a dash between its numerals', () => {
    const line = (id: string) => {
      const progression = progressionById(id)
      return progression && libraryLine(progression)
    }
    expect(line('jazz-cadence')).toBe('ii–V–I')
    expect(line('minor-two-five')).toBe('ii°–V–i')
    expect(line('gospel-walk-up')).toBe('♭VI–♭VII–I')
  })

  it('holds a cadence’s version in the other mode, from either side', () => {
    const version = (id: string) => {
      const progression = progressionById(id)
      return progression && otherModeVersion(progression)?.id
    }
    expect(version('jazz-cadence')).toBe('minor-two-five')
    expect(version('minor-two-five')).toBe('jazz-cadence')
    expect(version('complete-cadence')).toBe('minor-cadence')
    expect(version('flat-nine-resolution')).toBe('minor-flat-nine-resolution')
    expect(version('axis')).toBeUndefined()
    for (const each of PROGRESSION_LIBRARY) {
      const other = otherModeVersion(each)
      if (!other) continue
      expect(other.minor, each.id).toBe(!each.minor)
      expect(otherModeVersion(other), each.id).toBe(each)
    }
  })

  it('keeps the ♭9 the resolutions teach', () => {
    const numerals = (id: string) => progressionById(id)?.numerals
    expect(numerals('flat-nine-resolution')).toBe('V7♭9 I')
    expect(numerals('minor-flat-nine-resolution')).toBe('V7♭9 i')
  })

  it('grows the minor ii–V–i with the chord size: the sheet’s 7th chords, a 9th on each at 9ths', () => {
    const chords = (size: ChordSize) =>
      chordsOf('minor-two-five', { tonic: note('C'), minor: true }, size)
    expect(chords('triads')).toEqual(['D°', 'G', 'Cm'])
    expect(chords('sevenths')).toEqual(['Dm7♭5', 'G7', 'Cm7'])
    expect(chords('ninths')).toEqual(['Dm9♭5', 'G7♭9', 'Cm9'])
  })

  it('names a progression for the chords musicians play under that name', () => {
    expect(chordsOf('autumn-leaves', C_MAJOR, 'sevenths')).toEqual(['Dm7', 'G7', 'CMaj7', 'FMaj7'])
    expect(chordsOf('wild-thing', C_MAJOR, 'triads')).toEqual(['C', 'F', 'G', 'F'])
    expect(PROGRESSION_LIBRARY.map((each) => each.name.en)).not.toContain('Louie Louie')
    expect(chordsOf('seven-three-six', C_MAJOR, 'sevenths')).toEqual(['Bm7♭5', 'E7', 'Am7'])
    expect(chordsOf('seven-three-six', C_MAJOR, 'ninths')).toEqual(['Bm9♭5', 'E7♭9', 'Am9'])
  })

  it('names the cadences by how they close: V–I authentic, IV–V–I complete', () => {
    const name = (id: string) => progressionById(id)?.name
    expect(chordsOf('authentic', C_MAJOR, 'triads')).toEqual(['C', 'G', 'C'])
    expect(name('authentic')).toEqual({ en: 'Authentic cadence', ru: 'Автентическая каденция' })
    expect(chordsOf('complete-cadence', C_MAJOR, 'triads')).toEqual(['C', 'F', 'G', 'C'])
    expect(name('complete-cadence')).toEqual({ en: 'Complete cadence', ru: 'Полная каденция' })
  })

  it('holds the Andalusian cadence the lessons teach: a minor key stepping down to its major V', () => {
    expect(libraryProgression('i-VII-VI-V', true)?.name.en).toBe('Andalusian cadence')
    expect(chordsOf('andalusian', { tonic: note('A'), minor: true }, 'triads')).toEqual([
      'Am',
      'G',
      'F',
      'E',
    ])
  })

  it('offers a key its common progressions, a major key’s and a minor key’s in their own mode', () => {
    expect(COMMON_PROGRESSIONS.major.map((each) => each.id)).toEqual([
      'complete-cadence',
      'doo-wop',
      'jazz-cadence',
      'axis',
    ])
    expect(COMMON_PROGRESSIONS.major.every((each) => !each.minor)).toBe(true)
    expect(COMMON_PROGRESSIONS.minor.every((each) => each.minor)).toBe(true)
  })
})
