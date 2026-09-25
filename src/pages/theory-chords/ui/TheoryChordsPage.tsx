import { useNavigate, useSearch } from '@tanstack/react-router'
import { ChordExplorer, type ChordView } from '@/widgets/chord-explorer'
import { StepPanel } from '@/widgets/step-panel'

export function TheoryChordsPage() {
  const { step, ...chord } = useSearch({ from: '/shell/theory/chords' })
  const navigate = useNavigate({ from: '/theory/chords' })
  const onChange = (change: Partial<ChordView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      {step ? <StepPanel step={step} /> : null}
      <ChordExplorer chord={chord} onChange={onChange} />
    </div>
  )
}
