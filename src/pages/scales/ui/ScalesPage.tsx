import { useSearch } from '@tanstack/react-router'
import { PageKeyboardTools } from '@/features/live-keyboard'
import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import { BackButton, ScreenHeader, Segmented } from '@/shared/ui'
import { keyOfScale, ScaleExplorer, showsOf, type ScaleView } from '@/widgets/scale-explorer'
import { SettingsGear } from '@/widgets/practice-pages'
import { StepPanel } from '@/widgets/step-panel'
import { PiecesInKey } from './PiecesInKey'

/**
 * Scales and keys (canvas 174, in the Chords page's shape): any scale on any root, with its path
 * step's panel when opened from one; Scale · Chords · Key under its name; in its Key view, the songs
 * and studies written in the key.
 */
export function ScalesPage() {
  const { t } = useTranslation('practice')
  const { step, ...scale } = useSearch({ from: '/shell/practice/scales' })
  const onChange = useSetSearch<ScaleView>()
  // A scale with one view (a blues scale's Scale alone) draws no views control (R30).
  const views = showsOf(scale.kind)
  const key = scale.show === 'key' ? keyOfScale(scale.root, scale.kind) : null
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader
        title={t('pages.scales')}
        back={<BackButton variant="glass" />}
        tools={<PageKeyboardTools />}
        settings={<SettingsGear page="scales" />}
      />
      {step ? <StepPanel step={step} /> : null}
      <ScaleExplorer
        scale={scale}
        onChange={onChange}
        views={
          views.length > 1 ? (
            <Segmented
              label={t('pages.scales')}
              value={scale.show}
              options={views.map((show) => ({
                value: show,
                label: t(`scales.show.${show}`),
              }))}
              onChange={(show) => onChange({ show })}
            />
          ) : null
        }
      />
      {key ? <PiecesInKey musicKey={key} /> : null}
    </div>
  )
}
