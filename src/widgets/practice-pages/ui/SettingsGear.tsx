import { Link } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RoundLink } from '@/shared/ui'

/**
 * Each Practice page with a gear, and the Settings page it opens (R32): only a page whose Settings hold
 * several things of its own. A page with one setting keeps it in place, and the piano's are the
 * keyboard strip's ⚙, so Chords, Exercises and the Quiz have no gear.
 */
const SETTINGS_OF = {
  scales: '/settings/scales',
  intervals: '/settings/intervals',
  progressions: '/settings/progressions',
  'chord-finder': '/settings/chord-finder',
} as const
export type GearPage = keyof typeof SETTINGS_OF

const PAGE_NAME = {
  scales: 'scales',
  intervals: 'intervals',
  progressions: 'progressions',
  'chord-finder': 'chordFinder',
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
