import { describe, expect, it } from 'vitest'
import { BOOK_IDS, BOOKS, isMethodBookId, METHOD_BOOK_IDS, METHOD_BOOK_NAMES } from '../index'

describe('the books', () => {
  it('print a title and an author, each book once', () => {
    expect(Object.keys(BOOKS)).toEqual([...BOOK_IDS])
    for (const id of BOOK_IDS) {
      expect(BOOKS[id].title.trim(), id).not.toBe('')
      expect(BOOKS[id].author.trim(), id).not.toBe('')
    }
  })

  it('count two method books among them, each with the name its learners call it', () => {
    expect(METHOD_BOOK_IDS).toEqual(['called-to-play', 'seven-types'])
    expect(METHOD_BOOK_IDS.map((id) => METHOD_BOOK_NAMES[id])).toEqual([
      'Called to Play',
      'Боброва',
    ])
    for (const id of METHOD_BOOK_IDS) expect(BOOK_IDS).toContain(id)
  })

  it('tell a method book from a songbook and from anything else', () => {
    expect(isMethodBookId('seven-types')).toBe(true)
    expect(isMethodBookId('bozhe-spasibo')).toBe(false)
    expect(isMethodBookId('styles')).toBe(false)
  })
})
