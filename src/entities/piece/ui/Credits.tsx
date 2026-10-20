import { useTranslation } from 'react-i18next'
import type { Credit } from '../model/types'

/**
 * The few credits the content prints in words rather than names, each said in the learner's
 * language; every other credit is a name, kept as printed.
 */
const SAID = {
  Traditional: 'traditional',
  'New Britain (American folk tune)': 'newBritain',
} as const satisfies Record<string, string>

const isSaid = (names: string): names is keyof typeof SAID => Object.hasOwn(SAID, names)

/** Who wrote it: each role in the learner's language, the names as printed, a folk tune's words said. */
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
            <span>
              {isSaid(credit.names) ? t(`credit.said.${SAID[credit.names]}`) : credit.names}
            </span>
          </p>
        ),
      )}
    </div>
  )
}
