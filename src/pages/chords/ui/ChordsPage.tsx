import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { ChordExplorer, type ChordView } from '@/widgets/chord-explorer'
import { StepPanel } from '@/widgets/step-panel'

/** The Chords reference: any chord on any root, with its path step's panel when opened from one. */
export function ChordsPage() {
  const { t } = useTranslation('learn')
  const { step, ...chord } = useSearch({ from: '/shell/learn/chords' })
  const navigate = useNavigate({ from: '/learn/chords' })
  const onChange = (view: ChordView) =>
    void navigate({ search: (prev) => ({ ...prev, ...view }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('chords')} back={<BackButton fallback={{ to: '/learn' }} />} />
      {step ? <StepPanel step={step} /> : null}
      <ChordExplorer chord={chord} onChange={onChange} />
    </div>
  )
}
