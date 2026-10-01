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
import { ChoiceList } from './ChoiceList'
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
    <ListPage onBack={onBack}>
      {fit.methodCodes ? (
        <ChoiceList<PatternChoice>
          items={[
            { value: 'chart', label: t('fromChart'), description: t('fromChartDescription') },
          ]}
          value={value}
          onChoose={onChoose}
        />
      ) : null}
      {PATTERN_GROUPS.map((group) => (
        <section key={group} className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-muted-foreground">
            {localText(PATTERN_GROUP_NAMES[group], locale)}
          </h3>
          <ChoiceList<PatternChoice>
            items={patternsIn(group).map((id) => {
              const { name, description } = PATTERNS[id]
              const need = patternNeed(id, fit)
              return {
                value: id,
                label: localText(name, locale),
                ...(need
                  ? { disabledNote: t(`needs.${need}`) }
                  : description
                    ? { description: localText(description, locale) }
                    : {}),
              }
            })}
            value={value}
            onChoose={onChoose}
          />
        </section>
      ))}
    </ListPage>
  )
}
