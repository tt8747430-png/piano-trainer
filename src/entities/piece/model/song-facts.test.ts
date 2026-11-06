import { describe, expect, it } from 'vitest'
import {
  readNote,
  shownCredits,
  songCredit,
  songFacts,
  withSongCredit,
  withSongFacts,
} from './song-facts'
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
  it('reads the title and what is said about it: who wrote it is the score’s', () => {
    expect(songFacts(piece, 'en')).toEqual({ title: 'Abide with me', about: 'A hymn' })
    expect(songFacts(piece, 'ru').about).toBe('Гимн')
  })
})

describe('withSongFacts', () => {
  it('writes its title and about, its score’s credits as they were', () => {
    const next = withSongFacts(
      { ...piece, header: { composer: 'Monk' } } as FactsOf,
      { title: ' Abide ', about: 'Evening hymn' },
      'en',
    )
    expect(next.title).toBe('Abide')
    expect(next.header).toEqual({ composer: 'Monk' })
    expect(next.credits).toEqual(piece.credits)
    expect(next.note).toEqual({ en: 'Evening hymn', ru: 'Гимн' })
  })

  it('drops an empty about', () => {
    const next = withSongFacts({ title: 'T' } as FactsOf, { title: 'T', about: ' ' }, 'ru')
    expect(next.note).toBeUndefined()
  })

  it('writes a first about in both languages, and the same in both for a song of one language', () => {
    expect(
      withSongFacts({ title: 'T' } as FactsOf, { title: 'T', about: 'Hi' }, 'ru').note,
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

describe('a song’s credits as properties (R32-C)', () => {
  it('reads Music, Words and Arranger from the score’s lines, else from its credits', () => {
    expect(songCredit(piece, 'composer')).toBe('W. H. Monk')
    expect(songCredit(piece, 'lyricist')).toBe('H. F. Lyte')
    expect(songCredit(piece, 'arranger')).toBe('A. Bobrova')
    expect(songCredit({ ...piece, header: { arranger: 'K' } } as FactsOf, 'arranger')).toBe('K')
    expect(songCredit({ title: 'T' }, 'composer')).toBe('')
  })

  it('writes one line of the score, the credit it stands for gone, and shows it in its place', () => {
    const next = withSongCredit<FactsOf>(piece, 'arranger', ' Mary Smith ')
    expect(next.header).toEqual({ arranger: 'Mary Smith' })
    expect(shownCredits(next)).toEqual([
      { role: 'words', names: 'H. F. Lyte' },
      { role: 'music', names: 'W. H. Monk' },
      { role: 'harmony', names: 'Mary Smith' },
    ])
    expect(songCredit(next, 'arranger')).toBe('Mary Smith')
  })

  it('takes a credit away when its line is emptied', () => {
    const next = withSongCredit(piece, 'composer', '  ')
    expect(songCredit(next, 'composer')).toBe('')
    expect(shownCredits(next)).toEqual([
      { role: 'words', names: 'H. F. Lyte' },
      { role: 'harmony', names: 'A. Bobrova' },
    ])
  })

  it('splits Words and music into its two lines before one of them changes', () => {
    const shared = { title: 'T', credits: [{ role: 'words-and-music', names: 'X' }] as const }
    const next = withSongCredit<FactsOf>(shared, 'lyricist', 'Y')
    expect(next.header).toEqual({ composer: 'X', lyricist: 'Y' })
    expect(songCredit(next, 'composer')).toBe('X')
    expect(songCredit(next, 'lyricist')).toBe('Y')
  })
})

describe('reading saved facts', () => {
  it('keeps a note with both languages written', () => {
    expect(readNote({ en: 'a', ru: 'б' })).toEqual({ en: 'a', ru: 'б' })
    expect(readNote({ en: 'a' })).toBeUndefined()
  })
})
