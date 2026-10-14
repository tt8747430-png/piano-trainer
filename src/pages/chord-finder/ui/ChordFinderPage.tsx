import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { ChordTabs } from '@/widgets/practice-pages'
import { ChordFinder, type FinderView } from '@/widgets/chord-finder'

/** The Chord finder, a tool: play or tap keys, and the app names the chord. */
export function ChordFinderPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/chords/find' })
  const onChange = useViewChange<FinderView>()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('pages.chords')}
        back={<BackButton fallback={{ to: '/practice' }} />}
        tabs={<ChordTabs current="find" />}
      />
      <ChordFinder view={view} onChange={onChange} />
    </div>
  )
}
