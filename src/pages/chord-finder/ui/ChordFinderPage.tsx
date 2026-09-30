import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { ChordFinder, type FinderView } from '@/widgets/chord-finder'

/** The Chord finder: play or tap keys, the app names the chord. */
export function ChordFinderPage() {
  const { t } = useTranslation('learn')
  const view = useSearch({ from: '/shell/learn/chord-finder' })
  const navigate = useNavigate({ from: '/learn/chord-finder' })
  const onChange = (change: Partial<FinderView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('finder.title')} back={<BackButton fallback={{ to: '/learn' }} />} />
      <ChordFinder view={view} onChange={onChange} />
    </div>
  )
}
