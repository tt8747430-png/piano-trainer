import type { MethodBookId } from '@/entities/book'
import { METHOD_BOOK_PIECES, useRepertoire } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import { PieceList } from '@/widgets/piece-list'

/**
 * The pieces a method book's patterns are practised on, under their collection's name: each in the
 * learner's version, opening its page on its shelf.
 */
export function BookPieces({ book }: { book: MethodBookId }) {
  const locale = useLocale()
  const pieces = useRepertoire()
  const { id, name, entries } = METHOD_BOOK_PIECES[book]
  return (
    <PieceList
      groups={[
        {
          id,
          heading: localText(name, locale),
          entries: entries.map((entry) => pieces.entry(entry.id) ?? entry),
        },
      ]}
    />
  )
}
