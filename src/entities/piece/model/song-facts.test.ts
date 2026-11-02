import { describe, expect, it } from 'vitest'
import { readNote, shownCredits, songFacts, withSongFacts } from './song-facts'
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
  it('writes who wrote it as its score’s composer and lyricist, its credits as they were', () => {
    const next = withSongFacts(
      piece as FactsOf,
      { title: ' Abide ', music: 'Monk', words: '', about: 'Evening hymn' },
      'en',
    )
    expect(next.title).toBe('Abide')
    expect(next.header).toEqual({ composer: 'Monk' })
    expect(next.credits).toEqual(piece.credits)
    expect(next.note).toEqual({ en: 'Evening hymn', ru: 'Гимн' })
  })

  it('reads its score’s names first, then the content’s credits', () => {
    expect(songFacts({ ...piece, header: { lyricist: 'Me' } } as FactsOf, 'en')).toMatchObject({
      music: 'W. H. Monk',
      words: 'Me',
    })
  })

  it('keeps the score’s other lines, and drops an empty about', () => {
    const next = withSongFacts(
      { title: 'T', header: { subtitle: 'Op. 1', composer: 'X' } } as FactsOf,
      { title: 'T', music: '', words: 'Y', about: ' ' },
      'ru',
    )
    expect(next.header).toEqual({ subtitle: 'Op. 1', lyricist: 'Y' })
    expect(next.note).toBeUndefined()
  })

  it('writes a first about in both languages, and the same in both for a song of one language', () => {
    expect(
      withSongFacts(
        { title: 'T' } as FactsOf,
        { title: 'T', music: '', words: '', about: 'Hi' },
        'ru',
      ).note,
    ).toEqual({ en: 'Hi', ru: 'Hi' })
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

  it('keeps the title it had where the one written is empty', () => {
    expect(withSongFacts(piece, { ...songFacts(piece, 'en'), title: '  ' }, 'en').title).toBe(
      'Abide with me',
    )
  })
})

describe('shownCredits', () => {
  it('names who wrote it as its score names them, in place of the music and words credits', () => {
    expect(shownCredits(piece)).toEqual(piece.credits)
    expect(shownCredits({ ...piece, header: { composer: 'X', lyricist: 'X' } } as FactsOf)).toEqual(
      [
        { role: 'harmony', names: 'A. Bobrova' },
        { role: 'words-and-music', names: 'X' },
      ],
    )
    expect(shownCredits({ title: 'T', header: { composer: 'C', subtitle: 'S' } })).toEqual([
      { role: 'music', names: 'C' },
    ])
  })
})

describe('reading saved facts', () => {
  it('keeps a note with both languages written', () => {
    expect(readNote({ en: 'a', ru: 'б' })).toEqual({ en: 'a', ru: 'б' })
    expect(readNote({ en: 'a' })).toBeUndefined()
  })
})
