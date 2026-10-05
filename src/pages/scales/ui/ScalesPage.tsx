import { useSearch } from '@tanstack/react-router'
import { Dices } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { keyScale, noteParam, randomKey } from '@/shared/lib/music'
import { BackButton, RoundButton, ScreenHeader } from '@/shared/ui'
import { keyOfScale, ScaleExplorer, type ScaleView } from '@/widgets/scale-explorer'
import { StepPanel } from '@/widgets/step-panel'
import { PiecesInKey } from './PiecesInKey'

/**
 * Scales and keys: any scale on any root, with its path step's panel when opened from one; in its
 * Key view, a random key from the bar and the songs and studies written in the key.
 */
export function ScalesPage() {
  const { t } = useTranslation('learn')
  const { step, ...scale } = useSearch({ from: '/shell/practice/scales' })
  const onChange = useViewChange<ScaleView>()
  const key = scale.show === 'key' ? keyOfScale(scale.root, scale.kind) : null
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('scales')}
        back={<BackButton fallback={{ to: '/practice' }} />}
        actions={
          key ? (
            <RoundButton
              label={t('keys.random')}
              icon={Dices}
              onClick={() => {
                const next = randomKey(Math.random, key)
                onChange({ root: noteParam(next.tonic), kind: keyScale(next) })
              }}
            />
          ) : null
        }
      />
      {step ? <StepPanel step={step} /> : null}
      <ScaleExplorer scale={scale} onChange={onChange} />
      {key ? <PiecesInKey musicKey={key} /> : null}
    </div>
  )
}
