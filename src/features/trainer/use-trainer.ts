import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { useProgressStoreApi, type RunKey } from '@/entities/progress'
import { recordAnswer } from '@/features/record-answer'
import { recordRun } from '@/features/record-run'
import type { Midi } from '@/shared/lib/music'
import { usePlay, usePlayback, useServices } from '@/shared/lib/services'
import { drawRound, type Asks } from './draw'
import { heardFirst, roundSounds } from './round-keys'
import {
  answerOf,
  roundReducer,
  startRound,
  type RoundEvent,
  type RoundState,
} from './round-machine'
import {
  runAnswered,
  runShown,
  runSummary,
  startRun,
  stopRun,
  type RunState,
  type RunSummary,
} from './run'

/** How long a right answer stays before auto-next moves on. */
export const AUTO_NEXT_MS = 900

/** A trainer's run as a screen drives it: the round, the run, and what the learner can do. */
export interface TrainerRun {
  readonly round: RoundState
  readonly run: RunState
  /** The round being asked, from 1. */
  readonly number: number
  /** How the run went, once its last round is behind it or the learner stopped; else null. */
  readonly summary: RunSummary | null
  toggleKey(key: Midi): void
  pressKey(key: Midi): void
  clear(): void
  check(): void
  choose(option: string): void
  /** The next round; after the last, the summary. */
  next(): void
  /** Ends the run here, its rounds answered so far its summary. */
  stop(): void
  /** A new run of the same rounds. */
  again(): void
  /** An ear round's "Play again": sounds it, or stops it while it sounds. */
  hear(): void
  readonly hearing: boolean
}

export interface TrainerOptions {
  readonly rounds: number
  /** Where the run's record is kept; none (the Check) keeps none. */
  readonly runKey?: RunKey
  readonly autoNext?: boolean
  readonly random?: () => number
  readonly now?: () => number
}

const clock = () => performance.now()

/**
 * Drives a run of rounds drawn from `asks`: records each answer on a rated skill once as evidence,
 * sounds an ear round as it is shown and every answer once given, moves on by itself after a right
 * answer with auto-next, and keeps the run's record once it is summed up. A new `asks` needs a new
 * `key` on the caller.
 */
export function useTrainer(asks: Asks, options: TrainerOptions): TrainerRun {
  const random = options.random ?? Math.random
  const now = options.now ?? clock
  const store = useProgressStoreApi()
  const { audio } = useServices()
  const play = usePlay()
  const playback = usePlayback<'round'>()
  const first = () => startRound(drawRound(asks, { index: 0, random }))
  const [round, setRound] = useState<RoundState>(first)
  const [run, setRun] = useState<RunState>(() => startRun(options.rounds, now()))
  const [summed, setSummed] = useState(false)
  const current = useRef({ round, run })
  const { question, result } = round

  // An ear round is asked by ear: it sounds when it is shown.
  useEffect(() => {
    if (heardFirst(question)) play(roundSounds(question))
  }, [question, play])

  // Leaving the run silences it.
  useEffect(() => () => audio.stop(), [audio])

  const commit = (next: { round: RoundState; run: RunState }) => {
    current.current = next
    setRound(next.round)
    setRun(next.run)
  }

  const send = (event: RoundEvent) => {
    const before = current.current
    const after = roundReducer(before.round, event)
    if (after === before.round) return
    const answered = !before.round.result && after.result
    commit({
      round: after,
      run: answered
        ? runAnswered(before.run, after.question, after.result.correct, now())
        : before.run,
    })
    if (!answered) return
    const answer = answerOf(after)
    if (answer) recordAnswer(store, answer, new Date())
    if (!heardFirst(after.question)) play(roundSounds(after.question))
  }

  const sumUp = (ended: RunState) => {
    if (options.runKey && ended.answered.length > 0) {
      const { accuracy, bestStreak } = runSummary(ended)
      recordRun(store, options.runKey, { accuracy, streak: bestStreak })
    }
    setSummed(true)
  }

  const next = () => {
    const { round: shown, run: going } = current.current
    if (!shown.result) return
    if (going.over) {
      sumUp(going)
      return
    }
    const question = drawRound(asks, {
      index: going.answered.length,
      random,
      previous: shown.question,
    })
    commit({ round: startRound(question), run: runShown(going, now()) })
  }

  // Auto-next: a right answer moves on after a moment; a wrong one waits to be read.
  const moveOn = useEffectEvent(next)
  const autoNext = options.autoNext === true && result?.correct === true && !summed
  useEffect(() => {
    if (!autoNext) return
    const timer = setTimeout(moveOn, AUTO_NEXT_MS)
    return () => clearTimeout(timer)
  }, [autoNext, round])

  return {
    round,
    run,
    number: run.answered.length + (result ? 0 : 1),
    summary: summed ? runSummary(run) : null,
    toggleKey: (key) => send({ type: 'toggleKey', midi: key }),
    pressKey: (key) => send({ type: 'pressKey', midi: key }),
    clear: () => send({ type: 'clear' }),
    check: () => send({ type: 'check' }),
    choose: (option) => send({ type: 'choose', option }),
    next,
    stop() {
      const stopped = stopRun(current.current.run)
      commit({ round: current.current.round, run: stopped })
      sumUp(stopped)
    },
    again() {
      audio.stop()
      commit({ round: first(), run: startRun(options.rounds, now()) })
      setSummed(false)
    },
    hear() {
      playback.toggle('round', () => roundSounds(current.current.round.question))
    },
    hearing: playback.playing === 'round',
  }
}
