import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { IN_PLACE } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { TensionExplorer, type TensionView } from '@/widgets/tension-explorer'

/** The Available tensions reference: the owner's table, computed for a 7th chord on any root. */
export function TensionsPage() {
  const { t } = useTranslation('learn')
  const view = useSearch({ from: '/shell/learn/tensions' })
  const navigate = useNavigate({ from: '/learn/tensions' })
  const onChange = (change: Partial<TensionView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), ...IN_PLACE })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('tensions.title')} back={<BackButton fallback={{ to: '/learn' }} />} />
      <TensionExplorer view={view} onChange={onChange} />
    </div>
  )
}
