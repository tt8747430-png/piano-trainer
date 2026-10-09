import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { ProgressionsTool, type ProgressionsView } from '@/widgets/progressions'
import { ProgressionsTabs } from '@/widgets/subject-tabs'

/** Progressions: one from the library or typed, in any key, played and sent to the Player. */
export function ProgressionsPage() {
  const { t } = useTranslation('learn')
  const view = useSearch({ from: '/shell/practice/progressions' })
  const onChange = useViewChange<ProgressionsView>()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('progressions.title')}
        back={<BackButton fallback={{ to: '/practice' }} />}
        tabs={<ProgressionsTabs current="progression" />}
      />
      <ProgressionsTool view={view} onChange={onChange} />
    </div>
  )
}
