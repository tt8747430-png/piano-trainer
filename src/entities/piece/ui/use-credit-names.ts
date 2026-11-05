import { useTranslation } from 'react-i18next'

/**
 * The few credits the content prints in words rather than names, each said in the learner's
 * language; every other credit is a name, kept as printed.
 */
const SAID = {
  Traditional: 'traditional',
  'New Britain (American folk tune)': 'newBritain',
} as const satisfies Record<string, string>

const isSaid = (names: string): names is keyof typeof SAID => Object.hasOwn(SAID, names)

/** A credit's names as the learner reads them: a folk tune's words said, every name as printed. */
export function useCreditNames(): (names: string) => string {
  const { t } = useTranslation('piece')
  return (names) => (isSaid(names) ? t(`credit.said.${SAID[names]}`) : names)
}
