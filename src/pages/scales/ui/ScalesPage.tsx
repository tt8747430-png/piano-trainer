import { useSearch } from '@tanstack/react-router'
import { Dices } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import { keyScale, noteParam, randomKey } from '@/shared/lib/music'
import { BackButton, RoundButton, ScreenHeader, Segmented } from '@/shared/ui'
import { keyOfScale, ScaleExplorer, showsOf, type ScaleView } from '@/widgets/scale-explorer'
import { SettingsGear } from '@/widgets/practice-pages'
import { StepPanel } from '@/widgets/step-panel'
import { PiecesInKey } from './PiecesInKey'

/**
 * Scales and keys: any scale on any root, with its path step's panel when opened from one; in its
 * Key view, a random key from the bar, the key's tool, and the songs and studies written in the key.
 */
export function ScalesPage() {
  const { t } = useTranslation('practice')
  const { step, ...scale } = useSearch({ from: '/shell/practice/scales' })
  const onChange = useSetSearch<ScaleView>()
  const key = scale.show === 'key' ? keyOfScale(scale.root, scale.kind) : null
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('pages.scales')}
        back={<BackButton />}
        actions={
          <>
            {key ? (
              <RoundButton
                label={t('scales.key.random')}
                icon={Dices}
                onClick={() => {
                  const next = randomKey(Math.random, key)
                  onChange({ root: noteParam(next.tonic), kind: keyScale(next) })
                }}
              />
            ) : null}
            <SettingsGear page="scales" />
          </>
        }
      />
      {step ? <StepPanel step={step} /> : null}
      {/* The scale's views, the same scale under another light: in the page, never a second bar row. */}
      <Segmented
        label={t('pages.scales')}
        value={scale.show}
        options={showsOf(scale.kind).map((show) => ({
          value: show,
          label: t(`scales.show.${show}`),
        }))}
        onChange={(show) => onChange({ show })}
      />
      <ScaleExplorer scale={scale} onChange={onChange} />
      {key ? <PiecesInKey musicKey={key} /> : null}
    </div>
  )
}
