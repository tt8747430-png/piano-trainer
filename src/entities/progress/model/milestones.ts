import { badgesOf, type BadgeFigures } from './badges'
import { practiceRecord } from './record'
import { practiceSeconds } from './time'
import type { ProgressState } from './types'

/**
 * Everything the Profile counts (B1): the badges' figures, the time practised, and what the
 * milestones and personal records read, gathered from the learner's progress and their library.
 */
export interface ProfileFigures extends BadgeFigures {
  readonly practiceSeconds: number
  /** Takes recorded. */
  readonly recordings: number
  /** 1 once a song or pattern was published. */
  readonly published: number
  /** 1 once a connected piano was played for a minute. */
  readonly midi: number
  /** The best accuracy of any run, out of 100. */
  readonly bestAccuracy: number
}

/** The one-time achievements (B1), each earned once by a figure reaching its goal. */
export const MILESTONES = [
  { id: 'first-song', figure: 'songsLearned', goal: 1 },
  { id: 'first-lesson', figure: 'lessonsDone', goal: 1 },
  { id: 'first-recording', figure: 'recordings', goal: 1 },
  { id: 'first-published', figure: 'published', goal: 1 },
  { id: 'first-midi', figure: 'midi', goal: 1 },
  { id: 'perfect-take', figure: 'bestAccuracy', goal: 100 },
] as const satisfies readonly {
  id: string
  figure: keyof ProfileFigures
  goal: number
}[]

export type MilestoneId = (typeof MILESTONES)[number]['id']

export const isMilestoneId = (value: unknown): value is MilestoneId =>
  MILESTONES.some((milestone) => milestone.id === value)

/** The level the time practised reaches: level n at n² × 10 minutes (0 before the first ten). */
export const levelOf = (seconds: number): number => Math.floor(Math.sqrt(seconds / 60 / 10))

/** The minutes of practice a level needs. */
export const levelMinutes = (level: number): number => level * level * 10

/** What the Profile counts, from the progress and what the learner keeps besides it. */
export function profileFigures(
  state: ProgressState,
  kept: { readonly recordings: number; readonly ownSongs: number; readonly folders: number },
): ProfileFigures {
  const record = practiceRecord(state)
  return {
    bestStreak: record.bestStreak,
    songsLearned: record.songsLearned,
    lessonsDone: record.lessonsDone,
    keysPractised: Object.keys(state.keys).length,
    daysPractised: record.daysPractised,
    libraryBuilt: kept.ownSongs + kept.folders,
    practiceSeconds: practiceSeconds(state),
    recordings: kept.recordings,
    published: state.firsts.published ? 1 : 0,
    midi: state.firsts.midi ? 1 : 0,
    bestAccuracy: Math.max(0, ...Object.values(state.trainers).map((run) => run?.best ?? 0)),
  }
}

/** What has been earned at these figures: each badge's tiers reached (`streak:2`), each milestone met. */
export function earnedKeys(figures: ProfileFigures): string[] {
  const tiers = badgesOf(figures).flatMap((badge) =>
    Array.from({ length: badge.earned }, (_, i) => `${badge.id}:${i + 1}`),
  )
  const milestones = MILESTONES.filter(({ figure, goal }) => figures[figure] >= goal).map(
    ({ id }) => id,
  )
  return [...tiers, ...milestones]
}

/**
 * The progress with the day of each tier and milestone first reached at these figures: `today` for
 * those not kept yet, the kept ones as they are. The same state where nothing new is reached.
 */
export function withEarned(
  state: ProgressState,
  figures: ProfileFigures,
  today: string,
): ProgressState {
  const fresh = earnedKeys(figures).filter((key) => state.earned[key] === undefined)
  if (fresh.length === 0) return state
  return {
    ...state,
    earned: { ...state.earned, ...Object.fromEntries(fresh.map((key) => [key, today])) },
  }
}
