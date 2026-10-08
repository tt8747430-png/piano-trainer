import type { Book, BookId, MethodBookId } from '../model/types'

/** The printed books a Source cites, titles and authors as printed. */
export const BOOKS: Readonly<Record<BookId, Book>> = {
  'bozhe-spasibo': { title: '«Боже, спасибо»', author: 'Надежда Боброва' },
  'called-to-play': { title: 'Called to Play for Him', author: 'A. Savchenko' },
  'seven-types': { title: 'Семь основных видов аккомпанемента', author: 'Н. В. Боброва' },
}

/** What a method book is called for short, in either language: its title, or its author's name. */
export const METHOD_BOOK_NAMES: Readonly<Record<MethodBookId, string>> = {
  'called-to-play': 'Called to Play',
  'seven-types': 'Боброва',
}
