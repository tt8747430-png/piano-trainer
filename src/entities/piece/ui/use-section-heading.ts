import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { localText, useLocale } from '@/shared/i18n'
import type { Piece, Section } from '../model/types'

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

/** The headings a piece's chart is shown under: its sections in order, or a one-string progression's one. */
export function usePieceHeadings(piece: Piece): string[] {
  const { t } = useTranslation('piece')
  const heading = useSectionHeading()
  if (piece.kind !== 'progression') return piece.sections.map(heading)
  return typeof piece.progression === 'string' ? [t('progression')] : piece.progression.map(heading)
}
