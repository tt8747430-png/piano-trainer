import { useTranslation } from 'react-i18next'
import type { Duration } from '@/shared/lib/notation'
import { VALUE_WORDS } from '../model/value-words'

/** A note value in words, as the caret's line says it: "eighth", "dotted quarter", "eighth triplet". */
export function useValueWord(): (duration: Duration) => string {
  const { t } = useTranslation('editor')
  return ({ value, dots, triplet }) => {
    const word = t(`caret.values.${VALUE_WORDS[value]}`)
    if (dots === 1) return t('caret.dotted', { value: word })
    return triplet ? t('caret.triplet', { value: word }) : word
  }
}
