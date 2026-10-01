import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { IN_PLACE } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { ProgressionsTool, type ProgressionsView } from '@/widgets/progressions'

/** Progressions: numerals in any key, from the library or typed, played and practised. */
export function ProgressionsPage() {
  const { t } = useTranslation('learn')
  const view = useSearch({ from: '/shell/learn/progressions' })
  const navigate = useNavigate({ from: '/learn/progressions' })
  const onChange = (change: Partial<ProgressionsView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), ...IN_PLACE })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('progressions.title')}
        back={<BackButton fallback={{ to: '/learn' }} />}
      />
      <ProgressionsTool view={view} onChange={onChange} />
    </div>
  )
}
