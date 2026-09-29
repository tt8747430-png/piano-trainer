import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGoBack } from '@/shared/lib'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { ChordFinder, type FinderView } from '@/widgets/chord-finder'

/** The Chord finder: play or tap keys, the app names the chord. */
export function ChordFinderPage() {
  const { t } = useTranslation(['learn', 'common'])
  const view = useSearch({ from: '/shell/learn/chord-finder' })
  const navigate = useNavigate({ from: '/learn/chord-finder' })
  const back = useGoBack({ to: '/learn' })
  const onChange = (change: Partial<FinderView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('learn:finder.title')}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />}
      />
      <ChordFinder view={view} onChange={onChange} />
    </div>
  )
}
