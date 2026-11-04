import type { StoreApi } from 'zustand/vanilla'
import { createSavedStore, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import { NOTICE_KINDS, NOTICES_KEPT, type Notice, type NoticeKind } from './types'

export const NOTIFICATIONS_STORAGE_KEY = 'pt-notifications'
export const NOTIFICATIONS_VERSION = 1

export interface NotificationsState {
  /** Newest first, at most `NOTICES_KEPT`. */
  readonly notices: readonly Notice[]
}

export type NotificationsStore = StoreApi<NotificationsState>

/** The learner's notifications (B1), saved under `pt-notifications` and synced. */
export const createNotificationsStore = (saving: SavingOptions = {}): NotificationsStore =>
  createSavedStore(
    {
      key: NOTIFICATIONS_STORAGE_KEY,
      version: NOTIFICATIONS_VERSION,
      initial: { notices: [] },
      read: sanitize,
    },
    saving,
  )

const isKind = (value: unknown): value is NoticeKind =>
  typeof value === 'string' && (NOTICE_KINDS as readonly string[]).includes(value)

function noticeOf(value: unknown): Notice | null {
  if (!isRecord(value)) return null
  const { kind, ref, at, read } = value
  if (!isKind(kind) || typeof ref !== 'string' || !/^[a-z0-9:-]{1,40}$/.test(ref)) return null
  if (typeof at !== 'string' || Number.isNaN(Date.parse(at))) return null
  return { id: `${kind}:${ref}`, kind, ref, at, read: read === true }
}

/** Stored JSON is untrusted: the notices that read, each once, newest first, at most `NOTICES_KEPT`. */
function sanitize(persisted: unknown): NotificationsState {
  const { notices } = savedObject<NotificationsState>(persisted)
  const read = (Array.isArray(notices) ? notices : []).flatMap((each) => {
    const notice = noticeOf(each)
    return notice ? [notice] : []
  })
  const seen = new Set<string>()
  return {
    notices: read
      .filter((notice) => !seen.has(notice.id) && (seen.add(notice.id), true))
      .toSorted((a, b) => b.at.localeCompare(a.at))
      .slice(0, NOTICES_KEPT),
  }
}
