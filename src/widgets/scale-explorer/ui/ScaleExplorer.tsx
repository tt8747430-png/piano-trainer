import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { useScaleName } from '@/shared/i18n'
import {
  noteFromParam,
  noteName,
  noteParam,
  PITCH_CLASSES,
  pitchClassOf,
  placeScale,
  placeScaleChords,
  SCALE_KINDS,
  scaleFingering,
  scaleHasChords,
  scaleRootSpelling,
  spellScale,
} from '@/shared/lib/music'
import { scaleRun } from '@/shared/lib/schedule'
import { Dropdown, Segmented } from '@/shared/ui'
import {
  chordKeyPlays,
  chordMarks,
  chordsHolding,
  chordsRange,
  scaleMarks,
} from '../model/scale-keys'
import type { ScaleView } from '../model/scale-view'
import { useHeardNote } from '../model/use-heard-note'
import { FingeringTable } from './FingeringTable'
import { KeyChords } from './KeyChords'
import { ScaleFacts } from './ScaleFacts'
import { ScalePractice } from './ScalePractice'

/** The Fingers choice: none, or a hand's, with the name each has on screen. */
const FINGERS = [
  { value: 'none', label: 'learn:fingers.none' },
  { value: 'rh', label: 'common:hands.rh' },
  { value: 'lh', label: 'common:hands.lh' },
] as const
const SHOW = ['scale', 'chords'] as const
/** Triads or 7th chords, with the name each has on screen. */
const SIZES = [
  { value: 3, name: 'triads' },
  { value: 4, name: 'sevenths' },
] as const
const KEYS_PLAY = ['chords', 'notes'] as const

/**
 * Any scale on any root. Scale view: its degrees on the keys, a hand's fingers under them, the
 * fingering and practice. Chords view: each degree's chord on its key, played by it, and the chords
 * that hold a note. Both: what the scale is made of.
 */
export function ScaleExplorer({
  scale,
  onChange,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation(['learn', 'music', 'common'])
  const scaleName = useScaleName()
  const root = noteFromParam(scale.root)
  const tones = spellScale(root, scale.kind)
  const placed = placeScale(root, scale.kind)
  const scaleKeys = placed.map((key) => key.midi)
  const hasChords = scaleHasChords(scale.kind)
  const showChords = scale.show === 'chords' && hasChords
  const listening = showChords && scale.keysPlay === 'notes'
  const { note, hear } = useHeardNote(
    listening,
    [scale.root, scale.kind, scale.chords, scale.keysPlay, scale.show].join(' '),
  )
  const chords = useMemo(
    () => (showChords ? placeScaleChords(noteFromParam(scale.root), scale.kind, scale.chords) : []),
    [showChords, scale.root, scale.kind, scale.chords],
  )
  const keyPlays = useMemo(
    () => (showChords && scale.keysPlay === 'chords' ? chordKeyPlays(chords) : undefined),
    [showChords, scale.keysPlay, chords],
  )
  const holding = note === null ? [] : chordsHolding(chords, note)
  const rh = scaleFingering(pitchClassOf(root), scale.kind, 'rh')
  const lh = scaleFingering(pitchClassOf(root), scale.kind, 'lh')
  const fingering = scale.fingers === 'rh' ? rh : scale.fingers === 'lh' ? lh : null
  const run = scaleRun(scaleKeys, { rhythm: scale.rhythm, tempo: scale.tempo, hands: scale.hands })

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
      <div className="flex flex-col gap-4">
        <h2 className="text-5xl">{scaleName(root, scale.kind)}</h2>
        <div className="flex flex-wrap gap-2">
          <Dropdown
            label={t('learn:root')}
            value={scale.root}
            options={PITCH_CLASSES.map((pc) => {
              const spelled = scaleRootSpelling(pc, scale.kind)
              return { value: noteParam(spelled), label: noteName(spelled) }
            })}
            onChange={(value) => onChange({ root: value })}
          />
          <Dropdown
            label={t('learn:scaleLabel')}
            value={scale.kind}
            options={SCALE_KINDS.map((kind) => ({
              value: kind,
              label: t(`music:scaleKind.${kind}`),
            }))}
            onChange={(kind) => onChange({ kind })}
          />
        </div>
        {hasChords ? (
          <Segmented
            label={t('learn:show.label')}
            value={showChords ? 'chords' : 'scale'}
            options={SHOW.map((value) => ({ value, label: t(`learn:show.${value}`) }))}
            onChange={(show) => onChange({ show })}
          />
        ) : null}
        {showChords ? (
          <div className="flex flex-col gap-4">
            <Segmented
              label={t('learn:chordSize.label')}
              value={scale.chords}
              options={SIZES.map(({ value, name }) => ({
                value,
                label: t(`learn:chordSize.${name}`),
              }))}
              onChange={(size) => onChange({ chords: size })}
            />
            {/* Its own label on screen: beside Scale · Chords, a bare "Chords · Notes" would read as the same choice. */}
            <div className="flex items-center gap-3">
              <span aria-hidden className="shrink-0 text-muted-foreground">
                {t('learn:keysPlay.label')}
              </span>
              <Segmented
                label={t('learn:keysPlay.label')}
                value={scale.keysPlay}
                options={KEYS_PLAY.map((value) => ({
                  value,
                  label: t(`learn:keysPlay.${value}`),
                }))}
                onChange={(keysPlay) => onChange({ keysPlay })}
              />
            </div>
          </div>
        ) : rh && lh ? (
          <Segmented
            label={t('learn:fingers.label')}
            value={scale.fingers}
            options={FINGERS.map(({ value, label }) => ({ value, label: t(label) }))}
            onChange={(fingers) => onChange({ fingers })}
          />
        ) : null}
      </div>
      {showChords ? (
        <ExplorerKeyboard
          keys={scaleKeys}
          range={chordsRange(chords)}
          marks={chordMarks(chords)}
          keyPlays={keyPlays}
          outlined={new Set(holding.map((chord) => chord.key))}
          onKeyPress={listening ? hear : undefined}
          className="lg:order-first lg:col-span-2"
        />
      ) : (
        <ExplorerKeyboard
          keys={run.map((sound) => sound.midi)}
          marks={scaleMarks(placed, fingering)}
          className="lg:order-first lg:col-span-2"
        />
      )}
      <div className="flex flex-col gap-6">
        {showChords ? (
          <KeyChords
            chords={chords}
            tones={tones}
            listening={listening}
            note={note}
            holding={holding}
          />
        ) : (
          <>
            <FingeringTable notes={placed.map((key) => noteName(key.tone.note))} rh={rh} lh={lh} />
            <ScalePractice scale={scale} run={run} onChange={onChange} />
          </>
        )}
        <ScaleFacts root={root} kind={scale.kind} tones={tones} />
      </div>
    </div>
  )
}
