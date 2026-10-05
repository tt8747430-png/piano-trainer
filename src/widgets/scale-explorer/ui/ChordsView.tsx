import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { chordsRange } from '@/features/play-example'
import { PractiseChords } from '@/features/practice'
import {
  CHORD_NOTES,
  fitInversion,
  noteFromParam,
  placeScale,
  placeScaleChords,
  STACK_SIZES,
  walkChords,
} from '@/shared/lib/music'
import { walkSounds } from '@/shared/lib/schedule'
import { Dropdown, InversionChoice, Labelled, Segmented } from '@/shared/ui'
import { chordKeyPlays, chordMarks, chordsHolding } from '../model/scale-keys'
import type { ScaleView } from '../model/scale-view'
import { useHeardNote } from '../model/use-heard-note'
import { KeyChords } from './KeyChords'
import { PlayUpDown } from './PlayUpDown'
import { ScaleLayout } from './ScaleLayout'
import { TempoSlider } from './TempoSlider'

const KEYS_PLAY = ['chords', 'notes'] as const

/**
 * Chords view: each degree's chord on its key, in a size and an inversion, played by its key or
 * lighting the chords that hold a note; walked up to the tonic's octave and back, struck or rolled;
 * the chords to tap; and where they are practised.
 */
export function ChordsView({
  scale,
  name,
  onChange,
  choice,
  facts,
}: {
  scale: ScaleView
  name: string
  onChange: (change: Partial<ScaleView>) => void
  choice: ReactNode
  facts: ReactNode
}) {
  const { t } = useTranslation(['learn', 'music'])
  const { root, kind, chords: notes, inversion, keysPlay } = scale
  const listening = keysPlay === 'notes'
  const { note, hear } = useHeardNote(listening, [root, kind, notes, inversion, keysPlay].join(' '))
  const chords = useMemo(
    () => placeScaleChords(noteFromParam(root), kind, notes, inversion),
    [root, kind, notes, inversion],
  )
  const walk = useMemo(() => walkChords(chords), [chords])
  const keyPlays = useMemo(
    () => (listening ? undefined : chordKeyPlays(chords)),
    [listening, chords],
  )
  const holding = note === null ? [] : chordsHolding(chords, note)
  const tonic = noteFromParam(root)
  return (
    <ScaleLayout
      keyboard={
        <ExplorerKeyboard
          shown={{
            keys: placeScale(tonic, kind).map((key) => key.midi),
            marks: chordMarks(chords),
          }}
          range={chordsRange(walk)}
          keyPlays={keyPlays}
          outlined={new Set(holding.map((chord) => chord.key))}
          onKeyPress={listening ? hear : undefined}
        />
      }
      name={name}
      facts={facts}
      action={
        <PlayUpDown
          sounds={walkSounds(
            walk.map((placed) => placed.tones.map((tone) => tone.midi)),
            { arpeggio: scale.arpeggio, tempo: scale.tempo },
          )}
        />
      }
      fields={
        <>
          {choice}
          <Labelled label={t('music:chordSize.label')}>
            <Dropdown
              label={t('music:chordSize.label')}
              value={notes}
              options={CHORD_NOTES.map((value) => ({
                value,
                label: t(`music:chordSize.${STACK_SIZES[value]}`),
              }))}
              onChange={(next) =>
                onChange({ chords: next, inversion: fitInversion(inversion, next) })
              }
              className="w-full"
            />
          </Labelled>
          <Labelled label={t('music:inversion.label')}>
            <InversionChoice
              notes={notes}
              value={inversion}
              onChange={(next) => onChange({ inversion: next })}
            />
          </Labelled>
          <Labelled label={t('learn:keysPlay.label')}>
            <Segmented
              label={t('learn:keysPlay.label')}
              value={keysPlay}
              options={KEYS_PLAY.map((value) => ({ value, label: t(`learn:keysPlay.${value}`) }))}
              onChange={(next) => onChange({ keysPlay: next })}
            />
          </Labelled>
          <Labelled label={t('learn:walk.played')}>
            <Segmented
              label={t('learn:walk.played')}
              value={scale.arpeggio ? 'arpeggio' : 'block'}
              options={[
                { value: 'block', label: t('learn:walk.block') },
                { value: 'arpeggio', label: t('learn:arpeggio') },
              ]}
              onChange={(played) => onChange({ arpeggio: played === 'arpeggio' })}
            />
          </Labelled>
          <TempoSlider tempo={scale.tempo} onChange={(tempo) => onChange({ tempo })} />
        </>
      }
    >
      <KeyChords
        chords={chords}
        root={tonic}
        kind={kind}
        listening={listening}
        note={note}
        holding={holding}
      />
      <PractiseChords root={tonic} kind={kind} notes={notes} />
    </ScaleLayout>
  )
}
