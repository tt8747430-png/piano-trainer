import type { Question } from './round-machine'

/** A round answered: what it asked, whether it was right, and how long the answer took. */
export interface AnsweredRound {
  readonly question: Question
  readonly correct: boolean
  readonly ms: number
}

/** A trainer's run: its rounds (0 runs until stopped), the rounds answered, the streak and the clock. */
export interface RunState {
  readonly rounds: number
  readonly answered: readonly AnsweredRound[]
  /** When the round being asked was shown, in milliseconds. */
  readonly shownAt: number
  readonly streak: number
  readonly bestStreak: number
  readonly over: boolean
}

export const startRun = (rounds: number, now: number): RunState => ({
  rounds,
  answered: [],
  shownAt: now,
  streak: 0,
  bestStreak: 0,
  over: false,
})

/** The next round is shown: its answer is timed from now. */
export const runShown = (run: RunState, now: number): RunState => ({ ...run, shownAt: now })

/** A round answered at `now`; the run is over once its last round is. */
export function runAnswered(
  run: RunState,
  question: Question,
  correct: boolean,
  now: number,
): RunState {
  const answered = [...run.answered, { question, correct, ms: Math.max(0, now - run.shownAt) }]
  const streak = correct ? run.streak + 1 : 0
  return {
    ...run,
    answered,
    streak,
    bestStreak: Math.max(run.bestStreak, streak),
    over: run.rounds > 0 && answered.length >= run.rounds,
  }
}

/** The learner stops: what was answered is the run. */
export const stopRun = (run: RunState): RunState => ({ ...run, over: true })

/** How a run went: rounds answered, right answers out of 100, the average answer time, the misses. */
export interface RunSummary {
  readonly answered: number
  readonly accuracy: number
  readonly averageMs: number
  readonly bestStreak: number
  readonly missed: readonly Question[]
}

export function runSummary(run: RunState): RunSummary {
  const count = run.answered.length
  const right = run.answered.filter((round) => round.correct).length
  const time = run.answered.reduce((sum, round) => sum + round.ms, 0)
  return {
    answered: count,
    accuracy: count === 0 ? 0 : Math.round((100 * right) / count),
    averageMs: count === 0 ? 0 : Math.round(time / count),
    bestStreak: run.bestStreak,
    missed: run.answered.filter((round) => !round.correct).map((round) => round.question),
  }
}
