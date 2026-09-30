import { useTranslation } from 'react-i18next'
import type { FigureEntry } from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import { playsKeyTriads, splitsTheBeat, type Figure } from '@/shared/lib/arrangement'
import { ChoiceList } from './ChoiceList'
import { ListPage } from './ListPage'

/**
 * A hand's page of the sheet: the pattern's own figure, or any figure for that hand; one that
 * plays the tune is closed to a piece without a melody, one that plays the key's triads to a source
 * without a key, one that plays inside the beat to a piece in 6/8 or 12/8.
 */
export function FigurePage<Id extends string>({
  ids,
  figures,
  value,
  noMelody,
  noKey,
  noSimpleTime,
  onChoose,
  onBack,
}: {
  ids: readonly Id[]
  figures: Readonly<Record<Id, FigureEntry<Figure>>>
  /** The chosen figure; null is the pattern's own. */
  value: Id | null
  /** Why a figure that plays the tune is closed; nothing for a piece with a melody. */
  noMelody: string | undefined
  /** Why a figure that plays the key's triads is closed; nothing for a source in a key. */
  noKey: string | undefined
  /** Why a figure that plays inside the beat is closed; nothing for a piece in simple time. */
  noSimpleTime: string | undefined
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
            const closed =
              figure.kind === 'melody'
                ? noMelody
                : playsKeyTriads(figure)
                  ? noKey
                  : splitsTheBeat(figure)
                    ? noSimpleTime
                    : undefined
            return {
              value: id,
              label: localText(name, locale),
              ...(closed ? { disabledNote: closed } : {}),
            }
          }),
        ]}
        value={value}
        onChoose={(id) => onChoose(id ?? undefined)}
      />
    </ListPage>
  )
}
