import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { scaleShown } from '@/features/play-example'
import { noteFromParam, noteName, spellScale } from '@/shared/lib/music'
import { runSounds } from '@/shared/lib/schedule'
import { Dropdown, NamedSegmented, Segmented } from '@/shared/ui'
import { scaleRunOf } from '../model/scale-run'
import type { ScaleView } from '../model/scale-view'
import { FingeringTable } from './FingeringTable'
import { ScaleLayout } from './ScaleLayout'
import { ScalePractice } from './ScalePractice'
import { ScaleSheet } from './ScaleSheet'

/** The Fingers choice: none, or a hand's, with the name each has on screen. */
const FINGERS = [
  { value: 'none', label: 'learn:fingers.none' },
  { value: 'rh', label: 'common:hands.rh' },
  { value: 'lh', label: 'common:hands.lh' },
] as const

/**
 * Scale view: the run from its start note, its keys marked by degree with a hand's fingers, on the
 * staff, fingered from the thumb or as the scale, and practised.
 */
export function RunView({
  scale,
  onChange,
  choice,
  facts,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
  /** Which scale: the explorer's own choices, over this view's. */
  choice: ReactNode
  /** What the scale is made of, under this view's content. */
  facts: ReactNode
}) {
  const { t } = useTranslation(['learn', 'common'])
  const { root, kind, start, fingering, rhythm, hands } = scale
  const run = useMemo(
    () => scaleRunOf({ root, kind, start, fingering, rhythm, hands }),
    [root, kind, start, fingering, rhythm, hands],
  )
  const tones = spellScale(noteFromParam(root), kind)
  return (
    <ScaleLayout
      controls={
        <>
          {choice}
          <Dropdown
            label={t('learn:startOn')}
            value={start}
            options={tones.map((tone, i) => ({
              value: i + 1,
              label: noteName(tone.note),
              detail: tone.degree,
            }))}
            onChange={(next) => onChange({ start: next })}
          />
          {run.fingerings.length > 1 ? (
            <Segmented
              label={t('learn:fingering.label')}
              value={run.fingering}
              options={run.fingerings.map((value) => ({
                value,
                label: t(`learn:fingering.${value}`),
              }))}
              onChange={(value) => onChange({ fingering: value === run.own ? undefined : value })}
            />
          ) : null}
          {/* Beside Hands' Right hand · Left hand, Fingers' own would read as the same choice. */}
          <NamedSegmented
            label={t('learn:fingers.label')}
            value={scale.fingers}
            options={FINGERS.map(({ value, label }) => ({ value, label: t(label) }))}
            onChange={(fingers) => onChange({ fingers })}
          />
        </>
      }
      keyboard={
        <ExplorerKeyboard
          shown={{
            keys: run.music.notes.map((n) => n.midi),
            marks: scaleShown(
              run.placed,
              scale.fingers === 'none' ? undefined : run.fingers[scale.fingers],
            ).marks,
          }}
          className="order-first lg:col-span-2"
        />
      }
    >
      <ScaleSheet music={run.music} hands={hands} fingers={scale.fingers !== 'none'} />
      <FingeringTable
        notes={run.placed.map((key) => noteName(key.tone.note))}
        rh={run.fingers.rh}
        lh={run.fingers.lh}
      />
      <ScalePractice scale={scale} sounds={runSounds(run.music, scale.tempo)} onChange={onChange} />
      {facts}
    </ScaleLayout>
  )
}
