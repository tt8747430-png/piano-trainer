import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { ChordExplorer, type ChordView } from '@/widgets/chord-explorer'
import { StepPanel } from '@/widgets/step-panel'
import { ChordsTabs } from '@/widgets/subject-tabs'

/** Chords' Build: any chord on any root, with its path step's panel when opened from one. */
export function ChordsPage() {
  const { t } = useTranslation('learn')
  const { step, ...chord } = useSearch({ from: '/shell/practice/chords' })
  const onChange = useViewChange<ChordView>()
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <ScreenHeader title={t('chords')} back={<BackButton fallback={{ to: '/practice' }} />} />
        <ChordsTabs current="build" />
      </div>
      {step ? <StepPanel step={step} /> : null}
      <ChordExplorer chord={chord} onChange={onChange} />
    </div>
  )
}
