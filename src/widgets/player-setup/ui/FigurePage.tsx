import { useTranslation } from 'react-i18next'
import type { FigureEntry } from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import type { Figure } from '@/shared/lib/arrangement'
import { ChoiceList } from './ChoiceList'
import { ListPage } from './ListPage'

/**
 * A hand's page of the sheet: the pattern's own figure, or any figure for that hand; one that
 * plays the tune is closed to a piece without a melody.
 */
export function FigurePage<Id extends string>({
  ids,
  figures,
  value,
  noMelody,
  onChoose,
  onBack,
}: {
  ids: readonly Id[]
  figures: Readonly<Record<Id, FigureEntry<Figure>>>
  /** The chosen figure; null is the pattern's own. */
  value: Id | null
  /** Why a figure that plays the tune is closed; nothing for a piece with a melody. */
  noMelody: string | undefined
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
          ...ids.map((id) => ({
            value: id,
            label: localText(figures[id].name, locale),
            ...(figures[id].figure.kind === 'melody' && noMelody ? { disabledNote: noMelody } : {}),
          })),
        ]}
        value={value}
        onChoose={(id) => onChoose(id ?? undefined)}
      />
    </ListPage>
  )
}
