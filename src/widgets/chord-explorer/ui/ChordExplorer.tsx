import { selectChords, selectKeyboard, useSettings } from '@/entities/settings'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProgressStoreApi } from '@/entities/progress'
import { recordKeyPractised } from '@/features/record-practised'
import { chordShown, useShownKeys } from '@/features/play-example'
import {
  keyParam,
  numeralOf,
  numeralsParam,
  printedSymbol,
  writtenSymbol,
  VOICINGS,
  voicingBar,
} from '@/shared/lib/music'
import { chordSounds, chordsInTurn, turnStarts } from '@/shared/lib/schedule'
import { usePlay, usePlayback } from '@/shared/lib/services'
import {
  ActionMenu,
  FloatingActions,
  FloatingPiece,
  FloatingPieces,
  FloatingPlaySplit,
  HandsPicture,
  say,
  usePlayKey,
} from '@/shared/ui'
import {
  addedChord,
  changedChord,
  changedView,
  chordSteps,
  chordViews,
  choseChord,
  MOST_CHORDS,
  removedChord,
  type ChordStep,
  takesTwoHands,
  chordKeys,
  viewChord,
  type ChordView,
} from '../model/chord-view'
import { chordKeyLabels } from '../model/chord-labels'
import { ChordName } from './ChordName'
import { ChordPractice } from './ChordPractice'
import { ChordSheet } from './ChordSheet'
import { ChordStage } from './ChordStage'
import { NextChordSheet } from './NextChordSheet'
import { staffKey } from '../model/next-chords'
import { VoicingPicture } from './VoicingPicture'

/**
 * Any chord on any root, as the canvas's Chords board draws it, top to bottom: the hands at the keys
 * (or the keys); its name as three pickers (root, type, the note in the bass); the chord on a staff
 * with each hand's fingers under it; its ways into the Player; and floating at the foot, the voicing,
 * Play with how it plays, and the hands.
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
  const { chord: built, placed, fingers } = useMemo(() => viewChord(chord), [chord])
  const { labels: labelled } = useSettings(selectChords)
  const labels = useMemo(
    () => chordKeyLabels(placed, fingers, labelled),
    [placed, fingers, labelled],
  )
  const at = Object.values(chord).join(' ')
  // The keys by role, no finger numbers on them unless Labels says Fingers (canvas 151).
  const [shown] = useShownKeys(at, chordShown([...placed.lh, ...placed.rh]))
  const symbol = writtenSymbol(built)
  // Every chord on the staff, the chosen one as placed above.
  const chosenAt = chord.at ?? 0
  const sheet = useMemo(
    () =>
      chordViews(chord).map((view, i) => {
        if (i === chosenAt) return { placed, fingers, symbol }
        const each = viewChord(view)
        return { placed: each.placed, fingers: each.fingers, symbol: writtenSymbol(each.chord) }
      }),
    [chord, chosenAt, placed, fingers, symbol],
  )
  // Several chords practised as written: each a numeral in the staff's key, where each is one.
  const changes = useMemo(() => {
    const views = chordViews(chord)
    if (views.length < 2) return undefined
    const key = staffKey(chord)
    const numerals = views.map((view) => {
      const { root, quality } = viewChord(view).chord
      return quality ? numeralOf({ root, quality }, key) : null
    })
    if (numerals.some((numeral) => numeral === null)) return undefined
    return {
      numerals: numeralsParam(numerals.filter((numeral) => numeral !== null)),
      key: keyParam(key),
      line: sheet.map((each) => printedSymbol(each.symbol)).join(' · '),
    }
  }, [chord, sheet])
  // The Next chord sheet: open from the + to add, or from a chord's name to change that chord.
  const [next, setNext] = useState<{ readonly editing: number | null } | null>(null)
  const sounded = (view: ChordView) => {
    play(chordSounds(chordKeys(view), { arpeggio: false }))
    practised(view)
  }
  const nextPicked = (step: ChordStep) => {
    const view =
      next?.editing == null ? addedChord(chord, step) : changedChord(chord, next.editing, step)
    onChange(view)
    sounded(view)
  }
  const removed = () => {
    if (next?.editing == null) return
    const before = chord
    const gone = sheet[next.editing]?.symbol ?? ''
    setNext(null)
    onChange(removedChord(chord, next.editing))
    say(t('practice:chords.next.removed', { chord: printedSymbol(gone) }), {
      label: t('practice:chords.next.undo'),
      onClick: () => onChange(before),
    })
  }
  const pick = (i: number) => {
    const view = i === chosenAt ? chord : choseChord(chord, i)
    if (i !== chosenAt) onChange(view)
    play(chordSounds(chordKeys(view), { arpeggio: false }))
    practised(view)
  }
  const { quality } = built
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
  // With several chords, Play plays them all in turn unless its menu says only the chosen one.
  const [only, setOnly] = useState(false)
  const several = chordSteps(chord).length > 1
  const all = several && !only
  // While Play all plays, the chord sounding is shown chosen and the staff follows it.
  const [sounding, setSounding] = useState<number | null>(null)
  const turns = useRef<ReturnType<typeof setTimeout>[]>([])
  const stopTurns = () => {
    turns.current.forEach(clearTimeout)
    turns.current = []
    setSounding(null)
  }
  useEffect(() => {
    if (playback.playing === null) stopTurns()
  }, [playback.playing])
  useEffect(() => stopTurns, [])
  const sound = (id: 'chord' | 'arpeggio') => {
    const keys = chordViews(chord).map(chordKeys)
    const arpeggio = id === 'arpeggio'
    stopTurns()
    playback.toggle(id, () =>
      all ? chordsInTurn(keys, { arpeggio }) : chordSounds(chordKeys(chord), { arpeggio }),
    )
    if (all && playback.playing !== id)
      turns.current = turnStarts(keys, { arpeggio }).map((start, i) =>
        setTimeout(() => setSounding(i), start * 1000),
      )
  }
  // How Play sounds the chord, chosen in its menu (R42): together, or one note after another.
  const [playAs, setPlayAs] = useState<'chord' | 'arpeggio'>('chord')
  usePlayKey(() => sound(playAs))
  // The hands are a choice for a close chord one hand holds; any other is played as it says.
  const handsChoice = chord.voicing === 'close' && !takesTwoHands(built.tones.length)
  const handsShown = handsChoice ? chord.hands : 'both'

  // Each hand's fingers from its lowest key up, as the canvas's line under the staff says them.
  const handFacts = (['rh', 'lh'] as const).filter((side) => fingers[side].length > 0)

  return (
    <div className="flex flex-col gap-4">
      <ChordStage chord={chord} shown={shown} />
      {/* The body under the stage, 820 wide at most on a laptop, as the board's column. */}
      <div className="flex flex-col gap-4 md:mx-auto md:w-full md:max-w-[51.25rem]">
        <h2 className="sr-only">{printedSymbol(symbol)}</h2>
        <ChordName chord={chord} tones={built.tones} quality={quality} onChange={change} />
        <section className="flex flex-col gap-3 rounded-2xl bg-card px-3 py-4 ring-1 ring-border">
          <ChordSheet
            chords={sheet}
            at={sounding ?? chosenAt}
            labels={labels}
            onPick={pick}
            onName={(i) => setNext({ editing: i })}
            onAdd={
              chordSteps(chord).length < MOST_CHORDS ? () => setNext({ editing: null }) : undefined
            }
          />
          <p className="flex min-h-11 flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {handFacts.map((side) => (
              <span key={side} className="whitespace-nowrap">
                {t(`common:hands.${side}`)}
                <b className="ms-1.5 font-bold whitespace-pre text-foreground tabular-nums">
                  {fingers[side].join(' ')}
                </b>
              </span>
            ))}
          </p>
        </section>
        {quality ? (
          <ChordPractice
            root={built.root}
            quality={quality}
            inversion={built.tones.length <= 4 ? chord.inversion : 0}
            changes={changes}
          />
        ) : null}
      </div>
      <NextChordSheet
        open={next !== null}
        onOpenChange={(open) => setNext(open ? (next ?? { editing: null }) : null)}
        view={chord}
        editing={next?.editing ?? null}
        onPick={nextPicked}
        onRemove={removed}
      />
      <FloatingActions>
        {/* The canvas's three pieces of glass: the voicing, Play with how it plays, the hands. */}
        <FloatingPieces label={t('practice:transport')}>
          <ActionMenu
            label={t('practice:chords.voicing.label')}
            render={
              <FloatingPiece
                label={`${t('practice:chords.voicing.label')}: ${t(`practice:chords.voicing.names.${chord.voicing}`)}`}
                caption={t(`practice:chords.voicing.captions.${chord.voicing}`)}
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
            label={t(
              `practice:chords.playAs.${all ? 'playAll' : playAs === 'chord' ? 'playChord' : 'arpeggiate'}`,
            )}
            playing={playback.playing === playAs}
            onPlay={() => sound(playAs)}
            menu={(trigger) => (
              <ActionMenu
                label={t('practice:chords.playAs.label')}
                align="end"
                render={trigger}
                trigger={null}
                actions={[
                  ...(['chord', 'arpeggio'] as const).map((each) => ({
                    key: each,
                    label: t(`practice:chords.playAs.${each === 'chord' ? 'block' : 'arpeggio'}`),
                    checked: playAs === each,
                    onSelect: () => setPlayAs(each),
                  })),
                  ...(several
                    ? [
                        {
                          key: 'all',
                          group: 'order',
                          unnamed: true,
                          label: t('practice:chords.playAs.inOrder', {
                            count: chordSteps(chord).length,
                          }),
                          checked: !only,
                          onSelect: () => setOnly(false),
                        },
                        {
                          key: 'one',
                          group: 'order',
                          unnamed: true,
                          label: t('practice:chords.playAs.only', { chord: printedSymbol(symbol) }),
                          checked: only,
                          onSelect: () => setOnly(true),
                        },
                      ]
                    : []),
                ]}
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
