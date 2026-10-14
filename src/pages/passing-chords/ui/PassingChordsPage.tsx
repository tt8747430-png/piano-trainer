import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { ProgressionTabs } from '@/widgets/practice-pages'
import { PassingChordsTool, type PassingView } from '@/widgets/passing-chords'

/** Passing chords, a tool: the chords that can go between two, by category. */
export function PassingChordsPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/progressions/passing' })
  const onChange = useViewChange<PassingView>()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('pages.progressions')}
        back={<BackButton fallback={{ to: '/practice' }} />}
        tabs={<ProgressionTabs current="passing" musicKey={view.key} />}
      />
      <PassingChordsTool view={view} onChange={onChange} />
    </div>
  )
}
