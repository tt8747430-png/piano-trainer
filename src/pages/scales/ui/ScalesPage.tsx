import { useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { ScaleExplorer, type ScaleView } from '@/widgets/scale-explorer'
import { GearButton, PianoButton } from '@/widgets/practice-pages'
import { StepPanel } from '@/widgets/step-panel'

/**
 * Scales and keys (the Scales board, R60, in the Chords page's shape): any scale on any root on one
 * page, with its path step's panel when opened from one.
 */
export function ScalesPage() {
  const { t } = useTranslation('practice')
  const { step, ...scale } = useSearch({ from: '/shell/practice/scales' })
  const onChange = useSetSearch<ScaleView>()
  const [settingsOpen, setSettingsOpen] = useState(false)
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader
        title={t('pages.scales')}
        back={<BackButton />}
        settings={
          <>
            <GearButton
              title={t('scales.settings')}
              open={settingsOpen}
              onOpen={() => setSettingsOpen(true)}
            />
            <PianoButton />
          </>
        }
      />
      {step ? <StepPanel step={step} /> : null}
      <ScaleExplorer
        scale={scale}
        onChange={onChange}
        settings={{ open: settingsOpen, onOpenChange: setSettingsOpen }}
      />
    </div>
  )
}
