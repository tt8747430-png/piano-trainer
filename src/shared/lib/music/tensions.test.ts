import { describe, expect, it } from 'vitest'
import { note, noteName, rootSpelling, type SpelledNote } from './note'
import { PITCH_CLASSES } from './pitch'
import {
  availableTensions,
  TENSION_CHORDS,
  TENSION_GROUPS,
  tensionTones,
  type TensionChord,
  type TensionGroup,
} from './tensions'
import type { Key } from './key'

const C = note('C')
const inGroup = (quality: TensionChord, group: TensionGroup, root: SpelledNote = C) =>
  tensionTones(root, quality)
    .filter((tone) => tone.group === group)
    .map((tone) => `${tone.degree} ${noteName(tone.note)}`)

describe('tensionTones', () => {
  it('groups the notes over CMaj7 as the owner’s table does', () => {
    expect(inGroup('maj7', 'weak')).toEqual(['1 C', '5 G'])
    expect(inGroup('maj7', 'strong')).toEqual(['3 E', '7 B'])
    expect(inGroup('maj7', 'tension')).toEqual(['9 D', '#11 F#', '13 A'])
    expect(inGroup('maj7', 'avoid')).toEqual(['♭9 D♭', '#9 D#', '11 F', '♭13 A♭', '♭7 B♭'])
  })

  it('groups the notes over Cm7 as the owner’s table does, its E the 3rd a minor chord must not carry', () => {
    expect(inGroup('m7', 'weak')).toEqual(['1 C', '5 G'])
    expect(inGroup('m7', 'strong')).toEqual(['♭3 E♭', '♭7 B♭'])
    expect(inGroup('m7', 'tension')).toEqual(['9 D', '11 F', '13 A'])
    expect(inGroup('m7', 'avoid')).toEqual(['♭9 D♭', '3 E', '#11 F#', '♭13 A♭', '7 B'])
  })

  it('groups the notes over C7 as the owner’s table does', () => {
    expect(inGroup('d7', 'weak')).toEqual(['1 C', '5 G'])
    expect(inGroup('d7', 'strong')).toEqual(['3 E', '♭7 B♭'])
    expect(inGroup('d7', 'tension')).toEqual(['♭9 D♭', '9 D', '#9 D#', '#11 F#', '♭13 A♭', '13 A'])
    expect(inGroup('d7', 'avoid')).toEqual(['11 F', '7 B'])
  })

  it('puts an altered 5th with the tensions, and the suspended 4th with the strong tones', () => {
    expect(inGroup('hd', 'tension')).toEqual(['9 D', '11 F', '♭5 G♭', '♭13 A♭'])
    expect(inGroup('s5', 'tension')).toEqual(['♭9 D♭', '9 D', '#9 D#', '#11 F#', '#5 G#'])
    expect(inGroup('sus7', 'strong')).toEqual(['4 F', '♭7 B♭'])
    expect(inGroup('o7', 'strong')).toEqual(['♭3 E♭', '𝄫7 B𝄫'])
    expect(inGroup('o7', 'tension')).toEqual(['9 D', '11 F', '♭5 G♭', '♭13 A♭', '7 B'])
  })

  it('holds every one of the twelve notes once, for every chord on every root', () => {
    for (const quality of TENSION_CHORDS) {
      for (const pc of PITCH_CLASSES) {
        const tones = tensionTones(rootSpelling(pc, false), quality)
        expect(new Set(tones.map((tone) => tone.pitchClass)).size, quality).toBe(12)
        expect(tones.every((tone) => TENSION_GROUPS.includes(tone.group))).toBe(true)
      }
    }
  })

  it('spells each note by letters from the root', () => {
    expect(inGroup('d7', 'tension', note('E', -1))).toEqual([
      '♭9 F♭',
      '9 F',
      '#9 F#',
      '#11 A',
      '♭13 C♭',
      '13 C',
    ])
  })
})

describe('availableTensions', () => {
  it('gives a chord of the reference its tensions, and any other chord none', () => {
    expect(availableTensions('maj7').map((tension) => tension.degree)).toEqual(['9', '#11', '13'])
    expect(availableTensions('maj')).toEqual([])
    expect(availableTensions('n9')).toEqual([])
  })
})

describe('tensionTones in a key (A33)', () => {
  /** The tensions and the avoided notes among the 9th, 11th and 13th, by degree. */
  const colours = (root: Parameters<typeof note>[0], quality: TensionChord, key: Key) => {
    const tones = tensionTones(note(root), quality, key).filter((tone) => tone.semitones % 12 !== 0)
    const by = (group: TensionGroup) =>
      tones
        .filter((tone) => tone.group === group && /9|11|13/.test(tone.degree))
        .map((tone) => tone.degree)
    return { tension: by('tension'), avoid: by('avoid') }
  }
  const C = { tonic: note('C'), minor: false }
  const F = { tonic: note('F'), minor: false }

  it('gives Dm7 as ii of C its 9th and 11th, the 13th a tritone from its 3rd avoided', () => {
    expect(colours('D', 'm7', C)).toMatchObject({ tension: ['9', '11'] })
    expect(colours('D', 'm7', C).avoid).toContain('13')
  })

  it('gives Dm7 as vi of F its 9th and 11th, its ♭13 avoided', () => {
    expect(colours('D', 'm7', F)).toMatchObject({ tension: ['9', '11'] })
    expect(colours('D', 'm7', F).avoid).toContain('♭13')
  })

  it('makes Em7 as iii of C avoid its ♭9 and ♭13', () => {
    const { tension, avoid } = colours('E', 'm7', C)
    expect(tension).toEqual(['11'])
    expect(avoid).toEqual(expect.arrayContaining(['♭9', '♭13']))
  })

  it('gives CMaj7 as I of C its 9th and 13th, the 11th a half step over its 3rd avoided', () => {
    const { tension, avoid } = colours('C', 'maj7', C)
    expect(tension).toEqual(['9', '13'])
    expect(avoid).toContain('11')
  })

  it('keeps a dominant’s alterations in any key', () => {
    const { tension } = colours('G', 'd7', C)
    expect(tension).toEqual(expect.arrayContaining(['♭9', '#9', '#11', '♭13']))
  })
})
