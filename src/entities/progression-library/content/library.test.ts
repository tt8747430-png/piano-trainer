import { describe, expect, it } from 'vitest'
import {
  C_MAJOR,
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
  progressionById,
  progressionMode,
} from '../index'
import { PROGRESSION_STYLES, type LibraryProgression } from '../model/types'
import { PROGRESSION_LIBRARY } from './library'

const C_MINOR = { tonic: note('C'), minor: true }
const A_MINOR = { tonic: note('A'), minor: true }

const listed = (id: string): LibraryProgression => {
  const progression = progressionById(id)
  if (!progression) throw new RangeError(`No progression ${id}`)
  return progression
}

/** A progression's chords in a key at a chord size, as the Progressions page shows them. */
const chordsOf = (id: string, key: Key, size: ChordSize): string[] =>
  (parseNumerals(libraryParam(listed(id), key.minor)) ?? []).map((numeral) =>
    chordSymbol(numeralChord(numeral, key, size)),
  )

/** The modes a progression has a line in. */
const modesOf = (progression: LibraryProgression): boolean[] =>
  [false, true].filter((minor) => progressionMode(progression, minor) === minor)

/**
 * A line's chords as a loop: a chord held once, across the loop's end too, from the rotation that
 * reads first. A major line is played in C and a minor one in A minor, so a loop heard from the
 * relative minor is the same loop; in 7th chords, so a dominant is not its key's major chord (Fly Me
 * to the Moon's C7 after CMaj7).
 */
function loopOf(progression: LibraryProgression, minor: boolean): string {
  const chords = chordsOf(progression.id, minor ? A_MINOR : C_MAJOR, 'sevenths').filter(
    (chord, at, all) => chord !== all[at - 1],
  )
  if (chords.length > 1 && chords[0] === chords.at(-1)) chords.pop()
  const rotations = chords.map((_, at) => [...chords.slice(at), ...chords.slice(0, at)].join(' '))
  return rotations.sort()[0] ?? ''
}

describe('the progressions library', () => {
  it('has unique ids, every name in English and Russian', () => {
    const ids = PROGRESSION_LIBRARY.map((each) => each.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const each of PROGRESSION_LIBRARY) {
      expect(each.name.en.trim(), each.id).not.toBe('')
      expect(each.name.ru.trim(), each.id).not.toBe('')
    }
  })

  it('writes every line, in each mode it has, in numerals the kernel reads', () => {
    for (const each of PROGRESSION_LIBRARY) {
      expect(modesOf(each).length, each.id).toBeGreaterThan(0)
      for (const line of [each.major, each.minor])
        if (line !== undefined) expect(parseNumerals(line), each.id).not.toBeNull()
    }
  })

  it('has a progression in every style', () => {
    for (const style of PROGRESSION_STYLES)
      expect(
        PROGRESSION_LIBRARY.some((each) => each.style === style),
        style,
      ).toBe(true)
  })

  it('holds no line a lead-in writes: secondary dominants and ii–Vs to every chord are a way to play', () => {
    const names = PROGRESSION_LIBRARY.map((each) => each.name.en)
    expect(names).not.toContain('Secondary dominants')
    expect(names).not.toContain('ii–V–I to every chord of the key')
  })

  it('holds an idea once: its minor version is its own line, never another progression', () => {
    expect(listed('jazz-cadence').minor).toBe('ii° V i')
    expect(listed('complete-cadence').minor).toBe('i iv V i')
    expect(listed('axis').minor).toBe('i VI III VII')
    expect(PROGRESSION_LIBRARY.map((each) => each.name.en)).not.toContain('Minor ii–V–i')
  })

  it('holds a loop once: no line is another’s from another chord, with a chord held, or from the relative minor', () => {
    const owners = new Map<string, string>()
    for (const each of PROGRESSION_LIBRARY) {
      const loops = new Set(modesOf(each).map((minor) => loopOf(each, minor)))
      for (const loop of loops) {
        expect(owners.get(loop), `${each.id}: ${loop}`).toBeUndefined()
        owners.set(loop, each.id)
      }
    }
  })

  it('names the line of a mode as its progression, and no line of the other', () => {
    for (const each of PROGRESSION_LIBRARY)
      for (const minor of modesOf(each))
        expect(libraryProgression(libraryParam(each, minor), minor), each.id).toBe(each)
    expect(libraryProgression('I-I-I', false)).toBeUndefined()
    expect(libraryProgression('I-V-vi-IV', true)).toBeUndefined()
    expect(libraryProgression('i-VI-III-VII', true)?.id).toBe('axis')
  })

  it('shows a progression in the mode asked for where it has a line in it, else in its own', () => {
    expect(progressionMode(listed('jazz-cadence'), true)).toBe(true)
    expect(progressionMode(listed('jazz-cadence'), false)).toBe(false)
    expect(progressionMode(listed('andalusian'), false)).toBe(true)
    expect(progressionMode(listed('let-it-be'), true)).toBe(false)
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

  it('writes a progression’s line as it is read, in the mode it is shown in', () => {
    expect(libraryLine(listed('jazz-cadence'), false)).toBe('ii–V–I')
    expect(libraryLine(listed('jazz-cadence'), true)).toBe('ii°–V–i')
    expect(libraryLine(listed('gospel-walk-up'), false)).toBe('♭VI–♭VII–I')
    expect(libraryLine(listed('andalusian'), false)).toBe('i–VII–VI–V')
  })

  it('keeps the ♭9 the resolution teaches, into major and into minor', () => {
    expect(listed('flat-nine-resolution').major).toBe('V7♭9 I')
    expect(listed('flat-nine-resolution').minor).toBe('V7♭9 i')
  })

  it('grows the minor ii–V–i with the chord size: the sheet’s 7th chords, a 9th on each at 9ths', () => {
    const chords = (size: ChordSize) => chordsOf('jazz-cadence', C_MINOR, size)
    expect(chords('triads')).toEqual(['D°', 'G', 'Cm'])
    expect(chords('sevenths')).toEqual(['Dm7♭5', 'G7', 'Cm7'])
    expect(chords('ninths')).toEqual(['Dm9♭5', 'G7♭9', 'Cm9'])
  })

  it('names a progression for the chords musicians play under that name', () => {
    expect(chordsOf('wild-thing', C_MAJOR, 'triads')).toEqual(['C', 'F', 'G', 'F'])
    expect(PROGRESSION_LIBRARY.map((each) => each.name.en)).not.toContain('Louie Louie')
    expect(chordsOf('seven-three-six', C_MAJOR, 'sevenths')).toEqual([
      ...['Bm7♭5', 'E7', 'Am7'],
      ...['Dm7', 'G7', 'CMaj7'],
    ])
    expect(chordsOf('round-the-circle', A_MINOR, 'sevenths').slice(1)).toEqual([
      ...['Dm7', 'G7', 'CMaj7', 'FMaj7'],
      ...['Bm7♭5', 'E7', 'Am7'],
    ])
  })

  it('names the cadences by how they close: V–I authentic, IV–V–I complete', () => {
    const name = (id: string) => progressionById(id)?.name
    expect(chordsOf('authentic', C_MAJOR, 'triads')).toEqual(['C', 'G', 'C'])
    expect(name('authentic')).toEqual({ en: 'Authentic cadence', ru: 'Автентическая каденция' })
    expect(chordsOf('complete-cadence', C_MAJOR, 'triads')).toEqual(['C', 'F', 'G', 'C'])
    expect(chordsOf('complete-cadence', A_MINOR, 'triads')).toEqual(['Am', 'Dm', 'E', 'Am'])
    expect(name('complete-cadence')).toEqual({ en: 'Complete cadence', ru: 'Полная каденция' })
  })

  it('holds the borrowed ♭VII and the tritone substitution of the learning order', () => {
    expect(chordsOf('borrowed-flat-seven', C_MAJOR, 'triads')).toEqual(['C', 'B♭', 'F', 'C'])
    expect(chordsOf('tritone-substitution', C_MAJOR, 'sevenths')).toEqual(['Dm7', 'D♭7', 'CMaj7'])
  })

  it('holds the Andalusian cadence the lessons teach: a minor key stepping down to its major V', () => {
    expect(libraryProgression('i-VII-VI-V', true)?.name.en).toBe('Andalusian cadence')
    expect(chordsOf('andalusian', A_MINOR, 'triads')).toEqual(['Am', 'G', 'F', 'E'])
  })

  it('plays the songs’ applied chords and the ii–V chain as the sheets write them', () => {
    expect(chordsOf('fly-me-to-the-moon', C_MAJOR, 'sevenths')).toEqual([
      ...['Am7', 'Dm7', 'G7', 'CMaj7', 'C7', 'FMaj7', 'Bm7♭5', 'E7', 'Am7'],
    ])
    expect(chordsOf('two-five-chain', { tonic: note('B', -1), minor: false }, 'sevenths')).toEqual([
      'Em7♭5',
      'A7♭9',
      'Dm7',
      'G7',
      'Cm7',
      'F7',
      'B♭6',
    ])
  })

  it('offers a key its common progressions, each with a line in either mode', () => {
    expect(COMMON_PROGRESSIONS.map((each) => each.id)).toEqual([
      'complete-cadence',
      'doo-wop',
      'jazz-cadence',
      'axis',
    ])
    for (const each of COMMON_PROGRESSIONS) expect(modesOf(each), each.id).toEqual([false, true])
  })
})
