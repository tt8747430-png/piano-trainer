import { useTranslation } from 'react-i18next'
import { LiveKeyboard } from '@/features/live-keyboard'
import {
  keyboardRange,
  MIDDLE_OCTAVES,
  noteFromParam,
  noteName,
  noteParam,
  PITCH_CLASSES,
  pitchClassOf,
  placeScale,
  SCALE_KINDS,
  scaleFingering,
  scaleRootSpelling,
  spellScale,
  type Midi,
} from '@/shared/lib/music'
import { PRACTICE_RHYTHM_IDS, scaleRun, TEMPO_RANGE } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import { ChipRow, Pinned, Segmented, type KeyMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import type { ScaleView } from '../model/scale-view'
import { FingeringTable } from './FingeringTable'
import { ScaleChords } from './ScaleChords'
import { ScaleFacts } from './ScaleFacts'

const LABELS = ['degrees', 'rh', 'lh'] as const

/** Any scale on any root: degrees or fingers on the keys, the fingering, practice, its chords, its relative. */
export function ScaleExplorer({
  scale,
  onChange,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation(['theory', 'common'])
  const play = usePlay()
  const root = noteFromParam(scale.root)
  const tones = spellScale(root, scale.kind)
  const placed = placeScale(root, scale.kind)
  const rh = scaleFingering(pitchClassOf(root), scale.kind, 'rh')
  const lh = scaleFingering(pitchClassOf(root), scale.kind, 'lh')
  const fingers = scale.view === 'rh' ? rh : scale.view === 'lh' ? lh : null
  const marks = new Map<Midi, KeyMark>(
    placed.map((key, i) => [
      key.midi,
      {
        tone: 'scale',
        label:
          scale.view === 'degrees' ? key.tone.degree : fingers ? String(fingers[i] ?? '·') : '–',
      },
    ]),
  )

  const run = scaleRun(
    placed.map((key) => key.midi),
    { rhythm: scale.rhythm, tempo: scale.tempo, hands: scale.hands },
  )

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-4xl font-extrabold tracking-tight">
        {`${noteName(root)} ${t(`theory:scaleName.${scale.kind}`)}`}
      </h2>
      <ChipRow
        label={t('theory:root')}
        value={scale.root}
        options={PITCH_CLASSES.map((pc) => {
          const spelled = scaleRootSpelling(pc, scale.kind)
          return { value: noteParam(spelled), label: noteName(spelled) }
        })}
        onChange={(value) => onChange({ root: value })}
      />
      <ChipRow
        label={t('theory:scaleLabel')}
        value={scale.kind}
        options={SCALE_KINDS.map((kind) => ({ value: kind, label: t(`theory:scaleKind.${kind}`) }))}
        onChange={(kind) => onChange({ kind })}
      />
      <Pinned>
        <LiveKeyboard
          label={t('common:keyboard')}
          range={keyboardRange(
            run.map((sound) => sound.midi),
            MIDDLE_OCTAVES,
          )}
          marks={marks}
          className="h-44"
        />
      </Pinned>
      <Segmented
        label={t('theory:view.label')}
        value={scale.view}
        options={LABELS.map((labels) => ({ value: labels, label: t(`theory:view.${labels}`) }))}
        onChange={(view) => onChange({ view })}
      />
      <FingeringTable notes={placed.map((key) => noteName(key.tone.note))} rh={rh} lh={lh} />

      <section className="flex flex-col gap-4 rounded-3xl bg-card p-5 ring-1 ring-border">
        <h3 className="text-xl font-bold">{t('theory:practice')}</h3>
        <ChipRow
          label={t('theory:rhythmLabel')}
          value={scale.rhythm}
          options={PRACTICE_RHYTHM_IDS.map((r) => ({ value: r, label: t(`theory:rhythm.${r}`) }))}
          onChange={(rhythm) => onChange({ rhythm })}
        />
        <Slider
          min={TEMPO_RANGE.min}
          max={TEMPO_RANGE.max}
          step={4}
          value={scale.tempo}
          onValueChange={(tempo) => onChange({ tempo })}
          className="flex flex-col gap-3"
        >
          <div className="flex justify-between">
            <SliderLabel>{t('theory:tempo')}</SliderLabel>
            <span className="font-semibold tabular-nums">
              {t('theory:bpm', { tempo: scale.tempo })}
            </span>
          </div>
        </Slider>
        <Segmented
          label={t('theory:handsLabel')}
          value={scale.hands}
          options={[
            { value: 'rh', label: t('common:hands.rh') },
            { value: 'lh', label: t('common:hands.lh') },
            { value: 'both', label: t('theory:together') },
          ]}
          onChange={(hands) => onChange({ hands })}
        />
        <Button size="pill" onClick={() => play(run)}>
          {t('theory:playUpDown')}
        </Button>
      </section>

      <ScaleChords scale={tones} size={scale.chords} onSize={(chords) => onChange({ chords })} />
      <ScaleFacts root={root} kind={scale.kind} tones={tones} />
    </div>
  )
}
