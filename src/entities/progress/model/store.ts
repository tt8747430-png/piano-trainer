import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore, type StoreApi } from 'zustand/vanilla'
import { isStepId, type StepId } from '@/entities/path'
import { isSkillId, type SkillId } from '@/shared/lib/music'
import { safeLocalStorage } from '@/shared/lib'
import { latestEvidence } from './mastery'
import {
  EMPTY_PROGRESS,
  NO_QUIZ_STATS,
  type Answer,
  type ProgressState,
  type QuizStats,
} from './types'

export const PROGRESS_STORAGE_KEY = 'pt-progress'
export const PROGRESS_VERSION = 1

export type ProgressStore = StoreApi<ProgressState>

export function createProgressStore({
  storage = safeLocalStorage(),
}: { storage?: Storage } = {}): ProgressStore {
  return createStore<ProgressState>()(
    persist(() => EMPTY_PROGRESS, {
      name: PROGRESS_STORAGE_KEY,
      version: PROGRESS_VERSION,
      storage: createJSONStorage(() => storage),
      // Every earlier shape is sanitised field by field in `merge`, so migrating is passing it on.
      migrate: (persisted) => persisted as ProgressState,
      merge: (persisted) => sanitize(persisted),
    }),
  )
}

type Unknown<T> = Partial<Record<keyof T, unknown>>

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

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
const dateOrNothing = (value: unknown) => (isDate(value) ? value : undefined)

function evidenceOrNothing(value: unknown): readonly Answer[] | undefined {
  if (!Array.isArray(value)) return undefined
  const answers = value.filter(isAnswer)
  return answers.length > 0 ? latestEvidence(answers) : undefined
}

/** Counts that cannot all be true start over; a best below the streak is raised to it. */
function quizStats(value: unknown): QuizStats {
  if (!isRecord(value)) return NO_QUIZ_STATS
  const { correct, total, streak, best } = value as Unknown<QuizStats>
  if (!isCount(correct) || !isCount(total) || !isCount(streak) || !isCount(best)) {
    return NO_QUIZ_STATS
  }
  if (correct > total) return NO_QUIZ_STATS
  return { correct, total, streak, best: Math.max(best, streak) }
}

/** Stored JSON is untrusted: keep what is still valid, drop the rest, never throw. */
function sanitize(persisted: unknown): ProgressState {
  const saved: Unknown<ProgressState> = isRecord(persisted) ? persisted : {}
  return {
    learned: kept<StepId, string>(saved.learned, isStepId, dateOrNothing),
    practised: kept(saved.practised, isPieceKey, dateOrNothing),
    answers: kept<SkillId, readonly Answer[]>(saved.answers, isSkillId, evidenceOrNothing),
    quiz: quizStats(saved.quiz),
  }
}
