import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGoBack } from '@/shared/lib'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { ReharmoniseTool, type ReharmoniseView } from '@/widgets/reharmonise'

/** Reharmonise: the chords that can go under a melody note, in the key or not. */
export function ReharmonisePage() {
  const { t } = useTranslation(['learn', 'common'])
  const view = useSearch({ from: '/shell/learn/reharmonise' })
  const navigate = useNavigate({ from: '/learn/reharmonise' })
  const back = useGoBack({ to: '/learn' })
  const onChange = (change: Partial<ReharmoniseView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('learn:reharmonise.title')}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />}
      />
      <ReharmoniseTool view={view} onChange={onChange} />
    </div>
  )
}
