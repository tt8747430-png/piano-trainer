import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { ChordFinder, type FinderView } from '@/widgets/chord-finder'

/** The Chord finder: play or tap keys, the app names the chord. */
export function ChordFinderPage() {
  const { t } = useTranslation('learn')
  const view = useSearch({ from: '/shell/practice/chord-finder' })
  const onChange = useViewChange<FinderView>()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('finder.title')}
        back={<BackButton fallback={{ to: '/practice' }} />}
      />
      <ChordFinder view={view} onChange={onChange} />
    </div>
  )
}
