import { useTranslation } from 'react-i18next'
import { type SheetCreditLines } from './sheet-credits'

/** Who wrote it, in one line, as a score prints it: "Words: John Newton · Music: New Britain"; none
 * without a name. The sheet's credits print it; the Player's bar carries it under the title. */
export function useCreditLine(credits: SheetCreditLines | undefined): string {
  const { t } = useTranslation('common')
  if (credits === undefined) return ''
  const { composer, lyricist, arranger, translator, tune } = credits
  const both = lyricist !== undefined && lyricist === composer
  return [
    both ? t('sheetCredits.wordsAndMusic', { names: lyricist }) : null,
    !both && lyricist ? t('sheetCredits.words', { names: lyricist }) : null,
    translator ? t('sheetCredits.translator', { names: translator }) : null,
    !both && composer ? t('sheetCredits.music', { names: composer }) : null,
    tune ? t('sheetCredits.tune', { names: tune }) : null,
    arranger ? t('sheetCredits.arranger', { names: arranger }) : null,
  ]
    .filter((part) => part !== null)
    .join(' · ')
}
