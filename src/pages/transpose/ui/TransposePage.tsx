import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { ProgressionTabs } from '@/widgets/practice-pages'
import { TransposeTool, type TransposeView } from '@/widgets/transpose'

/** Transpose, a tool (ADR 0045): a song's chords read in their key as degrees, and played in any key. */
export function TransposePage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/progressions/transpose' })
  const onChange = useViewChange<TransposeView>()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('pages.progressions')}
        back={<BackButton fallback={{ to: '/practice' }} />}
        tabs={<ProgressionTabs current="transpose" musicKey={view.key} />}
      />
      <TransposeTool view={view} onChange={onChange} />
    </div>
  )
}
