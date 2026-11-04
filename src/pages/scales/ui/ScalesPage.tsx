import { useSearch } from '@tanstack/react-router'
import { Dices } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import {
  keyScale,
  keySignature,
  noteFromParam,
  noteParam,
  randomKey,
  scaleChords,
  spellScale,
} from '@/shared/lib/music'
import { BackButton, RoundButton, ScreenHeader, Segmented } from '@/shared/ui'
import {
  keyOfScale,
  ScaleExplorer,
  showsOf,
  type ScaleShow,
  type ScaleView,
} from '@/widgets/scale-explorer'
import { SettingsGear } from '@/widgets/practice-pages'
import { ToolsButton } from '@/widgets/tools-sheet'
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
  // A scale with one view (a blues scale's Scale alone) draws no views control (R30).
  const views = showsOf(scale.kind)
  const key = scale.show === 'key' ? keyOfScale(scale.root, scale.kind) : null
  // What each view holds of this scale, under its name (R29-P7): one choice, three views of it.
  const summary = (show: ScaleShow): string => {
    const tonic = noteFromParam(scale.root)
    if (show === 'scale')
      return t('scales.views.notes', { count: spellScale(tonic, scale.kind).length })
    if (show === 'chords') {
      const chords = scaleChords(tonic, scale.kind, 3)
      return `${chords[0]?.roman ?? ''}–${chords.at(-1)?.roman ?? ''}`
    }
    const inKey = keyOfScale(scale.root, scale.kind)
    const count = inKey ? keySignature(inKey) : 0
    if (count === 0) return t('scales.views.plain')
    return t(count > 0 ? 'scales.views.sharps' : 'scales.views.flats', { count: Math.abs(count) })
  }
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
            <ToolsButton />
            <SettingsGear page="scales" />
          </>
        }
      />
      {step ? <StepPanel step={step} /> : null}
      {/* The scale's views, the same scale under another light: in the page, never a second bar row. */}
      {views.length > 1 ? (
        <Segmented
          label={t('pages.scales')}
          value={scale.show}
          options={views.map((show) => ({
            value: show,
            label: t(`scales.show.${show}`),
            detail: summary(show),
          }))}
          onChange={(show) => onChange({ show })}
        />
      ) : null}
      <ScaleExplorer scale={scale} onChange={onChange} />
      {key ? <PiecesInKey musicKey={key} /> : null}
    </div>
  )
}
