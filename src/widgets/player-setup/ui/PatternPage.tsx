import { useTranslation } from 'react-i18next'
import {
  PATTERN_GROUP_NAMES,
  PATTERN_GROUPS,
  PATTERNS,
  patternNeed,
  patternsIn,
  type PatternChoice,
  type PatternFit,
} from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import { ListPage } from './ListPage'

/**
 * The sheet's page of patterns, group by group: From the chart first where the chart names its
 * methods; a pattern the music cannot play closed, with what it needs.
 */
export function PatternPage({
  value,
  fit,
  onChoose,
  onBack,
}: {
  value: PatternChoice
  fit: PatternFit
  onChoose: (pattern: PatternChoice) => void
  onBack: () => void
}) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  return (
    <ListPage
      label={t('pattern')}
      onBack={onBack}
      groups={[
        ...(fit.methodCodes
          ? [
              {
                choices: [
                  {
                    key: 'chart',
                    label: t('fromChart'),
                    note: t('fromChartDescription'),
                    selected: value === 'chart',
                    onChoose: () => onChoose('chart'),
                  },
                ],
              },
            ]
          : []),
        ...PATTERN_GROUPS.map((group) => ({
          label: localText(PATTERN_GROUP_NAMES[group], locale),
          choices: patternsIn(group).map((id) => {
            const { name, description } = PATTERNS[id]
            const need = patternNeed(id, fit)
            return {
              key: id,
              label: localText(name, locale),
              note: need ? t(`needs.${need}`) : description && localText(description, locale),
              selected: value === id,
              disabled: need !== null,
              onChoose: () => onChoose(id),
            }
          }),
        })),
      ]}
    />
  )
}
