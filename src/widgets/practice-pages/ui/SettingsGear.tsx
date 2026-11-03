import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RoundLink } from '@/shared/ui'

/** Each Practice page with a gear, and the Settings page it opens: Exercises and the Quiz share one. */
const SETTINGS_OF = {
  chords: '/settings/chords',
  scales: '/settings/scales',
  intervals: '/settings/intervals',
  progressions: '/settings/progressions',
  accompaniment: '/settings/accompaniment',
  'chord-finder': '/settings/chord-finder',
  exercises: '/settings/exercises-and-quiz',
  quiz: '/settings/exercises-and-quiz',
} as const
export type GearPage = keyof typeof SETTINGS_OF

const PAGE_NAME = {
  chords: 'chords',
  scales: 'scales',
  intervals: 'intervals',
  progressions: 'progressions',
  accompaniment: 'accompaniment',
  'chord-finder': 'chordFinder',
  exercises: 'exercises',
  quiz: 'quiz',
} as const satisfies Record<GearPage, string>

/**
 * A Practice page's gear (A24, R18), in its bar: its Settings page, the same one Settings lists,
 * opened with the page named so Back returns to it.
 */
export function SettingsGear({ page }: { page: GearPage }) {
  const { t } = useTranslation('practice')
  return (
    <RoundLink
      label={t('settings.open', { page: t(`pages.${PAGE_NAME[page]}`) })}
      icon={Settings}
      render={<Link to={SETTINGS_OF[page]} search={{ from: page }} />}
    />
  )
}
