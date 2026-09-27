import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import {
  CHORD_NOTES,
  lastStackInversion,
  noteFromParam,
  placeScale,
  placeScaleChords,
  spellScale,
  walkChords,
  type ChordNotes,
} from '@/shared/lib/music'
import { Dropdown, Segmented } from '@/shared/ui'
import { chordKeyPlays, chordMarks, chordsHolding, chordsRange } from '../model/scale-keys'
import type { ScaleView } from '../model/scale-view'
import { useHeardNote } from '../model/use-heard-note'
import { KeyChords } from './KeyChords'
import { ScaleLayout } from './ScaleLayout'
import { WalkCard } from './WalkCard'

/** Each size's name on screen, by how many notes it stacks. */
const SIZE_NAMES = {
  3: 'triads',
  4: 'sevenths',
  5: 'ninths',
  6: 'elevenths',
  7: 'thirteenths',
} as const satisfies Record<ChordNotes, string>
const INVERSION_NAMES = ['root', 'first', 'second', 'third'] as const
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
            label={t('learn:chordSize.label')}
            value={notes}
            options={CHORD_NOTES.map((value) => ({
              value,
              label: t(`learn:chordSize.${SIZE_NAMES[value]}`),
            }))}
            onChange={(next) =>
              onChange({ chords: next, inversion: Math.min(inversion, lastStackInversion(next)) })
            }
          />
          <Segmented
            label={t('learn:inversionLabel')}
            value={inversion}
            options={INVERSION_NAMES.slice(0, lastStackInversion(notes) + 1).map((name, value) => ({
              value,
              label: t(`music:inversion.${name}`),
            }))}
            onChange={(next) => onChange({ inversion: next })}
          />
          {/* Its own label on screen: beside Scale · Chords, a bare "Chords · Notes" would read as the same choice. */}
          <div className="flex items-center gap-3">
            <span aria-hidden className="shrink-0 text-muted-foreground">
              {t('learn:keysPlay.label')}
            </span>
            <Segmented
              label={t('learn:keysPlay.label')}
              value={keysPlay}
              options={KEYS_PLAY.map((value) => ({ value, label: t(`learn:keysPlay.${value}`) }))}
              onChange={(next) => onChange({ keysPlay: next })}
            />
          </div>
        </>
      }
      keyboard={
        <ExplorerKeyboard
          keys={placeScale(tonic, kind).map((key) => key.midi)}
          range={chordsRange(walk)}
          marks={chordMarks(chords)}
          keyPlays={keyPlays}
          outlined={new Set(holding.map((chord) => chord.key))}
          onKeyPress={listening ? hear : undefined}
          className="lg:order-first lg:col-span-2"
        />
      }
    >
      <KeyChords
        chords={chords}
        tones={spellScale(tonic, kind)}
        listening={listening}
        note={note}
        holding={holding}
      />
      <WalkCard scale={scale} walk={walk} onChange={onChange} />
      {facts}
    </ScaleLayout>
  )
}
