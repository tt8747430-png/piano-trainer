import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { TICKS_PER_BEAT, type Performance } from '@/shared/lib/arrangement'
import type { Midi } from '@/shared/lib/music'
import { audibleHands, beatGroupSounds, secondsFor, type Hands } from '@/shared/lib/schedule'
import { useServices } from '@/shared/lib/services'
import {
  accompanyingHands,
  initialPractice,
  practiceReducer,
  type PracticeEvent,
  type PracticeMode,
  type PracticeState,
} from './practice-machine'
import { startTransport } from './transport'

export interface PracticeSetup {
  readonly mode: PracticeMode
  readonly hands: Hands
  readonly tempo: number
  readonly metronome: boolean
  readonly countIn: boolean
}

export interface Practice {
  readonly state: PracticeState
  play(): void
  stop(): void
  restart(): void
  next(): void
  prev(): void
  nextBar(): void
  jumpToBar(bar: number): void
  jumpToBeatGroup(beatGroup: number): void
  /** An on-screen key: the same as a MIDI note-on. */
  press(midi: Midi): void
}

/** After a right answer in Your turn, the app plays the other hand and moves on this much later. */
const CORRECT_PAUSE_MS = 150

/** Until the next beat group sounds; one beat after the last. */
function untilNextBeatGroup(performance: Performance, beatGroup: number, tempo: number): number {
  const tick = performance.beatGroups[beatGroup]?.tick ?? 0
  const next = performance.beatGroups[beatGroup + 1]?.tick ?? tick + TICKS_PER_BEAT
  return secondsFor(next - tick, tempo) * 1000
}

/**
 * Connects the practice machine to time, audio and MIDI. The machine decides; this hook plays what
 * it decides, follows the audio clock in Listen, and moves Your turn on (spec §4.5).
 */
export function usePractice(performance: Performance, setup: PracticeSetup): Practice {
  const { audio, midi } = useServices()
  const [state, dispatch] = useReducer(practiceReducer, undefined, () =>
    initialPractice(performance, setup.mode, setup.hands),
  )
  // Bumped when the learner moves while Listen plays: the pass starts again from there.
  const [passRequest, setPassRequest] = useState(0)

  // A new performance, mode or hands reconfigures the machine before anything renders from it.
  if (
    state.performance !== performance ||
    state.mode !== setup.mode ||
    state.hands !== setup.hands
  ) {
    dispatch({ type: 'configure', performance, mode: setup.mode, hands: setup.hands })
  }

  const latest = useRef({ state, setup })
  useEffect(() => {
    latest.current = { state, setup }
  })

  const { tempo, metronome, countIn } = setup

  // Listen: the transport runs while playing, from where the learner is, and starts again from the
  // current beat group whenever what it plays changes.
  useEffect(() => {
    if (!state.playing) return
    const from = state.performance.beatGroups[latest.current.state.beatGroup]
    return startTransport(
      audio,
      {
        performance: state.performance,
        fromTick: from?.tick ?? 0,
        tempo,
        hands: audibleHands(state.hands),
        countIn,
        metronome,
      },
      (beatGroup) => dispatch({ type: 'reach', beatGroup }),
    )
  }, [audio, state.playing, state.performance, state.hands, tempo, metronome, countIn, passRequest])

  // Your turn: once the practised hand has played (or has nothing to play), the app plays the rest
  // of the beat group and moves on.
  useEffect(() => {
    if (state.mode !== 'turn') return
    const nothingToPlay = state.outcome === 'waiting' && state.expected.length === 0
    if (state.outcome !== 'correct' && !nothingToPlay) return
    const hands = accompanyingHands(state.hands)
    audio.play(beatGroupSounds(state.performance, state.beatGroup, { tempo, hands }))
    const delay =
      state.outcome === 'correct'
        ? CORRECT_PAUSE_MS
        : untilNextBeatGroup(state.performance, state.beatGroup, tempo)
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
      if (current.playing) setPassRequest((request) => request + 1)
      else if (current.mode !== 'turn') {
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
      restart: () => dispatch({ type: 'restart' }),
      next: () => move({ type: 'next' }),
      prev: () => move({ type: 'prev' }),
      nextBar: () => move({ type: 'nextBar' }),
      jumpToBar: (bar: number) => move({ type: 'jumpToBar', bar }),
      jumpToBeatGroup: (beatGroup: number) => move({ type: 'jumpToBeatGroup', beatGroup }),
      press: (key: Midi) => dispatch({ type: 'noteOn', midi: key }),
    }
  }, [audio])

  return { state, ...actions }
}
