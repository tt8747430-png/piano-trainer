import { describe, expect, it } from 'vitest'
import { spellChord } from './chord'
import { parseKey, type Key } from './key'
import { numeralChord, numeralsLine } from './numerals'
import { pitchClass } from './pitch'
import { randomProgression } from './progression-random'
import { keyTones } from './scale'
import { pitchClassOf } from './note'

/** A seeded random: the same numbers in the same order, every run. */
function seeded(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

/** A line said as the books write it, a space between its chords. */
const said = (line: Parameters<typeof numeralsLine>[0]) => numeralsLine(line).replaceAll('–', ' ')

const keyOf = (name: string): Key => {
  const key = parseKey(name)
  if (!key) throw new Error(name)
  return key
}

describe('randomProgression', () => {
  it('a seeded random that always says 0 gives I IV V I in C', () => {
    expect(said(randomProgression(keyOf('C'), 4, () => 0))).toBe('I IV V I')
  })
  it('starts at home, ends home after the dominant, never the same chord twice running', () => {
    const line = randomProgression(keyOf('G'), 8, seeded(7))
    expect(line).toHaveLength(8)
    expect(said(line.slice(0, 1))).toBe('I')
    expect(said(line.slice(-2))).toBe('V I')
    line.slice(1).forEach((numeral, i) => expect(numeral).not.toEqual(line[i]))
  })
  it("every chord is the key's, a minor key's V from harmonic minor", () => {
    for (const name of ['C', 'Eb', 'F#m', 'Dm']) {
      const key = keyOf(name)
      const own = new Set(keyTones(key).map((tone) => tone.pitchClass))
      // Harmonic minor's leading tone, a semitone under the tonic.
      if (key.minor) own.add(pitchClass(pitchClassOf(key.tonic) - 1))
      for (let seed = 1; seed < 40; seed++)
        for (const numeral of randomProgression(key, 6, seeded(seed))) {
          const chord = numeralChord(numeral, key, 'triads')
          for (const tone of spellChord(chord.root, chord.quality))
            expect(own.has(tone.pitchClass), `${name} ${numeralsLine([numeral])}`).toBe(true)
        }
    }
  })
  it('one bar is home; two, home and the dominant; three, home again after it', () => {
    const c = keyOf('C')
    expect(said(randomProgression(c, 1, () => 0.5))).toBe('I')
    expect(said(randomProgression(c, 2, () => 0.5))).toBe('I V')
    expect(said(randomProgression(c, 3, () => 0.5))).toBe('I V I')
    expect(said(randomProgression(keyOf('Am'), 4, () => 0))).toBe('i iv V i')
  })
})
