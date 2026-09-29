import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGoBack } from '@/shared/lib'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { PassingChordsTool, type PassingView } from '@/widgets/passing-chords'

/** Passing chords: the chords that can go between two, by category. */
export function PassingChordsPage() {
  const { t } = useTranslation(['learn', 'common'])
  const view = useSearch({ from: '/shell/learn/passing-chords' })
  const navigate = useNavigate({ from: '/learn/passing-chords' })
  const back = useGoBack({ to: '/learn' })
  const onChange = (change: Partial<PassingView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('learn:passing.title')}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />}
      />
      <PassingChordsTool view={view} onChange={onChange} />
    </div>
  )
}
