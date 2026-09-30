import { useEffect, useEffectEvent, useMemo, useReducer, useRef, useState } from 'react'
import { PLAY_DELAY } from '@/shared/api/audio'
import type { Performance } from '@/shared/lib/arrangement'
import type { Midi } from '@/shared/lib/music'
import {
  audibleHands,
  beatGroupSounds,
  untilNextBeatGroup,
  type Hands,
  type Recording,
} from '@/shared/lib/schedule'
import { useServices } from '@/shared/lib/services'
import { loopBeatGroups, loopTicks, type BarRange, type BeatGroupRange } from './loop'
import {
  accompanyingHands,
  initialPractice,
  practiceReducer,
  type PracticeEvent,
  type PracticeState,
} from './practice-machine'
import type { PracticeMode } from './practice-mode'
import { speedUp } from './speed'
import { startTransport } from './transport'

export interface PracticeSetup {
  readonly mode: PracticeMode
  readonly hands: Hands
  /** The chosen tempo; every Play starts at it. */
  readonly tempo: number
  /** The piece's own: speed training climbs to it. */
  readonly ownTempo: number
  readonly speedTraining: boolean
  readonly swing: boolean
  /** The bars looped; null plays the whole piece. */
  readonly loop: BarRange | null
  readonly metronome: boolean
  readonly countIn: boolean
  /** The piece's recording, played along in Listen; null plays none. */
  readonly recording: Recording | null
}

export interface Practice {
  readonly state: PracticeState
  /** The tempo of the pass sounding while Listen plays; null otherwise. */
  readonly passTempo: number | null
  /** Plays, or in Wait mode starts waiting; after Finished, again from the start. */
  play(): void
  stop(): void
  next(): void
  prev(): void
  jumpToBar(bar: number): void
  jumpToBeatGroup(beatGroup: number): void
  /** An on-screen key: the same as a MIDI note-on. */
  press(midi: Midi): void
}

/** After a right answer in Wait mode, the app plays the other hand and moves on this much later. */
const CORRECT_PAUSE_MS = 150

const sameLoop = (a: BeatGroupRange | null, b: BeatGroupRange | null) =>
  a === b || (a !== null && b !== null && a.first === b.first && a.last === b.last)

/**
 * Connects the practice machine to time, audio and MIDI (spec §2.7). The machine decides; this hook
 * plays what it decides, follows the audio clock in Listen, and moves Wait mode on.
 *
 * A new `performance` object is a new piece to practise; hand in the same object while the
 * arrangement is unchanged (`useMemo` over `arrange`).
 */
export function usePractice(performance: Performance, setup: PracticeSetup): Practice {
  const { audio, midi } = useServices()
  const loopFirst = setup.loop?.first
  const loopLast = setup.loop?.last
  const bars = useMemo(
    () =>
      loopFirst === undefined || loopLast === undefined
        ? null
        : { first: loopFirst, last: loopLast },
    [loopFirst, loopLast],
  )
  const loop = useMemo(() => (bars ? loopBeatGroups(performance, bars) : null), [performance, bars])
  const passage = useMemo(
    () => (bars && loop ? loopTicks(performance, bars) : { from: 0, to: performance.totalTicks }),
    [performance, bars, loop],
  )
  const [state, dispatch] = useReducer(practiceReducer, undefined, () =>
    initialPractice(performance, setup.mode, setup.hands, loop),
  )
  const [passTempo, setPassTempo] = useState<number | null>(null)
  // Bumped when the learner moves while Listen plays: the pass starts again from there.
  const [passRequest, setPassRequest] = useState(0)

  // A new performance, mode, hands or loop reconfigures the machine before anything renders from it.
  if (
    state.performance !== performance ||
    state.mode !== setup.mode ||
    state.hands !== setup.hands ||
    !sameLoop(state.loop, loop)
  ) {
    dispatch({ type: 'configure', performance, mode: setup.mode, hands: setup.hands, loop })
  }

  const { tempo, ownTempo, speedTraining, swing, metronome, countIn, recording } = setup
  const up = speedTraining ? speedUp(tempo, ownTempo) : undefined
  const upStep = up?.step
  const upUntil = up?.until
  const listening = state.mode === 'listen' && state.playing

  // Listen's run so far, at the chosen tempo: a pass started again by a move or a change of how it
  // plays carries speed training's climb on from the tempo sounding, with no count-in; Play, or a new
  // tempo, starts the climb over.
  const run = useRef<{ readonly tempo: number; readonly sounding: number | null } | null>(null)
  // Read as a pass starts, never a reason to start one again.
  const passFrom = useEffectEvent(() => ({
    tick: state.performance.beatGroups[state.beatGroup]?.tick,
    countIn,
  }))

  // Listen: the transport runs while playing, from where the learner is, and starts again from the
  // current beat group whenever what it plays changes.
  useEffect(() => {
    if (!listening) {
      run.current = null
      return
    }
    const first = run.current === null
    const carried = run.current?.tempo === tempo ? run.current.sounding : null
    run.current = { tempo, sounding: carried }
    const from = passFrom()
    const stop = startTransport(
      audio,
      state.performance,
      {
        tempo: carried ?? tempo,
        hands: audibleHands(state.hands),
        range: passage,
        fromTick: from.tick ?? passage.from,
        speedUp:
          upStep === undefined || upUntil === undefined
            ? undefined
            : { step: upStep, until: upUntil },
        countIn: first && from.countIn,
        metronome,
        swing,
      },
      {
        reach: (beatGroup) => dispatch({ type: 'reach', beatGroup }),
        tempo: (sounding) => {
          run.current = { tempo, sounding }
          setPassTempo(sounding)
        },
      },
      recording,
    )
    // A stopped transport's last pass is no longer sounding: the next says its own tempo.
    return () => {
      stop()
      setPassTempo(null)
    }
  }, [
    audio,
    listening,
    state.performance,
    state.hands,
    passage,
    tempo,
    upStep,
    upUntil,
    swing,
    metronome,
    recording,
    passRequest,
  ])

  // Wait mode, playing: once the practised hand has played (or has nothing to play), the app plays the
  // rest of the beat group and moves on. Through rests, each beat group is due on the audio clock
  // where the last one ends, so a run of them keeps its time.
  const waiting = state.mode === 'wait' && state.playing
  const answered = state.outcome === 'correct'
  const rest = state.outcome === 'waiting' && state.expected.length === 0
  const due = useRef<number | null>(null)
  /** Sounds the other hands of this beat group; returns how long until the app moves on. */
  const accompany = useEffectEvent((): number => {
    const at = due.current ?? audio.now() + PLAY_DELAY
    const hands = accompanyingHands(state.hands)
    audio.play(beatGroupSounds(state.performance, state.beatGroup, { tempo, hands }), at)
    if (answered) {
      due.current = null
      return CORRECT_PAUSE_MS
    }
    due.current = at + untilNextBeatGroup(state.performance, state.beatGroup, { tempo })
    return Math.max(0, (due.current - PLAY_DELAY - audio.now()) * 1000)
  })
  useEffect(() => {
    if (!waiting || (!answered && !rest)) {
      due.current = null
      return
    }
    const timer = setTimeout(() => dispatch({ type: 'advance' }), accompany())
    return () => clearTimeout(timer)
  }, [waiting, answered, rest, state.beatGroup, state.performance])

  useEffect(
    () =>
      midi?.onNote((event) => {
        if (event.on) dispatch({ type: 'noteOn', midi: event.midi })
      }),
    [midi],
  )

  // Loaded while the Player is open, so the first Play starts it at once and the tap primes it.
  useEffect(() => {
    if (recording) audio.loadRecording(recording.src)
  }, [audio, recording])

  useEffect(() => () => audio.stop(), [audio])

  /**
   * A move sounds where it lands while nothing plays. While Listen plays it starts a new pass there;
   * while Wait mode plays the learner plays it, and the app accompanies them after.
   */
  const move = (event: PracticeEvent) => {
    const moved = practiceReducer(state, event)
    dispatch(event)
    if (moved === state) return
    if (!state.playing) {
      const hands = audibleHands(moved.hands)
      audio.play(beatGroupSounds(moved.performance, moved.beatGroup, { tempo, hands }))
    } else if (state.mode === 'listen') setPassRequest((request) => request + 1)
  }
  const actions = {
    play() {
      void audio.unlock()
      dispatch({ type: 'play' })
    },
    stop: () => dispatch({ type: 'stop' }),
    next: () => move({ type: 'next' }),
    prev: () => move({ type: 'prev' }),
    jumpToBar: (bar: number) => move({ type: 'jumpToBar', bar }),
    jumpToBeatGroup: (beatGroup: number) => move({ type: 'jumpToBeatGroup', beatGroup }),
    press: (key: Midi) => dispatch({ type: 'noteOn', midi: key }),
  }

  return { state, passTempo: listening ? passTempo : null, ...actions }
}
