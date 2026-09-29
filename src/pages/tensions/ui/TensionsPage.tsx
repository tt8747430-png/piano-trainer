import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGoBack } from '@/shared/lib'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { TensionExplorer, type TensionView } from '@/widgets/tension-explorer'

/** The Available tensions reference: the owner's table, computed for a 7th chord on any root. */
export function TensionsPage() {
  const { t } = useTranslation(['learn', 'common'])
  const view = useSearch({ from: '/shell/learn/tensions' })
  const navigate = useNavigate({ from: '/learn/tensions' })
  const back = useGoBack({ to: '/learn' })
  const onChange = (change: Partial<TensionView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('learn:tensions.title')}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />}
      />
      <TensionExplorer view={view} onChange={onChange} />
    </div>
  )
}
