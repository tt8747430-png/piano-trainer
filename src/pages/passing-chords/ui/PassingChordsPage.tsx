import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { PassingChordsTool, type PassingView } from '@/widgets/passing-chords'

/** Passing chords: the chords that can go between two, by category. */
export function PassingChordsPage() {
  const { t } = useTranslation('learn')
  const view = useSearch({ from: '/shell/learn/passing-chords' })
  const navigate = useNavigate({ from: '/learn/passing-chords' })
  const onChange = (change: Partial<PassingView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('passing.title')} back={<BackButton fallback={{ to: '/learn' }} />} />
      <PassingChordsTool view={view} onChange={onChange} />
    </div>
  )
}
