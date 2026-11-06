import { describe, expect, it } from 'vitest'
import {
  isEmptyDetails,
  MOST_TAGS,
  NO_DETAILS,
  sanitiseSongDetails,
  tagOf,
  tagsOf,
  tagSuggestions,
} from './song-details'

describe('a song’s details', () => {
  it('reads what is valid and drops the rest', () => {
    expect(
      sanitiseSongDetails({ level: 'beginner', genre: 'hymn', language: 'ru', tags: ['Sunday'] }),
    ).toEqual({ level: 'beginner', genre: 'hymn', language: 'ru', tags: ['sunday'] })
    expect(
      sanitiseSongDetails({ level: 'easy', genre: 'rock', language: 'xx', tags: 'a' }),
    ).toEqual(NO_DETAILS)
    expect(sanitiseSongDetails(null)).toEqual(NO_DETAILS)
  })

  it('keeps a tag trimmed, its spaces one, in lower case, and none that is empty', () => {
    expect(tagOf('  Good   Friday ')).toBe('good friday')
    expect(tagOf('   ')).toBeNull()
    expect(tagOf('x'.repeat(40))).toHaveLength(24)
  })

  it('keeps each tag once and at most twelve', () => {
    expect(tagsOf(['Advent', 'advent', 3, 'Choir'])).toEqual(['advent', 'choir'])
    expect(tagsOf(Array.from({ length: 20 }, (_, i) => `t${i}`))).toHaveLength(MOST_TAGS)
  })

  it('says when the details say nothing', () => {
    expect(isEmptyDetails(NO_DETAILS)).toBe(true)
    expect(isEmptyDetails({ ...NO_DETAILS, tags: ['a'] })).toBe(false)
  })
})

describe('tags offered as one is typed (R32-C)', () => {
  const library = {
    a: { ...NO_DETAILS, tags: ['warm-up', 'three notes'] },
    b: { ...NO_DETAILS, tags: ['sunday', 'three hands'] },
  }

  it('offers the library’s other tags, the song’s own left out, sorted', () => {
    expect(tagSuggestions(library, ['warm-up'], '')).toEqual([
      'sunday',
      'three hands',
      'three notes',
    ])
  })

  it('narrows them to those holding what is typed, as a tag is kept', () => {
    expect(tagSuggestions(library, [], '  THR ')).toEqual(['three hands', 'three notes'])
    expect(tagSuggestions(library, [], 'zzz')).toEqual([])
  })
})
