import type { StoreApi } from 'zustand/vanilla'
import { isStepId, type StepId } from '@/entities/step'
import { isSkillId, type SkillId } from '@/shared/lib/music'
import { createSavedStore, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import { TEMPO_RANGE } from '@/shared/lib/schedule'
import { DAYS_KEPT, keptDays } from './days'
import {
  CHORD_HOLDS,
  isChordLessonKey,
  isLessonKey,
  keptHolds,
  keptLessons,
  type ChordLessonKey,
  type LessonKey,
} from './lessons'
import { latestEvidence } from './mastery'
import {
  EMPTY_PROGRESS,
  FIRSTS,
  HISTORY_KEPT,
  type Answer,
  type PracticeRun,
  type FirstId,
  type ProgressState,
  type RunKey,
  type TrainerRecord,
} from './types'

export const PROGRESS_STORAGE_KEY = 'pt-progress'
export const PROGRESS_VERSION = 7

export type ProgressStore = StoreApi<ProgressState>

export const createProgressStore = (saving?: SavingOptions): ProgressStore =>
  createSavedStore(
    {
      key: PROGRESS_STORAGE_KEY,
      version: PROGRESS_VERSION,
      initial: EMPTY_PROGRESS,
      read: sanitize,
    },
    saving,
  )

const isDate = (value: unknown): value is string =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value))

const isAnswer = (value: unknown): value is Answer =>
  isRecord(value) && typeof value.correct === 'boolean' && isDate(value.at)

const isCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0

/** The entries of a saved record whose key passes and whose value can be read, as a new record. */
function kept<K extends string, V>(
  saved: unknown,
  isKey: (key: string) => key is K,
  read: (value: unknown) => V | undefined,
): Partial<Record<K, V>> {
  if (!isRecord(saved)) return {}
  const entries = Object.entries(saved).flatMap(([key, value]) => {
    const valid = isKey(key) ? read(value) : undefined
    return valid === undefined ? [] : [[key, valid] as const]
  })
  return Object.fromEntries(entries) as Partial<Record<K, V>>
}

const isPieceKey = (key: string): key is string => key !== ''

/** A lesson's step, a journey's or a course's: what a lesson's sections read are kept under. */
const isLessonStep = (key: string): key is StepId =>
  isStepId(key) && (key.startsWith('lesson:') || key.startsWith('course:'))

/** The sections read, each a place once, in order; nothing where none can be read. */
function sectionsRead(value: unknown): readonly number[] | undefined {
  if (!Array.isArray(value)) return undefined
  const places = [...new Set(value.filter(isCount))].sort((a, b) => a - b)
  return places.length > 0 ? places : undefined
}
const dateOrNothing = (value: unknown) => (isDate(value) ? value : undefined)

function evidenceOrNothing(value: unknown): readonly Answer[] | undefined {
  if (!Array.isArray(value)) return undefined
  const answers = value.filter(isAnswer)
  return answers.length > 0 ? latestEvidence(answers) : undefined
}

/** A trainer and its level, as a record is kept under: `name-chord:3`. */
const isRunKey = (key: string): key is RunKey => /^[a-z][a-z0-9-]*:[a-z0-9-]+$/.test(key)

/**
 * What an exercise's tempo is kept under: its id, a number where it has several, and its key
 * (`hanon:5:G`, `five-finger:Ebm`; A41).
 */
const isTempoKey = (key: string): key is string =>
  /^[a-z][a-z0-9-]*(:[0-9]+)?:[A-G](#|b)?m?$/.test(key)

const isTempo = (value: unknown): value is number =>
  isCount(value) && value >= TEMPO_RANGE.min && value <= TEMPO_RANGE.max

const isPercent = (value: unknown): value is number => isCount(value) && value <= 100

const isDayKey = (key: string): key is string => /^\d{4}-\d{2}-\d{2}$/.test(key)

/** A day's seconds: a whole number, at most a day's. */
const isDaySeconds = (value: unknown): value is number => isCount(value) && value <= 86_400

/** A key as the URL writes it (`G`, `Ebm`, `F#m`). */
/** An exercise's id, as the catalog writes them (`scale-routine`). */
const isExerciseKey = (key: string): key is string => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(key)
const isKeyName = (key: string): key is string => /^[A-G](#|b)?m?$/.test(key)

/** What an earned day is kept under: a badge's tier (`streak:2`) or a milestone's id. */
const isEarnedKey = (key: string): key is string => /^[a-z][a-z-]*(:[1-4])?$/.test(key)

const isFirst = (key: string): key is FirstId => (FIRSTS as readonly string[]).includes(key)

/** Of the days kept with a value, the latest `DAYS_KEPT`. */
function latestDays<V>(record: Partial<Record<string, V>>): Partial<Record<string, V>> {
  const days = Object.keys(record).sort().slice(-DAYS_KEPT)
  return Object.fromEntries(days.map((day) => [day, record[day]]))
}

/**
 * A record that cannot be read is dropped; one whose numbers contradict each other is raised, never
 * lost: the best to the last.
 */
function trainerRecord(value: unknown): TrainerRecord | undefined {
  const { runs, last, best, bestStreak } = savedObject<TrainerRecord>(value)
  if (!isCount(runs) || runs < 1 || !isPercent(last) || !isPercent(best) || !isCount(bestStreak))
    return undefined
  return { runs, last, best: Math.max(best, last), bestStreak }
}

/**
 * Stored JSON is untrusted: keep what is still valid, drop the rest, never throw. */
function sanitize(persisted: unknown): ProgressState {
  const saved = savedObject<ProgressState>(persisted)
  const lessons = keptLessons(kept<LessonKey, string>(saved.lessons, isLessonKey, dateOrNothing))
  return {
    learned: kept<StepId, string>(saved.learned, isStepId, dateOrNothing),
    practised: kept(saved.practised, isPieceKey, dateOrNothing),
    answers: kept<SkillId, readonly Answer[]>(saved.answers, isSkillId, evidenceOrNothing),
    trainers: kept(saved.trainers, isRunKey, trainerRecord),
    days: Array.isArray(saved.days) ? keptDays(saved.days) : [],
    lessons,
    // A chord held short of learning it: never one its lessons have learned.
    read: kept<StepId, readonly number[]>(saved.read, isLessonStep, sectionsRead),
    tempos: kept(saved.tempos, isTempoKey, (value) => (isTempo(value) ? value : undefined)),
    holds: keptHolds(
      kept(
        saved.holds,
        (key): key is ChordLessonKey => isChordLessonKey(key) && lessons[key] === undefined,
        (value) => (isCount(value) && value > 0 && value < CHORD_HOLDS ? value : undefined),
      ),
    ),
    seconds: latestDays(
      kept(saved.seconds, isDayKey, (value) => (isDaySeconds(value) ? value : undefined)),
    ),
    keys: kept(saved.keys, isKeyName, (value) =>
      typeof value === 'string' && isDayKey(value) ? value : undefined,
    ),
    earned: kept(saved.earned, isEarnedKey, (value) =>
      typeof value === 'string' && isDayKey(value) ? value : undefined,
    ),
    firsts: kept(saved.firsts, isFirst, (value) =>
      typeof value === 'string' && isDayKey(value) ? value : undefined,
    ),
    bestTake:
      typeof saved.bestTake === 'number' && saved.bestTake >= 0 && saved.bestTake <= 100
        ? Math.round(saved.bestTake)
        : 0,
    exercised: kept(saved.exercised, isExerciseKey, (value) =>
      typeof value === 'string' && isDayKey(value) ? value : undefined,
    ),
    history: (Array.isArray(saved.history) ? saved.history : [])
      .flatMap((value) => {
        const run = practiceRun(value)
        return run ? [run] : []
      })
      .toSorted((a, b) => b.at.localeCompare(a.at))
      .slice(0, HISTORY_KEPT),
  }
}

/** A run the history can show: its place, its numbers in range and a real time; else none. */
function practiceRun(value: unknown): PracticeRun | undefined {
  const { key, accuracy, answered, streak, averageMs, at } = savedObject<PracticeRun>(value)
  if (typeof key !== 'string' || !isRunKey(key) || !isPercent(accuracy)) return undefined
  if (!isCount(answered) || answered < 1 || !isCount(streak) || !isCount(averageMs))
    return undefined
  if (typeof at !== 'string' || Number.isNaN(Date.parse(at))) return undefined
  return { id: `${key}@${at}`, key, accuracy, answered, streak, averageMs, at }
}
