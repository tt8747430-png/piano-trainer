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
import { Dropdown, InversionChoice, NamedSegmented } from '@/shared/ui'
import { chordKeyPlays, chordMarks, chordsHolding } from '../model/scale-keys'
import type { ScaleView } from '../model/scale-view'
import { useHeardNote } from '../model/use-heard-note'
import { KeyChords } from './KeyChords'
import { ScaleLayout } from './ScaleLayout'
import { WalkCard } from './WalkCard'

const KEYS_PLAY = ['chords', 'notes'] as const

/**
 * Chords view: each degree's chord on its key, in a size and an inversion, played by its key or
 * lighting the chords that hold a note; the chords to tap, and walked up and down.
 */
export function ChordsView({
  scale,
  onChange,
  choice,
  facts,
}: {
  scale: ScaleView
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
      controls={
        <>
          {choice}
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
          />
          <InversionChoice
            notes={notes}
            value={inversion}
            onChange={(next) => onChange({ inversion: next })}
          />
          {/* Beside Scale · Chords, a bare "Chords · Notes" would read as the same choice. */}
          <NamedSegmented
            label={t('learn:keysPlay.label')}
            value={keysPlay}
            options={KEYS_PLAY.map((value) => ({ value, label: t(`learn:keysPlay.${value}`) }))}
            onChange={(next) => onChange({ keysPlay: next })}
          />
        </>
      }
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
          className="lg:order-first lg:col-span-2"
        />
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
      <WalkCard scale={scale} walk={walk} onChange={onChange} />
      <PractiseChords root={tonic} kind={kind} notes={notes} />
      {facts}
    </ScaleLayout>
  )
}
