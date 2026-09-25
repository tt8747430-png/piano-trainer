import { useTranslation } from 'react-i18next'
import { BOOKS } from '../content/books'
import type { Source } from '../model/types'

/** The printed book it comes from, with its number and page there. */
export function SourceLine({ source }: { source: Source }) {
  const { t } = useTranslation('piece')
  const parts = [
    BOOKS[source.book].title,
    source.number === undefined ? null : t('source.number', { n: source.number }),
    source.page === undefined ? null : t('source.page', { n: source.page }),
  ].filter((part): part is string => part !== null)
  return <p className="text-sm text-muted-foreground">{parts.join(' · ')}</p>
}
