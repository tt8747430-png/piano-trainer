import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGoBack } from '@/shared/lib'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { ProgressionsTool, type ProgressionsView } from '@/widgets/progressions'

/** Progressions: numerals in any key, from the library or typed, played and practised. */
export function ProgressionsPage() {
  const { t } = useTranslation(['learn', 'common'])
  const view = useSearch({ from: '/shell/learn/progressions' })
  const navigate = useNavigate({ from: '/learn/progressions' })
  const back = useGoBack({ to: '/learn' })
  const onChange = (change: Partial<ProgressionsView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('learn:progressions.title')}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />}
      />
      <ProgressionsTool view={view} onChange={onChange} />
    </div>
  )
}
