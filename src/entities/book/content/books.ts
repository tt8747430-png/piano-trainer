import type { LocalText } from '@/shared/i18n'
import type { Book, BookId, MethodBookId } from '../model/types'

/** The printed books a Source cites, titles and authors as printed. */
export const BOOKS: Readonly<Record<BookId, Book>> = {
  'bozhe-spasibo': { title: '«Боже, спасибо»', author: 'Надежда Боброва' },
  'called-to-play': { title: 'Called to Play for Him', author: 'A. Savchenko' },
  'called-to-play-2': { title: 'Призван играть для Него. Уровень 2', author: 'Александр Савченко' },
  'seven-types': { title: 'Семь основных видов аккомпанемента', author: 'Н. В. Боброва' },
  gorshkov: { title: 'Курс по аккомпанементу', author: 'Василий Горшков' },
}

/**
 * What a method book is called for short: its title, or its author's name, transliterated in English
 * and in Cyrillic in Russian (A25), never two scripts in one interface.
 */
export const METHOD_BOOK_NAMES: Readonly<Record<MethodBookId, LocalText>> = {
  'called-to-play': { en: 'Called to Play', ru: 'Призван играть' },
  'called-to-play-2': { en: 'Called to Play 2', ru: 'Призван играть 2' },
  'seven-types': { en: 'Bobrova', ru: 'Боброва' },
  gorshkov: { en: 'Gorshkov', ru: 'Горшков' },
}
