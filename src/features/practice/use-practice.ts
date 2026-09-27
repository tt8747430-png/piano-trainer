import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import type { Performance } from '@/shared/lib/arrangement'
import type { Midi } from '@/shared/lib/music'
import {
  audibleHands,
  beatGroupSounds,
  untilNextBeatGroup,
  type Hands,
} from '@/shared/lib/schedule'
import { useServices } from '@/shared/lib/services'
import { loopBeatGroups, loopTicks, type BarRange, type BeatGroupRange } from './loop'
import {
  accompanyingHands,
  initialPractice,
  practiceReducer,
  type PracticeEvent,
  type PracticeMode,
  type PracticeState,
} from './practice-machine'
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

  const latest = useRef({ state, setup })
  useEffect(() => {
    latest.current = { state, setup }
  })

  const { tempo, ownTempo, speedTraining, swing, metronome, countIn } = setup
  const up = speedTraining ? speedUp(tempo, ownTempo) : undefined
  const upStep = up?.step
  const upUntil = up?.until
  const listening = state.mode === 'listen' && state.playing

  // Listen: the transport runs while playing, from where the learner is, and starts again from the
  // current beat group whenever what it plays changes.
  useEffect(() => {
    if (!listening) return
    const from = state.performance.beatGroups[latest.current.state.beatGroup]
    const stop = startTransport(
      audio,
      state.performance,
      {
        tempo,
        hands: audibleHands(state.hands),
        range: passage,
        fromTick: from?.tick ?? passage.from,
        speedUp:
          upStep === undefined || upUntil === undefined
            ? undefined
            : { step: upStep, until: upUntil },
        countIn,
        metronome,
        swing,
      },
      { reach: (beatGroup) => dispatch({ type: 'reach', beatGroup }), tempo: setPassTempo },
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
    countIn,
    passRequest,
  ])

  // Wait mode, playing: once the practised hand has played (or has nothing to play), the app plays the
  // rest of the beat group and moves on.
  useEffect(() => {
    if (state.mode !== 'wait' || !state.playing) return
    const nothingToPlay = state.outcome === 'waiting' && state.expected.length === 0
    if (state.outcome !== 'correct' && !nothingToPlay) return
    const hands = accompanyingHands(state.hands)
    audio.play(beatGroupSounds(state.performance, state.beatGroup, { tempo, hands }))
    const delay =
      state.outcome === 'correct'
        ? CORRECT_PAUSE_MS
        : untilNextBeatGroup(state.performance, state.beatGroup, { tempo }) * 1000
    const timer = setTimeout(() => dispatch({ type: 'next' }), delay)
    return () => clearTimeout(timer)
  }, [audio, state, tempo])

  useEffect(
    () =>
      midi?.onNote((event) => {
        if (event.on) dispatch({ type: 'noteOn', midi: event.midi })
      }),
    [midi],
  )

  useEffect(() => () => audio.stop(), [audio])

  const actions = useMemo(() => {
    /** A move sounds where it lands, except while Listen plays, which starts a new pass there. */
    const move = (event: PracticeEvent) => {
      const { state: current, setup: now } = latest.current
      const moved = practiceReducer(current, event)
      dispatch(event)
      if (moved === current) return
      if (current.mode === 'listen' && current.playing) setPassRequest((request) => request + 1)
      else {
        const hands = audibleHands(moved.hands)
        audio.play(beatGroupSounds(moved.performance, moved.beatGroup, { tempo: now.tempo, hands }))
      }
    }
    return {
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
  }, [audio])

  return { state, passTempo: listening ? passTempo : null, ...actions }
}
