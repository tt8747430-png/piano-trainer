import { describe, expect, it } from 'vitest'
import { readCredits, readNote, songFacts, withSongFacts } from './song-facts'
import type { Credit } from './types'

type FactsOf = Parameters<typeof withSongFacts>[0]

const piece = {
  title: 'Abide with me',
  credits: [
    { role: 'words', names: 'H. F. Lyte' },
    { role: 'music', names: 'W. H. Monk' },
    { role: 'harmony', names: 'A. Bobrova' },
  ] as readonly Credit[],
  note: { en: 'A hymn', ru: 'Гимн' },
}

describe('songFacts', () => {
  it('reads the title, who wrote the music and the words, and what is said about it', () => {
    expect(songFacts(piece, 'en')).toEqual({
      title: 'Abide with me',
      music: 'W. H. Monk',
      words: 'H. F. Lyte',
      about: 'A hymn',
    })
    expect(songFacts(piece, 'ru').about).toBe('Гимн')
  })

  it('reads words and music written by the same names into both', () => {
    const facts = songFacts(
      { title: 'T', credits: [{ role: 'words-and-music', names: 'X' }] },
      'en',
    )
    expect(facts).toEqual({ title: 'T', music: 'X', words: 'X', about: '' })
  })
})

describe('withSongFacts', () => {
  it('writes the facts over the piece, keeping the credits not edited here', () => {
    const next = withSongFacts(
      piece,
      { title: ' Abide ', music: 'Monk', words: '', about: 'Evening hymn' },
      'en',
    )
    expect(next.title).toBe('Abide')
    expect(next.credits).toEqual([
      { role: 'harmony', names: 'A. Bobrova' },
      { role: 'music', names: 'Monk' },
    ])
    expect(next.note).toEqual({ en: 'Evening hymn', ru: 'Гимн' })
  })

  it('writes the same names for both as words and music, and drops an empty about', () => {
    const next = withSongFacts(
      { title: 'T' } as FactsOf,
      { title: 'T', music: 'X', words: 'X', about: ' ' },
      'ru',
    )
    expect(next.credits).toEqual([{ role: 'words-and-music', names: 'X' }])
    expect(next.note).toBeUndefined()
  })

  it('writes a first about in both languages', () => {
    expect(
      withSongFacts(
        { title: 'T' } as FactsOf,
        { title: 'T', music: '', words: '', about: 'Hi' },
        'ru',
      ).note,
    ).toEqual({ en: 'Hi', ru: 'Hi' })
  })

  it('writes the same about in both languages for a song of one language', () => {
    const next = withSongFacts(piece, { ...songFacts(piece, 'en'), about: 'Mine' }, 'en', true)
    expect(next.note).toEqual({ en: 'Mine', ru: 'Mine' })
  })

  it('writes the title the page shows in this language: its translation where it has one', () => {
    const titled = { title: 'Мир, душа', titleEn: 'Still, my soul' }
    expect(songFacts(titled, 'en').title).toBe('Still, my soul')
    expect(songFacts(titled, 'ru').title).toBe('Мир, душа')
    const next = withSongFacts(titled, { ...songFacts(titled, 'en'), title: 'Be still' }, 'en')
    expect(next).toMatchObject({ title: 'Мир, душа', titleEn: 'Be still' })
  })

  it('keeps authors as they are, apart from who wrote the music and the words', () => {
    const authored = { title: 'T', credits: [{ role: 'authors', names: 'A, B' }] as Credit[] }
    expect(songFacts(authored, 'en').music).toBe('')
    expect(
      withSongFacts(authored, { ...songFacts(authored, 'en'), music: 'C' }, 'en').credits,
    ).toEqual([
      { role: 'authors', names: 'A, B' },
      { role: 'music', names: 'C' },
    ])
  })

  it('keeps the title it had where the one written is empty', () => {
    expect(withSongFacts(piece, { ...songFacts(piece, 'en'), title: '  ' }, 'en').title).toBe(
      'Abide with me',
    )
  })
})

describe('reading saved facts', () => {
  it('keeps only credits that read as a role and names', () => {
    expect(
      readCredits([
        { role: 'music', names: 'X' },
        { role: 'boss', names: 'Y' },
        3,
        { role: 'unknown' },
      ]),
    ).toEqual([{ role: 'music', names: 'X' }, { role: 'unknown' }])
    expect(readCredits('x')).toBeUndefined()
  })

  it('keeps a note with both languages written', () => {
    expect(readNote({ en: 'a', ru: 'б' })).toEqual({ en: 'a', ru: 'б' })
    expect(readNote({ en: 'a' })).toBeUndefined()
  })
})
