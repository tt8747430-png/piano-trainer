import { useTranslation } from 'react-i18next'
import type { Credit } from '../model/types'
import { useCreditNames } from './use-credit-names'

/** Who wrote it: each role in the learner's language, the names as printed, a folk tune's words said. */
export function Credits({ credits }: { credits: readonly Credit[] }) {
  const { t } = useTranslation('piece')
  const said = useCreditNames()
  return (
    <p className="text-[0.9375rem] text-pretty text-muted-foreground">
      {credits
        .map((credit) =>
          credit.role === 'unknown'
            ? t('credit.unknown')
            : `${t(`credit.${credit.role}`)}: ${said(credit.names)}`,
        )
        .join(' · ')}
    </p>
  )
}
