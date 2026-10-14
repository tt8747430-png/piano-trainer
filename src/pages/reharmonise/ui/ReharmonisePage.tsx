import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { ProgressionTabs } from '@/widgets/practice-pages'
import { ReharmoniseTool, type ReharmoniseView } from '@/widgets/reharmonise'

/** Reharmonise, a tool: the chords that can go under a melody note, in the key or not. */
export function ReharmonisePage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/progressions/reharmonise' })
  const onChange = useViewChange<ReharmoniseView>()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('pages.progressions')}
        back={<BackButton fallback={{ to: '/practice' }} />}
        tabs={<ProgressionTabs current="reharmonise" musicKey={view.key} />}
      />
      <ReharmoniseTool view={view} onChange={onChange} />
    </div>
  )
}
