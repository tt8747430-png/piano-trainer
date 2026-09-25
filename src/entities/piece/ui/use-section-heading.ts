import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { localText, useLocale } from '@/shared/i18n'
import type { Section } from '../model/types'

/** A section's heading in the learner's language: "Verse 4 and ending", "Последний припев в ля миноре". */
export function useSectionHeading(): (section: Section) => string {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  return useCallback(
    (section) => {
      const base =
        section.kind === 'verse' && section.n !== undefined
          ? t('section.verseNumbered', { n: section.n })
          : section.kind === 'chorus' && section.last
            ? t('section.lastChorus')
            : section.kind === 'ending' && section.last
              ? t('section.lastEnding')
              : section.kind === 'part' && section.label
                ? t('section.partLabelled', { label: section.label })
                : t(`section.${section.kind}`)
      return section.detail ? `${base} ${localText(section.detail, locale)}` : base
    },
    [t, locale],
  )
}
