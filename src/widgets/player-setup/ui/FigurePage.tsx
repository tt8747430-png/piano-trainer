import { useTranslation } from 'react-i18next'
import { figureNeed, type FigureEntry, type PatternFit } from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import type { Figure } from '@/shared/lib/arrangement'
import { FigureRoll } from './FigureRoll'
import { ListPage } from './ListPage'

/**
 * A hand's page of the sheet: the pattern's own part, or any part for that hand, under the headings
 * of its `sections` where it has them, each with a picture of what it plays in a bar (ADR 0115); one
 * the music cannot play (a tune it lacks, its key's triads, inside the beat of 6/8) closed, with what
 * it needs. Choosing one changes this hand alone, at once.
 */
export function FigurePage<Id extends string>({
  hand,
  label,
  ids,
  sections,
  figures,
  value,
  fit,
  onChoose,
  onBack,
}: {
  hand: 'rh' | 'lh'
  label: string
  ids: readonly Id[]
  /** The figures under headings, every one of `ids` once. */
  sections?: readonly { readonly label: string; readonly ids: readonly Id[] }[]
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
  const choice = (id: Id) => {
    const { name, figure } = figures[id]
    const need = figureNeed(figure, fit)
    return {
      key: id,
      label: localText(name, locale),
      note: need ? t(`needs.${need}`) : undefined,
      picture: <FigureRoll hand={hand} figure={figure} className="text-muted-foreground" />,
      selected: value === id,
      disabled: need !== null,
      onChoose: () => onChoose(id),
    }
  }
  const own = {
    key: 'own',
    label: t('ownFigure'),
    selected: value === null,
    onChoose: () => onChoose(undefined),
  }
  return (
    <ListPage
      label={label}
      onBack={onBack}
      groups={
        sections
          ? [
              { choices: [own] },
              ...sections.map((section) => ({
                label: section.label,
                choices: section.ids.map(choice),
              })),
            ]
          : [{ choices: [own, ...ids.map(choice)] }]
      }
    />
  )
}
