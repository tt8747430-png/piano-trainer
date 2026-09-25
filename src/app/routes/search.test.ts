import { describe, expect, it } from 'vitest'
import {
  CHORDS_DEFAULTS,
  PLAYER_DEFAULTS,
  QUIZ_DEFAULTS,
  SCALES_DEFAULTS,
  SONGS_DEFAULTS,
  validateCheckSearch,
  validateChordsSearch,
  validatePlayerSearch,
  validateQuizSearch,
  validateScalesSearch,
  validateSongsSearch,
} from './search'

/** What the router hands a validator: anything a URL can hold. */
const raw = (search: Record<string, unknown>) => search as never

describe('search params', () => {
  it('fill every default for an empty URL', () => {
    expect(validateSongsSearch(raw({}))).toEqual(SONGS_DEFAULTS)
    expect(validateChordsSearch(raw({}))).toEqual(CHORDS_DEFAULTS)
    expect(validateScalesSearch(raw({}))).toEqual(SCALES_DEFAULTS)
    expect(validateQuizSearch(raw({}))).toEqual(QUIZ_DEFAULTS)
    expect(validatePlayerSearch(raw({}))).toEqual(PLAYER_DEFAULTS)
    expect(validateCheckSearch(raw({}))).toEqual({})
  })

  it('keep what is valid', () => {
    expect(
      validateChordsSearch(
        raw({ root: 'Bb', quality: 'm7', inversion: 2, hands: 'both', step: 'chords:sev' }),
      ),
    ).toEqual({ root: 'Bb', quality: 'm7', inversion: 2, hands: 'both', step: 'chords:sev' })
    expect(
      validatePlayerSearch(
        raw({
          key: 'A',
          tempo: 96,
          hands: 'lh',
          mode: 'turn',
          pattern: 'chart',
          rh: 't1',
          lh: 'o',
          voicing: 'ninths',
        }),
      ),
    ).toEqual({
      key: 'A',
      tempo: 96,
      hands: 'lh',
      mode: 'turn',
      pattern: 'chart',
      rh: 't1',
      lh: 'o',
      voicing: 'ninths',
    })
    expect(validateSongsSearch(raw({ q: 'душа', collection: 'hymns', level: 1 }))).toEqual({
      q: 'душа',
      collection: 'hymns',
      level: 1,
    })
    expect(validateScalesSearch(raw({ root: 'Eb', kind: 'harmonic', chords: 4 }))).toMatchObject({
      root: 'Eb',
      kind: 'harmonic',
      chords: 4,
    })
  })

  it('drop anything stale or hand-edited back to its default, without clamping', () => {
    expect(
      validatePlayerSearch(
        raw({
          key: 'H',
          tempo: 999,
          mode: 'dance',
          pattern: 'waltz',
          rh: 'zz',
          voicing: 'elevenths',
        }),
      ),
    ).toEqual(PLAYER_DEFAULTS)
    expect(
      validateChordsSearch(raw({ quality: 'maj13', inversion: 7, step: 'scale:major' })),
    ).toEqual(CHORDS_DEFAULTS)
    expect(validateChordsSearch(raw({ quality: 'maj', inversion: 3 })).inversion).toBe(0)
    expect(
      validateScalesSearch(raw({ kind: 'dorian', tempo: 10, chords: 5, step: 'chords:tri' })),
    ).toEqual(SCALES_DEFAULTS)
    expect(validateCheckSearch(raw({ of: 'nothing:here' }))).toEqual({})
  })

  it('spell a root the way its explorer names it', () => {
    expect(validateChordsSearch(raw({ root: 'A#', quality: 'maj' })).root).toBe('Bb')
    expect(validatePlayerSearch(raw({ key: 'B♭' })).key).toBe('Bb')
  })
})
