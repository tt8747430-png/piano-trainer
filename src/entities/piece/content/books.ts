import type { BookId } from '../model/types'

/** The printed books a Source cites, titles and authors as printed. */
export const BOOKS: Readonly<Record<BookId, { readonly title: string; readonly author: string }>> =
  {
    'bozhe-spasibo': { title: '«Боже, спасибо»', author: 'Надежда Боброва' },
    'called-to-play': { title: 'Called to Play for Him', author: 'A. Savchenko' },
    'seven-types': { title: 'Семь основных видов аккомпанемента', author: 'Н. В. Боброва' },
  }
