import { useTranslation } from 'react-i18next'
import { TUPLET_COUNTS, type Duration, type TupletCount } from '@/shared/lib/notation'
import { isOneOf } from '@/shared/lib'
import { TUPLET_WORDS, VALUE_WORDS } from '../model/value-words'

const isTupletCount = isOneOf<TupletCount>(TUPLET_COUNTS)

/**
 * A note value in words, as the caret's line says it: "eighth", "dotted quarter", "double-dotted
 * half", "eighth triplet", "sixteenth quintuplet".
 */
export function useValueWord(): (duration: Duration) => string {
  const { t } = useTranslation('editor')
  return ({ value, dots, tuplet }) => {
    const word = t(`caret.values.${VALUE_WORDS[value]}`)
    const dotted =
      dots === 1
        ? t('caret.dotted', { value: word })
        : dots === 2
          ? t('caret.doubleDotted', { value: word })
          : word
    return tuplet && isTupletCount(tuplet.num)
      ? t('caret.tuplet', { value: dotted, tuplet: t(`caret.tuplets.${TUPLET_WORDS[tuplet.num]}`) })
      : dotted
  }
}
