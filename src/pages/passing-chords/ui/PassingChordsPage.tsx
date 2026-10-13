import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { PassingChordsTool, type PassingView } from '@/widgets/passing-chords'

/** Passing chords, a tool: the chords that can go between two, by category. */
export function PassingChordsPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/passing-chords' })
  const onChange = useViewChange<PassingView>()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('pages.passingChords')}
        back={<BackButton fallback={{ to: '/practice' }} />}
      />
      <PassingChordsTool view={view} onChange={onChange} />
    </div>
  )
}
