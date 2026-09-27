import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGoBack } from '@/shared/lib'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { ScaleExplorer, type ScaleView } from '@/widgets/scale-explorer'
import { StepPanel } from '@/widgets/step-panel'

/** The Scales reference: any scale on any root, with its path step's panel when opened from one. */
export function ScalesPage() {
  const { t } = useTranslation(['learn', 'common'])
  const { step, ...scale } = useSearch({ from: '/shell/learn/scales' })
  const navigate = useNavigate({ from: '/learn/scales' })
  const back = useGoBack({ to: '/learn' })
  const onChange = (change: Partial<ScaleView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('learn:scales')}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />}
      />
      {step ? <StepPanel step={step} /> : null}
      <ScaleExplorer scale={scale} onChange={onChange} />
    </div>
  )
}
