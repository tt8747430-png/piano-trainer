import { useTranslation } from 'react-i18next'
import { useShortcuts, type Shortcut } from '@/shared/lib/shortcuts'

/** The number keys, by physical key: an answer's place among the answers. */
const PLACES = [
  'Digit1',
  'Digit2',
  'Digit3',
  'Digit4',
  'Digit5',
  'Digit6',
  'Digit7',
  'Digit8',
  'Digit9',
]

/**
 * A round from the computer's keys: Enter is the round's one action (Check, then Next), a number
 * chooses the answer in that place while answers are offered, and R plays the round again where it
 * has a sound.
 */
export function useRoundShortcuts({
  act,
  answers,
  hear,
}: {
  /** The round's action now; null while there is nothing to check yet. */
  act: (() => void) | null
  /** Choosing each answer offered, in their places; none once answered. */
  answers: readonly (() => void)[]
  /** Plays the round's sound again; null for a round with none. */
  hear: (() => void) | null
}): void {
  const { t } = useTranslation('quiz')
  const chosen: Shortcut[] = answers.flatMap((choose, place) => {
    const code = PLACES[place]
    return code
      ? [{ label: t('shortcuts.answer'), combo: { code }, hidden: true, run: choose }]
      : []
  })
  useShortcuts(t('shortcuts.group'), [
    { label: t('shortcuts.act'), combo: { key: 'Enter' }, run: () => act?.() },
    ...chosen,
    ...(chosen.length > 0 ? [{ label: t('shortcuts.answer'), shown: ['1', '–', '9'] }] : []),
    ...(hear ? [{ label: t('shortcuts.hear'), combo: { code: 'KeyR' }, run: hear }] : []),
  ])
}
