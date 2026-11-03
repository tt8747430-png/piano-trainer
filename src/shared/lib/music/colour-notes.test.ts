import { describe, expect, it } from 'vitest'
import { buildChord, CHORD_PARTS, type ChordParts } from './chord-parts'
import { colourNotes, withColour, type ColourGroup } from './colour-notes'
import { INTERVALS } from './interval'
import type { Key } from './key'
import { note, noteName, rootSpelling } from './note'
import { PITCH_CLASSES } from './pitch'

const C = note('C')
const parts = (over: Partial<ChordParts> = {}): ChordParts => ({
  triad: 'maj',
  size: 5,
  seventh: 'minor',
  added: [],
  alterations: [],
  ...over,
})
const DOMINANT = parts({ size: 7 })
const MINOR_7TH = parts({ triad: 'min', size: 7 })
const C_MAJOR: Key = { tonic: C, minor: false }
const F_MAJOR: Key = { tonic: note('F'), minor: false }

const inGroup = (
  root: ReturnType<typeof note>,
  chord: ChordParts,
  group: ColourGroup,
  key?: Key,
): string[] =>
  colourNotes(root, chord, key)
    .filter((each) => each.group === group)
    .map((each) => `${each.label} ${noteName(each.note)}`)

const symbol = (chord: ChordParts | null) => (chord ? `C${buildChord(C, chord).suffix}` : 'none')

describe('colourNotes without a key', () => {
  it('groups the notes over C7 as the owner’s table does', () => {
    expect(inGroup(C, DOMINANT, 'chord')).toEqual(['1 C', '3 E', '5 G', '♭7 B♭'])
    expect(inGroup(C, DOMINANT, 'tension')).toEqual([
      '♭9 D♭',
      '9 D',
      '#9 D#',
      '#11 F#',
      '♭13 A♭',
      '13 A',
    ])
    expect(inGroup(C, DOMINANT, 'avoid')).toEqual(['11 F', '7 B'])
  })

  it('offers a triad its added tones, both octaves of a 2nd, 4th and 6th where a dictionary names them', () => {
    expect(inGroup(C, parts(), 'chord')).toEqual(['1 C', '3 E', '5 G'])
    const offered = colourNotes(C, parts()).filter((each) => each.toggled !== null)
    expect(offered.map((each) => each.label)).toEqual([
      'add2',
      'add9',
      'add4',
      'add11',
      'add#11',
      '6',
    ])
  })

  it('takes a minor 9th over a chord tone as an avoid note', () => {
    expect(inGroup(C, parts({ triad: 'min' }), 'avoid')).toEqual(['♭9 D♭', '3 E', '♭13 A♭'])
  })

  it('marks the colour notes the chord already has', () => {
    const ninth = colourNotes(C, parts({ size: 9 })).find((each) => each.label === '9')
    expect(ninth?.added).toBe(true)
    expect(ninth?.group).toBe('tension')
    expect(colourNotes(C, DOMINANT).find((each) => each.label === '9')?.added).toBe(false)
  })

  it('holds every one of the twelve notes once over a 7th chord, on every root', () => {
    for (const pc of PITCH_CLASSES) {
      const notes = colourNotes(rootSpelling(pc, false), MINOR_7TH)
      expect(new Set(notes.map((each) => each.pitchClass)).size).toBe(12)
    }
  })
})

describe('colourNotes in a key (A33)', () => {
  const D = note('D')
  const E = note('E')

  it('gives Dm7 as ii of C its 9th, 11th and 13th, and nothing to avoid', () => {
    expect(inGroup(D, MINOR_7TH, 'tension', C_MAJOR)).toEqual(['9 E', '11 G', '13 B'])
    expect(inGroup(D, MINOR_7TH, 'avoid', C_MAJOR)).toEqual([])
  })

  it('gives the same Dm7 as vi of F a ♭13 to avoid', () => {
    expect(inGroup(D, MINOR_7TH, 'tension', F_MAJOR)).toEqual(['9 E', '11 G'])
    expect(inGroup(D, MINOR_7TH, 'avoid', F_MAJOR)).toEqual(['♭13 B♭'])
  })

  it('has Em7 as iii of C avoid its ♭9 and ♭13', () => {
    expect(inGroup(E, MINOR_7TH, 'tension', C_MAJOR)).toEqual(['11 A'])
    expect(inGroup(E, MINOR_7TH, 'avoid', C_MAJOR)).toEqual(['♭9 F', '♭13 C'])
  })

  it('offers a dominant its altered tensions in any key', () => {
    expect(inGroup(note('G'), DOMINANT, 'tension', C_MAJOR)).toContain('♭9 A♭')
  })

  it('reads a chord whose root is not in the key as it reads it without one', () => {
    expect(inGroup(note('E', -1), MINOR_7TH, 'tension', C_MAJOR)).toEqual(
      inGroup(note('E', -1), MINOR_7TH, 'tension'),
    )
  })
})

describe('withColour', () => {
  it('adds a note and writes it in the symbol: C9, C7♯11, Cadd9, C7♭9♯11', () => {
    expect(symbol(withColour(DOMINANT, INTERVALS.M9))).toBe('C9')
    expect(symbol(withColour(DOMINANT, INTERVALS.A11))).toBe('C7#11')
    expect(symbol(withColour(parts(), INTERVALS.M9))).toBe('Cadd9')
    const flatNine = withColour(DOMINANT, INTERVALS.m9)
    expect(symbol(flatNine && withColour(flatNine, INTERVALS.A11))).toBe('C7♭9#11')
  })

  it('takes a note off again, the chord kept whole', () => {
    expect(symbol(withColour(parts({ size: 9 }), INTERVALS.M9))).toBe('C7')
    expect(symbol(withColour(parts({ size: 13 }), INTERVALS.M9))).toBe('C7(add13)')
  })

  it('is null where no chord the builder makes holds it', () => {
    expect(withColour(parts({ size: 7, seventh: 'major' }), INTERVALS.P11)).toBeNull()
  })

  it('only ever gives a chord the builder makes', () => {
    for (const chord of CHORD_PARTS.slice(0, 40)) {
      for (const each of colourNotes(C, chord)) {
        if (each.toggled) expect(CHORD_PARTS).toContainEqual(each.toggled)
      }
    }
  })
})
