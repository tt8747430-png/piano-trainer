import { useNavigate, useSearch } from '@tanstack/react-router'
import { ScaleExplorer, type ScaleView } from '@/widgets/scale-explorer'
import { StepPanel } from '@/widgets/step-panel'

export function TheoryScalesPage() {
  const { step, ...scale } = useSearch({ from: '/shell/theory/scales' })
  const navigate = useNavigate({ from: '/theory/scales' })
  const onChange = (change: Partial<ScaleView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      {step ? <StepPanel step={step} /> : null}
      <ScaleExplorer scale={scale} onChange={onChange} />
    </div>
  )
}
