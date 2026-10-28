import { describe, expect, it } from 'vitest'
import { C_MAJOR, note, noteName, pitchClass, pitchClassOf, type Key } from '@/shared/lib/music'
import { drawRound } from '../draw'
import { choiceAnswer, isChoice } from '../round-machine'
import { scripted } from '../testing/asks'
import {
  CADENCE_LEVEL,
  CADENCE_LEVELS,
  CADENCES,
  cadenceIn,
  cadenceNumerals,
  cadencePlays,
  voiceCadence,
} from './cadences'

const A_MINOR: Key = { tonic: note('A'), minor: true }
const names = (keys: readonly { note: Parameters<typeof noteName>[0] }[]) =>
  keys.map((key) => noteName(key.note)).join(' ')

describe('a cadence voiced in a key', () => {
  const keys = CADENCE_LEVELS.flatMap((level) => CADENCE_LEVEL[level].keys)

  it('spells every key as it sounds, the bass lowest and four voices a chord, in every key it is asked', () => {
    for (const key of keys) {
      for (const cadence of CADENCES.filter((each) => cadenceIn(each, key))) {
        const { tonic, chords } = voiceCadence(cadence, key)
        for (const chord of [tonic, ...chords]) {
          expect(chord.keys, `${cadence} in ${noteName(key.tonic)}`).toHaveLength(4)
          for (const each of chord.keys)
            expect(pitchClass(each.midi), cadence).toBe(pitchClassOf(each.note))
          const [bass, ...upper] = chord.keys.map((each) => each.midi)
          expect(Math.min(...upper)).toBeGreaterThan(bass ?? 0)
        }
      }
    }
  })

  it('ends a perfect cadence in root position with the tonic on top', () => {
    const { chords } = voiceCadence('perfect', C_MAJOR)
    expect(chords.map((chord) => names(chord.keys))).toEqual(['G D G B', 'C E G C'])
    expect(cadenceNumerals(voiceCadence('perfect', C_MAJOR))).toBe('V–I')
  })

  it('makes an imperfect one with the leading note in the bass and the 3rd on top', () => {
    const { chords } = voiceCadence('imperfect', C_MAJOR)
    expect(chords.map((chord) => names(chord.keys))).toEqual(['B G D G', 'C G C E'])
    expect(cadenceNumerals(voiceCadence('imperfect', C_MAJOR))).toBe('V6–I')
  })

  it('reads the plagal, half and deceptive cadences as their numerals', () => {
    expect(cadenceNumerals(voiceCadence('plagal', C_MAJOR))).toBe('IV–I')
    expect(cadenceNumerals(voiceCadence('half', C_MAJOR))).toBe('IV–V')
    expect(cadenceNumerals(voiceCadence('deceptive', C_MAJOR))).toBe('V–vi')
    expect(cadenceNumerals(voiceCadence('deceptive', A_MINOR))).toBe('V–VI')
  })

  it('raises a minor key’s leading note, and falls a half step in the bass to V in the Phrygian', () => {
    const { chords } = voiceCadence('phrygian', A_MINOR)
    expect(chords.map((chord) => names(chord.keys))).toEqual(['F A D F', 'E G# B E'])
    const [iv, five] = chords.map((chord) => chord.keys[0]?.midi ?? 0)
    expect((iv ?? 0) - (five ?? 0)).toBe(1)
    expect(cadenceNumerals(voiceCadence('phrygian', A_MINOR))).toBe('iv6–V')
  })

  it('has the Phrygian half cadence in minor keys only', () => {
    expect(cadenceIn('phrygian', A_MINOR)).toBe(true)
    expect(cadenceIn('phrygian', C_MAJOR)).toBe(false)
    expect(() => voiceCadence('phrygian', C_MAJOR)).toThrow()
  })

  it('asks the chord that tells each cadence: V before I, IV before I, where a half or deceptive one stops', () => {
    expect(cadencePlays('perfect', C_MAJOR)).toEqual({ at: 0, inversion: 0 })
    expect(cadencePlays('imperfect', C_MAJOR)).toEqual({ at: 0, inversion: 1 })
    expect(cadencePlays('plagal', C_MAJOR)).toEqual({ at: 0, inversion: null })
    expect(cadencePlays('half', C_MAJOR)).toEqual({ at: 1, inversion: null })
    expect(cadencePlays('deceptive', C_MAJOR)).toEqual({ at: 1, inversion: null })
    expect(cadencePlays('phrygian', A_MINOR)).toEqual({ at: 0, inversion: 1 })
  })
})

describe('a cadence round', () => {
  const asks = (drill: 'flashcards' | 'quiz' | 'entry' | 'ear') =>
    ({ kind: 'cadences', drill, keys: [A_MINOR], cadences: ['phrygian', 'plagal'] }) as const

  it('names a cadence from its options, the key’s own only', () => {
    for (const drill of ['quiz', 'ear'] as const) {
      const question = drawRound(asks(drill), { index: 0, random: scripted(0.1, 0.9, 0.4) })
      if (question.mode !== 'name-cadence' || !isChoice(question)) throw new Error(question.mode)
      expect(question.heard).toBe(drill === 'ear')
      expect(question.options).toContain(choiceAnswer(question))
      expect([...question.options].sort()).toEqual(['phrygian', 'plagal'])
    }
  })

  it('plays the chord that makes the cadence, in its inversion, on the keys', () => {
    const question = drawRound(asks('entry'), { index: 0, random: scripted(0.1) })
    if (question.mode !== 'build-chord') throw new Error(question.mode)
    expect(question.cadence?.cadence).toBe('phrygian')
    expect(question.symbol).toBe('Dm/F')
    expect(question.inversion).toBe(1)
    expect(question.skill).toBeUndefined()
  })

  it('turns a card over from its name or its staff', () => {
    const question = drawRound(
      { ...asks('flashcards'), show: 'staff' },
      { index: 0, random: scripted(0.9) },
    )
    expect(question).toMatchObject({ mode: 'cadence-card', show: 'staff', cadence: 'plagal' })
  })
})
