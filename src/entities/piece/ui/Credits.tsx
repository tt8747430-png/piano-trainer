import { useTranslation } from 'react-i18next'
import type { Credit } from '../model/types'

/** Who wrote it: each role in the learner's language, the names as printed. */
export function Credits({ credits }: { credits: readonly Credit[] }) {
  const { t } = useTranslation('piece')
  return (
    <div className="flex flex-col gap-0.5 text-sm">
      {credits.map((credit, i) =>
        credit.role === 'unknown' ? (
          <p key={i} className="text-muted-foreground">
            {t('credit.unknown')}
          </p>
        ) : (
          <p key={i} className="flex flex-wrap gap-x-1.5">
            <span className="text-muted-foreground">{t(`credit.${credit.role}`)}:</span>
            <span>{credit.names}</span>
          </p>
        ),
      )}
    </div>
  )
}
