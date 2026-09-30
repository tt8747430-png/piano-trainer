import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { ReharmoniseTool, type ReharmoniseView } from '@/widgets/reharmonise'

/** Reharmonise: the chords that can go under a melody note, in the key or not. */
export function ReharmonisePage() {
  const { t } = useTranslation('learn')
  const view = useSearch({ from: '/shell/learn/reharmonise' })
  const navigate = useNavigate({ from: '/learn/reharmonise' })
  const onChange = (change: Partial<ReharmoniseView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('reharmonise.title')}
        back={<BackButton fallback={{ to: '/learn' }} />}
      />
      <ReharmoniseTool view={view} onChange={onChange} />
    </div>
  )
}
