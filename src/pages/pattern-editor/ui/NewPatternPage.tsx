import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { usePatternBook } from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import { PatternEditor } from './PatternEditor'

/** What a new pattern starts as with nothing to start from: whole notes, a chord over its root. */
const PLAIN = { rh: 'x1', lh: 'r' } as const

/** A new pattern of the learner's own: from a pattern (Make your own from it), or from plain whole notes. */
export function NewPatternPage() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const { from } = useSearch({ from: '/shell/learn/patterns/new' })
  const book = usePatternBook()
  const source = from ? book.get(from) : undefined
  const start = source
    ? {
        name: t('patterns.editor.mine', { name: localText(source.name, locale) }),
        rh: source.rh,
        lh: source.lh,
      }
    : { name: '', ...PLAIN }
  return <PatternEditor key={from ?? 'plain'} title={t('patterns.editor.newTitle')} start={start} />
}
