import { describe, expect, it } from 'vitest'
import { chordSymbol } from './chord'
import type { Key } from './key'
import { LEAD_INS, withLeadIns, type LeadIn } from './lead-in'
import { note } from './note'
import { numeralChord, numeralText, parseNumerals } from './numerals'
import type { ChordSize } from './scale-chord'

const C_MAJOR: Key = { tonic: note('C'), minor: false }
const C_MINOR: Key = { tonic: note('C'), minor: true }

const led = (line: string, lead: LeadIn, key: Key = C_MAJOR): string =>
  withLeadIns(parseNumerals(line) ?? [], lead, key)
    .map(numeralText)
    .join(' ')
const chords = (line: string, lead: LeadIn, key: Key, size: ChordSize): string[] =>
  withLeadIns(parseNumerals(line) ?? [], lead, key).map((numeral) =>
    chordSymbol(numeralChord(numeral, key, size)),
  )

describe('withLeadIns', () => {
  it('has two ways: by the chord’s V, or by its ii–V', () => {
    expect(LEAD_INS).toEqual(['v', 'ii-v'])
  })

  it('leads into each chord of the key by its own dominant, the chord matrix’s secondary dominants', () => {
    expect(led('I ii iii IV V vi', 'v')).toBe('V I V/ii ii V/iii iii V/IV IV V/V V V/vi vi')
    expect(chords('I ii iii IV V vi', 'v', C_MAJOR, 'sevenths')).toEqual([
      ...['G7', 'CMaj7', 'A7', 'Dm7', 'B7', 'Em7'],
      ...['C7', 'FMaj7', 'D7', 'G7', 'E7', 'Am7'],
    ])
  })

  it('leads into every chord of the key by its own ii–V, the minor ii–V before a minor chord, as the sheet does', () => {
    expect(led('I ii iii IV V vi vii°', 'ii-v')).toBe(
      'ii V I ii°/ii V/ii ii ii°/iii V/iii iii ii/IV V/IV IV ii/V V/V V ii°/vi V/vi vi ii°/vii V/vii vii°',
    )
    expect(chords('I ii vii°', 'ii-v', C_MAJOR, 'sevenths')).toEqual([
      ...['Dm7', 'G7', 'CMaj7'],
      ...['Em7♭5', 'A7', 'Dm7'],
      ...['C#m7♭5', 'F#7', 'Bm7♭5'],
    ])
  })

  it('leads round the circle in the key, each chord after its own ii–V, IV straight after I, its V', () => {
    expect(led('I IV vii° iii vi ii V', 'ii-v')).toBe(
      'ii V I IV ii°/vii V/vii vii° ii°/iii V/iii iii ii°/vi V/vi vi ii°/ii V/ii ii ii/V V/V V',
    )
  })

  it('leads a minor key’s tonic by its own ii° and V, and its major chords by major ii–Vs', () => {
    expect(led('i III', 'ii-v', C_MINOR)).toBe('ii° V i ii/III V/III III')
    expect(chords('i III', 'ii-v', C_MINOR, 'sevenths')).toEqual([
      ...['Dm7♭5', 'G7', 'Cm7'],
      ...['Fm7', 'B♭7', 'E♭Maj7'],
    ])
  })

  it('leads a major chord in a minor key, or a minor one in a major key, in its own mode', () => {
    expect(led('I', 'v', C_MINOR)).toBe('V/I I')
    expect(led('i', 'ii-v', C_MAJOR)).toBe('ii°/i V/i i')
  })

  it('never plays a chord twice: a chord after its own dominant is not led again', () => {
    expect(led('ii V I', 'v')).toBe('V/ii ii V/V V I')
    expect(led('I IV', 'v')).toBe('V I IV')
    expect(led('I7 IV7', 'v')).toBe('V I7 IV7')
  })

  it('leads by the V alone after the chord that sounds as the ii, and not at all after its V', () => {
    expect(led('ii V I', 'ii-v')).toBe('ii°/ii V/ii ii ii/V V/V V I')
    const A_MINOR: Key = { tonic: note('A'), minor: true }
    expect(chords('i iv V i', 'ii-v', A_MINOR, 'sevenths').slice(-2)).toEqual(['E7', 'Am7'])
    expect(led('vi ii I', 'ii-v')).toBe('ii°/vi V/vi vi ii°/ii V/ii ii V I')
  })

  it('leaves a chord held and a chord already applied as they are', () => {
    expect(led('I I vi', 'v')).toBe('V I I V/vi vi')
    expect(led('I V/vi vi', 'v')).toBe('V I V/vi vi')
  })
})
