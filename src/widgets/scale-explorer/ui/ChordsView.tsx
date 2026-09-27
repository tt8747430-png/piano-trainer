import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { noteFromParam, placeScale, placeScaleChords, spellScale } from '@/shared/lib/music'
import { Segmented } from '@/shared/ui'
import { chordKeyPlays, chordMarks, chordsHolding, chordsRange } from '../model/scale-keys'
import type { ScaleView } from '../model/scale-view'
import { useHeardNote } from '../model/use-heard-note'
import { KeyChords } from './KeyChords'
import { ScaleLayout } from './ScaleLayout'

/** Triads or 7th chords, with the name each has on screen. */
const SIZES = [
  { value: 3, name: 'triads' },
  { value: 4, name: 'sevenths' },
] as const
const KEYS_PLAY = ['chords', 'notes'] as const

/** Chords view: each degree's chord on its key, played by it or lighting the chords that hold a note. */
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
  const { t } = useTranslation('learn')
  const { root, kind, chords: notes, keysPlay } = scale
  const listening = keysPlay === 'notes'
  const { note, hear } = useHeardNote(listening, [root, kind, notes, keysPlay].join(' '))
  const chords = useMemo(
    () => placeScaleChords(noteFromParam(root), kind, notes, 0),
    [root, kind, notes],
  )
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
          <Segmented
            label={t('chordSize.label')}
            value={notes}
            options={SIZES.map(({ value, name }) => ({ value, label: t(`chordSize.${name}`) }))}
            onChange={(size) => onChange({ chords: size })}
          />
          {/* Its own label on screen: beside Scale · Chords, a bare "Chords · Notes" would read as the same choice. */}
          <div className="flex items-center gap-3">
            <span aria-hidden className="shrink-0 text-muted-foreground">
              {t('keysPlay.label')}
            </span>
            <Segmented
              label={t('keysPlay.label')}
              value={keysPlay}
              options={KEYS_PLAY.map((value) => ({ value, label: t(`keysPlay.${value}`) }))}
              onChange={(next) => onChange({ keysPlay: next })}
            />
          </div>
        </>
      }
      keyboard={
        <ExplorerKeyboard
          keys={placeScale(tonic, kind).map((key) => key.midi)}
          range={chordsRange(chords)}
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
      {facts}
    </ScaleLayout>
  )
}
