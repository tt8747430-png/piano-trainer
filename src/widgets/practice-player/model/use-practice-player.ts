import { useCallback, useMemo, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import {
  selectOtherHand,
  selectPlayback,
  selectPractice,
  selectScoreView,
  selectSound,
  useSettings,
  useSettingsStoreApi,
  type Cursor,
} from '@/entities/settings'
import {
  hiddenStaves,
  loopParam,
  pedalKeys,
  playerRange,
  practiceMarks,
  handsIn,
  practisedHands,
  readLoop,
  waitsForNotes,
  usePractice,
  type BarRange,
  type Mix,
  type PlayerStaves,
  type Practice,
  type PracticeMode,
} from '@/features/practice'
import { setPracticeToggle, setScoreView } from '@/features/set-preference'
import { clickVoice } from '@/features/metronome'
import type { Performance } from '@/shared/lib/arrangement'
import { rangeOf, type KeyRange, type Midi } from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import {
  audibleHands,
  pedalSpanAt,
  volumeGain,
  withPedal,
  type Hands,
  type Recording,
  type SwingFeel,
} from '@/shared/lib/schedule'
import { useWakeLock } from '@/shared/lib'
import type { KeyMark } from '@/shared/ui'
import { reachLoop, type LoopReach } from './loop-reach'
import type { PracticeView } from './practice-view'
import { waitFeedback, type WaitFeedback } from './wait-feedback'

/** No track changed: every one plays and shows. */
const NO_CHANGE: PlayerStaves = {}

/** The staff of the hand not heard or practised. */
const MUTED: Readonly<Record<Hands, StaffId | undefined>> = {
  both: undefined,
  rh: 'bass',
  lh: 'treble',
}

export interface PracticePlayer {
  readonly practice: Practice
  /** The chosen tempo, and the piece's own. */
  readonly tempo: number
  readonly ownTempo: number
  /** The pass's tempo while speed training plays; else the chosen one. */
  readonly shownTempo: number
  readonly loop: BarRange | null
  /** The keys the Player's keyboard spans, marks and keeps in sight, and the wrong key it shows. */
  readonly range: KeyRange
  readonly marks: ReadonlyMap<Midi, KeyMark>
  readonly inView: KeyRange | undefined
  readonly wrong: ReadonlySet<Midi> | undefined
  readonly feedback: WaitFeedback | null
  /** The other hand's staff dimmed, where one hand is practised and its look is Dim (A35). */
  readonly muted: StaffId | undefined
  /** The staves out of sight: the Staves' Show, and the other hand's where its look is Hide (A35). */
  readonly hidden: readonly StaffId[]
  readonly fingers: boolean
  /** Each notehead carries its note's name. */
  readonly names: boolean
  /** Each chord symbol says how the right hand plays it. */
  readonly positions: boolean
  /** The click while the music plays: this visit's (ADR 0111), else the learner's saved one. */
  readonly click: boolean
  /** How the cursor follows the music (B7): none, a step a beat group, or gliding. */
  readonly cursor: Cursor
  /** The music as played: its pedal as the settings say (A27). */
  readonly performance: Performance
  /** The keys sounding only under the pedal at the cursor, drawn apart from a hand's (A27). */
  /** The score's sustain pedal at the cursor: down where a pedal mark holds it (A27). */
  readonly pedalDown: boolean
  readonly pedalKeys: ReadonlySet<Midi>
  /** The keys out: this visit's (ADR 0111), else the View's saved ones. */
  readonly keys: boolean
  /** The click on or off: this visit's where it has its own, else the saved one. */
  setClick(on: boolean): void
  /** The keys out or put away: this visit's where it has its own, else the View's. */
  setKeys(on: boolean): void
  setMode(mode: PracticeMode): void
  /** Listen at a tempo: the mode and the tempo in one change of the URL. */
  listenAt(tempo: number): void
  setSpeedTraining(on: boolean): void
  setHands(hands: Hands): void
  setSwing(feel: SwingFeel): void
  /** Beats of rest before each repeat; 0 for none. */
  readonly rest: number
  setRest(beats: number): void
  /** The tempo chosen, the piece's own left out of the URL. */
  setTempo(tempo: number): void
  /** Loops the bar the cursor is in, or removes the loop. */
  toggleLoop(): void
  /** The loop chosen, or let go of. */
  setLoop(loop: BarRange | null): void
  /** The loop's far end moved by Shift with an arrow, Home or End (ADR 0096). */
  reachLoop(by: LoopReach, direction: -1 | 1): void
  /** A key tapped on the screen: an answer in Wait mode. The keyboard sounds every tap itself. */
  tapKey(key: Midi): void
}

/**
 * The Player's one hook over any Performance: the URL's view and the saved switches in,
 * everything the screen shows out. A page turns its source (a piece, an exercise) into the Performance;
 * a piece's recording plays along in Listen.
 */
export function usePracticePlayer(
  written: Performance,
  view: PracticeView,
  setView: (patch: Partial<PracticeView>) => void,
  ownTempo: number,
  recording: Recording | null = null,
  staves: PlayerStaves = NO_CHANGE,
): PracticePlayer {
  // The screen stays on while this screen is open: a phone on the stand does not lock mid-song.
  useWakeLock()
  const settings = useSettingsStoreApi()
  const toggles = useSettings(selectPractice)
  const savedKeys = useSettings((state) => selectScoreView(state).keys)
  const click = view.click ?? toggles.metronome
  const sound = useSettings(selectSound)
  const otherHand = useSettings(selectOtherHand)
  const playback = useSettings(selectPlayback)
  // The click and count-in in the Metronome's sound and squares (A35, A39: one engine).
  const voicing = useSettings(useShallow(({ metronome }) => clickVoice(metronome, metronome.meter)))
  // The pedal played as the settings say (A27): as written, none, or with each chord.
  const played = useMemo(() => withPedal(written, playback.pedal), [written, playback.pedal])
  const performance = played
  // Each staff as loud as its volume, none where its Play is off (A35).
  const mix = useMemo<Mix>(
    () => ({
      ...Object.fromEntries(
        Object.entries(sound.staves).map(([staff, percent]) => [staff, volumeGain(percent ?? 100)]),
      ),
      ...Object.fromEntries(
        Object.entries(staves).flatMap(([track, choice]) =>
          choice?.play === false ? [[track, 0]] : [],
        ),
      ),
      recording: volumeGain(sound.recording),
      click: volumeGain(sound.click),
    }),
    [sound, staves],
  )
  const tempo = view.tempo ?? ownTempo
  const loop = useMemo(
    () => readLoop(view.loop, performance.bars.length),
    [view.loop, performance.bars.length],
  )
  // One hand at a time is Practice mode's alone (R29 B8): every other mode plays and waits for both.
  const practisedHand = handsIn(view.mode, view.hands)
  const practice = usePractice(performance, {
    mode: view.mode,
    hands: practisedHand,
    tempo,
    ownTempo,
    ...(view.target !== undefined ? { ceiling: view.target } : {}),
    speedTraining: view.speedTraining,
    swing: view.swing,
    loop,
    metronome: click,
    countIn: playback.countdown !== 'none',
    countInHeard: playback.countdown === 'audible',
    speedStep: playback.speedStep,
    voicing,
    rest: view.rest ?? 0,
    recording,
    mix,
    accompany: otherHand.play,
  })
  const { state, press } = practice
  const waiting = waitsForNotes(state.mode)
  const received = waiting ? state.received : undefined
  const hands = useMemo(
    () => (waiting ? practisedHands(practisedHand) : audibleHands(practisedHand)),
    [waiting, practisedHand],
  )
  const range = useMemo(() => playerRange(performance), [performance])
  // Stable while the beat group is, so the keyboard's memoised keys re-render only when theirs change.
  const marks = useMemo(
    () =>
      practiceMarks(performance, state.beatGroup, {
        hands,
        ...(received ? { received } : {}),
      }),
    [performance, state.beatGroup, hands, received],
  )
  const inView = useMemo(() => rangeOf([...marks.keys()]), [marks])
  const wrong = useMemo(
    () => (state.wrong === null ? undefined : new Set([state.wrong])),
    [state.wrong],
  )
  const tapKey = useCallback(
    (key: Midi) => {
      if (waiting) press(key)
    },
    [waiting, press],
  )
  const bar = performance.beatGroups[state.beatGroup]?.bar ?? 0
  // The pedal at the cursor, and the keys it alone holds (A27, Show it).
  const heldByPedal = useMemo(
    () => pedalKeys(performance, state.beatGroup),
    [performance, state.beatGroup],
  )
  // The staves out of sight: the Staves' Show, and the other hand's where it is hidden (A35).
  const other = otherHand.look === 'hide' ? MUTED[practisedHand] : undefined
  const hidden = useMemo(() => {
    const off = hiddenStaves(staves)
    return other === undefined || off.includes(other) ? off : [...off, other]
  }, [staves, other])
  // Where the loop chosen from the keys began: its other end moves.
  const anchor = useRef<number | null>(null)

  return {
    practice,
    tempo,
    ownTempo,
    shownTempo: practice.passTempo ?? tempo,
    loop,
    range,
    marks,
    inView,
    wrong,
    feedback: waitFeedback(performance, state),
    muted: otherHand.look === 'dim' ? MUTED[practisedHand] : undefined,
    hidden,
    fingers: toggles.fingerNumbers,
    names: toggles.namedNotes,
    positions: toggles.positions,
    click,
    cursor: playback.cursor,
    performance,
    pedalDown:
      pedalSpanAt(performance.pedal, performance.beatGroups[state.beatGroup]?.tick ?? 0) !== null,
    pedalKeys: heldByPedal,
    keys: view.keys ?? savedKeys,
    setClick: (on) =>
      view.click === undefined
        ? setPracticeToggle(settings, 'metronome', on)
        : setView({ click: on }),
    setKeys: (on) =>
      view.keys === undefined ? setScoreView(settings, { keys: on }) : setView({ keys: on }),
    setMode: (mode) => setView({ mode }),
    listenAt: (next) => setView({ mode: 'listen', tempo: next === ownTempo ? undefined : next }),
    setSpeedTraining: (on) => setView({ speedTraining: on }),
    setHands: (next) => setView({ hands: next }),
    setSwing: (feel) => setView({ swing: feel }),
    rest: view.rest ?? 0,
    setRest: (beats) => setView({ rest: beats > 0 ? beats : undefined }),
    setTempo: (next) => setView({ tempo: next === ownTempo ? undefined : next }),
    toggleLoop: () => setView({ loop: loop ? undefined : loopParam({ first: bar, last: bar }) }),
    setLoop: (next) => setView({ loop: next ? loopParam(next) : undefined }),
    reachLoop: (by, direction) => {
      const reached = reachLoop(loop, anchor.current, bar, by, direction, performance.bars.length)
      anchor.current = reached.anchor
      setView({ loop: loopParam(reached.loop) })
    },
    tapKey,
  }
}
