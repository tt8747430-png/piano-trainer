import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { ChordTabs } from '@/widgets/practice-pages'
import { ChordExplorer, type ChordView } from '@/widgets/chord-explorer'
import { StepPanel } from '@/widgets/step-panel'

/** Chords: any chord built on any root, with its path step's panel when opened from one. */
export function ChordsPage() {
  const { t } = useTranslation('practice')
  const { step, ...chord } = useSearch({ from: '/shell/practice/chords' })
  const onChange = useViewChange<ChordView>()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('pages.chords')}
        back={<BackButton fallback={{ to: '/practice' }} />}
        tabs={<ChordTabs current="build" chord={chord} />}
      />
      {step ? <StepPanel step={step} /> : null}
      <ChordExplorer chord={chord} onChange={onChange} />
    </div>
  )
}
