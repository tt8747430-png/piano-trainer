import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { ProgressionTabs } from '@/widgets/practice-pages'
import { ProgressionExplorer, type ProgressionsView } from '@/widgets/progression-explorer'

/** Progressions: one from the library or typed, in any key, played and sent to the Player. */
export function ProgressionsPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/progressions' })
  const onChange = useViewChange<ProgressionsView>()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('pages.progressions')}
        back={<BackButton fallback={{ to: '/practice' }} />}
        tabs={<ProgressionTabs current="play" progression={view} />}
      />
      <ProgressionExplorer view={view} onChange={onChange} />
    </div>
  )
}
