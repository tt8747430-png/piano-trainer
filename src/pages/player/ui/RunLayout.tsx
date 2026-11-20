import { Gauge, SlidersHorizontal, SlidersVertical, X } from 'lucide-react'
import { useLocation } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useProgress, useProgressStoreApi } from '@/entities/progress'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { recordPlayedRun } from '@/features/record-run'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { TEMPO_RANGE } from '@/shared/lib/schedule'
import { midi, type KeyRange, type Midi } from '@/shared/lib/music'
import {
  FloatingPiece,
  FloatingPlayPiece,
  GroupRow,
  GroupRows,
  InfoTip,
  nameMark,
  RoundButton,
  ScreenHeader,
  Labelled,
  Segmented,
  Sheet,
  SheetContent,
  Stepper,
  type KeyMark,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Progress } from '@/shared/ui/primitives/progress'
import {
  usePlayerShortcuts,
  WaitLine,
  type PracticePlayer,
  type PracticeView,
} from '@/widgets/practice-player'
import { PlayerPlayback } from '@/widgets/player-settings'
import { SettingsExtrasContext, type SettingsExtras } from '@/widgets/player-setup'
import { AllPractice, RunResults, RunStaff } from '@/widgets/run-results'
import {
  playedKey,
  playedSteps,
  runChords,
  runPlace,
  soundingKeys,
  type RunPlace,
} from '../model/run-music'
import { SongHead } from './SongHead'

/** The run boards' keys: F3 to G5 on a phone (`calmKeys(53, 79)`), C2 to C7 on a laptop (`calmKeys(36, 96)`). */
const PHONE_KEYS: KeyRange = { from: midi(53), to: midi(79) }
const LAPTOP_KEYS: KeyRange = { from: midi(36), to: midi(96) }
/** The run boards' keys stand 112 tall on a phone, 170 on a laptop (`RS_KEYS`). */
const PHONE_KEYS_PX = 112
const LAPTOP_KEYS_PX = 170
/** A tempo step, as the exercise page's and the boards' stepper (± 4). */
const TEMPO_STEP = 4
/** The music shown at once: two lines of four bars on a phone, one of eight on a laptop (`PV_LINE`). */
const SHOWN = 8

/**
 * A run's own view (walk the chords, a chromatic walk, a progression through the keys), as the run
 * boards draw it (`r56_results.py`'s `PV_RUN`), never the song Player's chrome: the bar (Close, the
 * run's name, the gear), its chords on the paper as whole notes on the treble staff, where it stands
 * ("Chord 1 of 8", "Key 1 of 12"), the keys edge to edge at the foot with the chord sounding in its
 * tones' paints, and the floating Setup · Play · Tempo 12 over them. Setup opens with the run, its
 * Start beginning it; Tempo opens it too.
 */
export function RunLayout({
  title,
  onClose,
  view,
  player,
  performance,
  keys,
  setup,
  settings,
  music,
  place: placed,
  next,
  tempoInfo,
}: {
  title: string
  onClose: () => void
  view: PracticeView
  player: PracticePlayer
  performance: Performance
  /** How many keys it walks: one counts its chords, more its keys. */
  keys: number
  /** The run's own choices (its root, chord size, keys), in the Setup over it. */
  setup: ReactNode
  /** The gear's sheet: how the run is played (its pattern, its feel). */
  settings: ReactNode
  /** The run's own music, engraved, where its chords are not whole notes (an exercise's line). */
  music?: ReactNode
  /** Where it stands, where the run counts it itself (an exercise's keys); `null` says nothing. */
  place?: RunPlace | null
  /** The act after a pass, at the progress row's end (an exercise's Next key). */
  next?: ReactNode
  /** How the run's tempo moves on its own, in the Tempo row's ⓘ (an exercise's tempo ladder). */
  tempoInfo?: { readonly name: string; readonly text: string }
}) {
  const { t } = useTranslation(['player', 'music', 'common'])
  const laptop = useMediaQuery(LAPTOP)
  const { practice } = player
  const playing = practice.state.playing
  usePlayerShortcuts(player, view, onClose)
  const [setupOpen, setSetupOpen] = useState(true)
  const chords = useMemo(() => runChords(performance), [performance])
  const current = performance.beatGroups[practice.state.beatGroup]?.chord ?? 0
  const place = placed === undefined ? runPlace(current, chords.length, keys) : placed
  const where =
    place === null
      ? ''
      : place.unit === 'key'
        ? t('player:run.key', { at: place.at, of: place.of })
        : t('player:run.chord', { at: place.at, of: place.of })
  // The eight bars round the chord sounding: the page it falls on.
  const first = Math.floor(current / SHOWN) * SHOWN
  const shownNotes = chords.slice(first, first + SHOWN).map((each) => each.notes)
  const chord = chords[current]
  // A run of whole-note chords lights its chord; an engraved line the keys sounding now.
  const sounding = useMemo(
    () =>
      music === undefined
        ? { keys: chord?.keys.map((key) => key.midi) ?? [], marked: chord?.keys ?? [] }
        : soundingKeys(performance, practice.state.beatGroup),
    [music, chord, performance, practice.state.beatGroup],
  )
  const marks = useMemo(
    () => new Map<Midi, KeyMark>(sounding.marked.map((key) => [key.midi, nameMark(key)])),
    [sounding],
  )
  const extras: SettingsExtras = {
    head: <SongHead title={title} detail={t('music:bpm', { tempo: player.tempo })} acts={[]} />,
    pages: [
      {
        id: 'playback',
        label: t('player:settingsPage.playback'),
        icon: SlidersHorizontal,
        content: <PlayerPlayback />,
      },
    ],
    acts: [],
  }
  // A Wait pass played to its end is kept in Practice history, and the run opens its results
  // (`PlayChord`'s results, full screen); Retry and Practise mistakes come back to the run.
  const finished = player.feedback?.kind === 'finished' ? player.feedback : null
  const store = useProgressStoreApi()
  const location = useLocation()
  const key = playedKey(location.pathname, location.searchStr)
  // The pass that ended, noted as the screen renders it, with the run's history before it is kept:
  // its best and how many times it was played.
  const pass = practice.state.passes
  const [ended, setEnded] = useState<{
    readonly pass: number
    readonly before: { readonly best: number; readonly runs: number } | undefined
  } | null>(null)
  if (finished !== null && ended?.pass !== pass)
    setEnded({ pass, before: store.getState().trainers[key] })
  // Retry or Practise mistakes leaves that pass's results.
  const [left, setLeft] = useState(-1)
  // The pass kept last, by its number, so a pass is kept once however often this runs.
  const kept = useRef(-1)
  useEffect(() => {
    if (finished === null || ended === null || kept.current === ended.pass) return
    kept.current = ended.pass
    const steps = playedSteps(finished.bars, finished.slips, finished.pauses)
    recordPlayedRun(
      store,
      key,
      {
        title,
        href: location.href,
        tempo: player.tempo,
        steps,
        chords:
          music === undefined && chords.length === steps.length
            ? chords.map((each) => each.notes)
            : [],
        accuracy: finished.score,
      },
      new Date(),
    )
  }, [finished, ended, store, key, location.href, title, player.tempo, music, chords])
  // The results read the run as kept: it shows once the store has it (one more run than before).
  const latest = useProgress((state) => state.history[0])
  const runs = useProgress((state) => state.trainers[key]?.runs ?? 0)
  const result =
    ended !== null &&
    left !== ended.pass &&
    latest?.kind === 'played' &&
    runs === (ended.before?.runs ?? 0) + 1
      ? { run: latest, best: ended.before ? ended.before.best : null, attempt: runs }
      : null
  const waits = view.mode === 'wait'
  const start = () => {
    setSetupOpen(false)
    practice.play()
  }
  const again = (then: () => void) => {
    if (ended) setLeft(ended.pass)
    then()
    practice.play()
  }
  if (result)
    return (
      <div className="flex min-h-screen-free flex-col px-4 lg:px-14">
        <RunResults
          run={result.run}
          best={result.best}
          attempt={result.attempt}
          onMistakes={(bars) => again(() => player.setLoop(bars))}
          onRetry={(tempo) => again(() => player.setTempo(tempo))}
          done={onClose}
          profile={<AllPractice />}
        />
      </div>
    )
  return (
    <div className="flex min-h-screen-free flex-col">
      <ScreenHeader
        title={title}
        back={<RoundButton label={t('common:close')} icon={X} onClick={onClose} />}
        settings={
          <div className="flex items-center gap-2">
            {/* Wait mode said in the bar while it is on (the chord run's board, `RS_RUNVIEW`). */}
            {waits ? (
              <span className="flex h-8 items-center rounded-pill bg-muted px-3 text-[0.8125rem] font-semibold whitespace-nowrap">
                {t('player:modes.wait.name')}
              </span>
            ) : null}
            <div className="flex items-center rounded-pill glass">
              <SettingsExtrasContext value={extras}>{settings}</SettingsExtrasContext>
            </div>
          </div>
        }
      />
      {/* The music on the paper, 4 under the bar on a phone (main's 4 16 34, a column 16 apart);
          centred in the band over the keys on a laptop (8 under the bar, 16 over the keys), eight bars at
          1.35 in a 1177 column. */}
      <div className="flex flex-1 flex-col gap-4 pt-1 lg:-mb-8 lg:items-center lg:justify-center lg:pt-2">
        <div className="flex w-full flex-col gap-4 lg:max-w-[73.5625rem] lg:gap-2">
          {music ??
            (laptop ? (
              <div className="[zoom:1.35]">
                <RunStaff chords={shownNotes} cell={104} end />
              </div>
            ) : (
              <>
                <RunStaff chords={shownNotes.slice(0, 4)} cell={76} end={false} />
                {shownNotes.length > 4 ? (
                  <RunStaff chords={shownNotes.slice(4)} cell={76} end />
                ) : null}
              </>
            ))}
          {waits ? <WaitLine feedback={player.feedback} /> : null}
          {place === null ? null : (
            <div className="flex items-center gap-3">
              <Progress
                value={place.at}
                max={place.of}
                aria-label={where}
                getAriaValueText={() => where}
                className="flex-1 [&_[data-slot=progress-indicator]]:bg-learned [&_[data-slot=progress-track]]:h-2"
              />
              <span
                aria-hidden
                className="shrink-0 text-sm/[normal] text-muted-foreground tabular-nums"
              >
                {where}
              </span>
              {next}
            </div>
          )}
        </div>
      </div>
      <PinnedKeyboard
        shown={{ keys: sounding.keys, marks }}
        range={laptop ? LAPTOP_KEYS : PHONE_KEYS}
        sized={laptop ? LAPTOP_KEYS_PX : PHONE_KEYS_PX}
        screen="playing"
        className="lg:shadow-[0_-1px_0_var(--color-hairline)]"
      />
      {/* The floating Setup · Play · Tempo (`RUNBAR`), hugging its acts on the column's centre, 12 over
          the keys on a phone and 16 on a laptop, reserving no space. */}
      <div
        role="toolbar"
        aria-label={t('player:run.transport')}
        className="pointer-events-none fixed inset-x-3 bottom-[calc(var(--nav-bar)+var(--docked,0px)+0.75rem)] z-20 flex items-center justify-center gap-3 *:pointer-events-auto print:hidden lg:right-0 lg:left-sidebar lg:bottom-[calc(var(--nav-bar)+var(--docked,0px)+1rem)] lg:group-data-[sidebar=collapsed]/main:left-sidebar-collapsed lg:group-data-[sidebar=focus]/main:left-0"
      >
        <FloatingPiece
          label={t('player:setup')}
          caption={t('player:setup')}
          onClick={() => setSetupOpen(true)}
        >
          <SlidersVertical aria-hidden />
        </FloatingPiece>
        <FloatingPlayPiece
          label={t('player:run.play')}
          playing={playing}
          onClick={() => {
            setSetupOpen(false)
            if (playing) practice.stop()
            else practice.play()
          }}
        />
        <FloatingPiece
          label={t('player:run.tempo')}
          caption={t('music:bpm', { tempo: player.tempo })}
          onClick={() => setSetupOpen(true)}
        >
          <Gauge aria-hidden />
        </FloatingPiece>
      </div>
      <Sheet hung="header" open={setupOpen} onOpenChange={setSetupOpen}>
        <SheetContent title={t('player:setup')} rising dismiss="close">
          <div className="flex flex-col gap-6">
            <Labelled label={t('player:pace.title')}>
              <Segmented
                label={t('player:pace.title')}
                value={view.mode}
                options={[
                  { value: 'listen', label: t('player:practiceSheet.play') },
                  { value: 'wait', label: t('player:modes.wait.name') },
                ]}
                onChange={(mode) =>
                  mode === 'wait' ? player.setMode('wait') : player.listenAt(player.tempo)
                }
              />
            </Labelled>
            {setup}
            <GroupRows>
              <GroupRow
                label={
                  tempoInfo ? (
                    <span className="inline-flex items-center gap-1">
                      {t('player:run.tempo')}
                      <InfoTip name={tempoInfo.name}>{tempoInfo.text}</InfoTip>
                    </span>
                  ) : (
                    t('player:run.tempo')
                  )
                }
              >
                <Stepper
                  label={t('player:run.tempo')}
                  value={player.tempo}
                  min={TEMPO_RANGE.min}
                  max={TEMPO_RANGE.max}
                  step={TEMPO_STEP}
                  typed
                  format={(tempo) => t('music:bpm', { tempo })}
                  onChange={player.setTempo}
                  decrease={t('player:run.slower')}
                  increase={t('player:run.faster')}
                />
              </GroupRow>
            </GroupRows>
            {laptop ? null : (
              <Button
                size="lg"
                className="-mt-2 h-13 w-full text-[1.0625rem] font-bold"
                onClick={start}
              >
                {t('player:run.start')}
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
