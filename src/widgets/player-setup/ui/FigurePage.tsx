import { useTranslation } from 'react-i18next'
import { figureNeed, type FigureEntry, type PatternFit } from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import type { Figure } from '@/shared/lib/arrangement'
import { ChoiceList } from './ChoiceList'
import { ListPage } from './ListPage'

/**
 * A hand's page of the sheet: the pattern's own figure, or any figure for that hand; one the music
 * cannot play (a tune it lacks, its key's triads, inside the beat of 6/8) closed, with what it needs.
 */
export function FigurePage<Id extends string>({
  ids,
  figures,
  value,
  fit,
  onChoose,
  onBack,
}: {
  ids: readonly Id[]
  figures: Readonly<Record<Id, FigureEntry<Figure>>>
  /** The chosen figure; null is the pattern's own. */
  value: Id | null
  fit: PatternFit
  /** A figure, or undefined for the pattern's own. */
  onChoose: (id: Id | undefined) => void
  onBack: () => void
}) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  return (
    <ListPage onBack={onBack}>
      <ChoiceList<Id | null>
        items={[
          { value: null, label: t('ownFigure') },
          ...ids.map((id) => {
            const { name, figure } = figures[id]
            const need = figureNeed(figure, fit)
            return {
              value: id,
              label: localText(name, locale),
              ...(need ? { disabledNote: t(`needs.${need}`) } : {}),
            }
          }),
        ]}
        value={value}
        onChoose={(id) => onChoose(id ?? undefined)}
      />
    </ListPage>
  )
}
