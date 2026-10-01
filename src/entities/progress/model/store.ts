import type { StoreApi } from 'zustand/vanilla'
import { isStepId, type StepId } from '@/entities/path'
import { isSkillId, type SkillId } from '@/shared/lib/music'
import { createSavedStore, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import { latestEvidence } from './mastery'
import {
  EMPTY_PROGRESS,
  type Answer,
  type ProgressState,
  type RunKey,
  type TrainerRecord,
} from './types'

export const PROGRESS_STORAGE_KEY = 'pt-progress'
export const PROGRESS_VERSION = 2

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
const dateOrNothing = (value: unknown) => (isDate(value) ? value : undefined)

function evidenceOrNothing(value: unknown): readonly Answer[] | undefined {
  if (!Array.isArray(value)) return undefined
  const answers = value.filter(isAnswer)
  return answers.length > 0 ? latestEvidence(answers) : undefined
}

/** A trainer and its level, as a record is kept under: `name-chord:3`. */
const isRunKey = (key: string): key is RunKey => /^[a-z][a-z0-9-]*:[a-z0-9-]+$/.test(key)

const isPercent = (value: unknown): value is number => isCount(value) && value <= 100

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
 * Stored JSON is untrusted: keep what is still valid, drop the rest, never throw. A version-1 save's
 * quiz stats (one count over every quiz) belong to no trainer and are not read.
 */
function sanitize(persisted: unknown): ProgressState {
  const saved = savedObject<ProgressState>(persisted)
  return {
    learned: kept<StepId, string>(saved.learned, isStepId, dateOrNothing),
    practised: kept(saved.practised, isPieceKey, dateOrNothing),
    answers: kept<SkillId, readonly Answer[]>(saved.answers, isSkillId, evidenceOrNothing),
    trainers: kept(saved.trainers, isRunKey, trainerRecord),
  }
}
