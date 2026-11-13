import { selectKeyboard, useSettings } from '@/entities/settings'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProgressStoreApi } from '@/entities/progress'
import { recordKeyPractised } from '@/features/record-practised'
import { chordShown, noteOnTop, useShownKeys } from '@/features/play-example'
import { useKeyName } from '@/shared/i18n'
import { partsFromParams, partsParams } from '@/shared/lib'
import {
  colourNotes,
  keyFromParam,
  numeralOf,
  numeralText,
  printedSymbol,
  qualitySpellings,
  writtenSymbol,
  type ChordQuality,
  type ColourNote,
  type Triad,
  VOICINGS,
  voicingBar,
} from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlay, usePlayback } from '@/shared/lib/services'
import {
  ActionMenu,
  FloatingActions,
  FloatingPiece,
  FloatingPieces,
  FloatingPlaySplit,
  HandsPicture,
  usePlayKey,
} from '@/shared/ui'
import {
  changedView,
  takesTwoHands,
  chordKeys,
  fingeringRows,
  viewChord,
  type ChordView,
} from '../model/chord-view'
import { ChordFingering } from './ChordFingering'
import { ChordBuilder, ChordName } from './ChordBuilder'
import { ChordPractice } from './ChordPractice'
import { ChordHead } from './ChordHead'
import { ChordSheet } from './ChordSheet'
import { ColourNotes } from './ColourNotes'
import { ChordStage } from './ChordStage'
import { VoicingPicture } from './VoicingPicture'

/** A triad's quality, for a chord the table does not name: what its numeral is written from. */
const TRIAD_QUALITY: Readonly<Record<Triad, ChordQuality>> = {
  maj: 'maj',
  min: 'min',
  dim: 'dim',
  aug: 'aug',
  sus2: 'sus2',
  sus4: 'sus4',
  power: 'five',
}

/**
 * Any chord built part by part on any root, read top to bottom: the keys by role and degree; what it
 * is (its symbol, its tones, the other ways it is written, the chord on a staff), Play and Arpeggio floating;
 * its choices; a 7th chord's available tensions; and its ways into the Player.
 */
export function ChordExplorer({
  chord,
  onChange,
}: {
  chord: ChordView
  onChange: (view: ChordView) => void
}) {
  const { t } = useTranslation(['music', 'practice', 'common'])
  const play = usePlay()
  const playback = usePlayback<string>()
  // Placed once per view: a Play or Stop re-renders here, and a new placement would engrave the staff again.
  const { chord: built, placed } = useMemo(() => viewChord(chord), [chord])
  const rows = useMemo(() => fingeringRows(chord), [chord])
  // What stands on the keys is this chord's: a tension played over the last one is forgotten with it.
  const at = Object.values(chord).join(' ')
  // The keys by role, no finger numbers on them (R34): the fingering table and hands show them.
  const [shown, show] = useShownKeys(at, chordShown([...placed.lh, ...placed.rh]))
  const symbol = writtenSymbol(built)
  const { quality } = built
  // The other ways its symbol is written: the table's, where the table has the chord, each printed
  // as the sheets print a chord.
  const others = quality ? qualitySpellings(quality).slice(1) : []
  // A choice sounds by itself, unless Settings › Keyboard turns that off: it has no button, so no
  // Stop, and it cuts off what played.
  const { autoplay } = useSettings(selectKeyboard)
  // A key's chords played in it count the key practised (B1's Keys practised, as the walk Player's).
  const progress = useProgressStoreApi()
  const practised = (view: ChordView) => {
    if (view.key) recordKeyPractised(progress, view.key, new Date())
  }
  useEffect(() => {
    if (playback.playing !== null && chord.key) recordKeyPractised(progress, chord.key, new Date())
  }, [playback.playing, chord.key, progress])
  const change = (next: Partial<ChordView>) => {
    const view = changedView(chord, next)
    onChange(view)
    if (!autoplay) return
    play(chordSounds(chordKeys(view), { arpeggio: false }))
    practised(view)
  }
  const parts = partsFromParams(chord)
  const key = chord.key ? keyFromParam(chord.key) : undefined
  const keyName = useKeyName()
  const notes = useMemo(() => colourNotes(built.root, parts, key), [built.root, parts, key])
  const numeral = key
    ? numeralOf({ root: built.root, quality: quality ?? TRIAD_QUALITY[parts.triad] }, key)
    : null
  const context =
    key && numeral
      ? t('practice:chords.colour.inKey', { numeral: numeralText(numeral), key: keyName(key) })
      : undefined
  const colour = (each: ColourNote) => {
    if (each.toggled) {
      const view = changedView(chord, partsParams(each.toggled))
      onChange(view)
      playback.toggle(`${at} ${each.label}`, () =>
        chordSounds(chordKeys(view), { arpeggio: false }),
      )
      return
    }
    const over = noteOnTop(shown, each.pitchClass, {
      tone: each.group === 'avoid' ? 'scale' : each.role,
      label: each.label,
    })
    show(over)
    playback.toggle(`${at} ${each.label}`, () => chordSounds(over.keys, { arpeggio: false }))
  }
  const sound = (id: 'chord' | 'arpeggio') =>
    playback.toggle(id, () => chordSounds(chordKeys(chord), { arpeggio: id === 'arpeggio' }))
  // How Play sounds the chord, chosen in its menu (R42): together, or one note after another.
  const [playAs, setPlayAs] = useState<'chord' | 'arpeggio'>('chord')
  usePlayKey(() => sound(playAs))
  // The hands are a choice for a close chord one hand holds; any other is played as it says.
  const handsChoice = chord.voicing === 'close' && !takesTwoHands(built.tones.length)
  const handsShown = handsChoice ? chord.hands : 'both'

  return (
    <div className="flex flex-col gap-6">
      <ChordStage chord={chord} shown={shown} />
      <ChordHead
        name={
          <>
            <hgroup className="flex flex-col gap-2">
              {/* The chord's name is said once to a screen reader; to the eye, its pickers are its name. */}
              <h2 className="sr-only">{printedSymbol(symbol)}</h2>
              <ChordName chord={chord} onChange={change} />
              {quality ? (
                <p className="text-muted-foreground">{t(`music:quality.${quality}`)}</p>
              ) : null}
            </hgroup>
            {others.length > 0 ? (
              <p className="flex flex-wrap items-baseline gap-x-4">
                <span className="text-muted-foreground">{t('practice:chords.written')}</span>
                <span className="font-display text-xl font-semibold">
                  {others
                    .map((suffix) => printedSymbol(writtenSymbol({ root: built.root, suffix })))
                    .join(' · ')}
                </span>
              </p>
            ) : null}
          </>
        }
        staff={<ChordSheet placed={placed} />}
        choices={
          <ChordBuilder chord={chord} tones={built.tones} placed={placed} onChange={change} />
        }
      />
      <ChordFingering rows={rows} />
      <ColourNotes notes={notes} context={context} onToggle={colour} onPlay={colour} />
      {quality ? (
        <ChordPractice
          root={built.root}
          quality={quality}
          inversion={built.tones.length <= 4 ? chord.inversion : 0}
        />
      ) : null}
      <FloatingActions>
        {/* The canvas's three pieces of glass: the voicing, Play with how it plays, the hands. */}
        <FloatingPieces label={t('practice:transport')}>
          <ActionMenu
            label={t('practice:chords.voicing.label')}
            render={
              <FloatingPiece
                label={`${t('practice:chords.voicing.label')}: ${t(`practice:chords.voicing.names.${chord.voicing}`)}`}
                caption={t(`practice:chords.voicing.names.${chord.voicing}`)}
              >
                <VoicingPicture placed={placed} />
              </FloatingPiece>
            }
            trigger={null}
            actions={VOICINGS.filter((voicing) => !voicingBar(built.tones, voicing)).map(
              (voicing) => ({
                key: voicing,
                label: t(`practice:chords.voicing.names.${voicing}`),
                checked: chord.voicing === voicing,
                onSelect: () => change({ voicing }),
              }),
            )}
          />
          <FloatingPlaySplit
            label={t(`practice:chords.playAs.${playAs === 'chord' ? 'playChord' : 'arpeggiate'}`)}
            playing={playback.playing === playAs}
            onPlay={() => sound(playAs)}
            menu={(trigger) => (
              <ActionMenu
                label={t('practice:chords.playAs.label')}
                align="end"
                render={trigger}
                trigger={null}
                actions={(['chord', 'arpeggio'] as const).map((each) => ({
                  key: each,
                  label: t(`practice:chords.playAs.${each === 'chord' ? 'block' : 'arpeggio'}`),
                  checked: playAs === each,
                  onSelect: () => setPlayAs(each),
                }))}
              />
            )}
          />
          <ActionMenu
            label={t('practice:hands')}
            align="end"
            render={
              <FloatingPiece
                label={`${t('practice:hands')}: ${t(`common:hands.${handsShown}`)}`}
                caption={t('practice:hands')}
                disabled={!handsChoice}
              >
                <HandsPicture hands={handsShown} />
              </FloatingPiece>
            }
            trigger={null}
            actions={(['both', 'rh'] as const).map((each) => ({
              key: each,
              label: t(`common:hands.${each}`),
              checked: handsShown === each,
              onSelect: () => change({ hands: each }),
            }))}
          />
        </FloatingPieces>
      </FloatingActions>
    </div>
  )
}
