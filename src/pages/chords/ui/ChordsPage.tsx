import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGoBack } from '@/shared/lib'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { ChordExplorer, type ChordView } from '@/widgets/chord-explorer'
import { StepPanel } from '@/widgets/step-panel'

/** The Chords reference: any chord on any root, with its path step's panel when opened from one. */
export function ChordsPage() {
  const { t } = useTranslation(['learn', 'common'])
  const { step, ...chord } = useSearch({ from: '/shell/learn/chords' })
  const navigate = useNavigate({ from: '/learn/chords' })
  const back = useGoBack({ to: '/learn' })
  const onChange = (view: ChordView) =>
    void navigate({ search: (prev) => ({ ...prev, ...view }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('learn:chords')}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />}
      />
      {step ? <StepPanel step={step} /> : null}
      <ChordExplorer chord={chord} onChange={onChange} />
    </div>
  )
}
