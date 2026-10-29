import type { NetFailure } from '@/shared/api/network'
import type { DocumentTableName } from '@/shared/api/supabase'
import { STATE_ID, type CloudSync } from '@/shared/api/sync'
import { mergeDocuments, type SyncDocument } from './merge'

/** A saved store that syncs: its table in the cloud and its key on the device. */
export interface SyncedSave {
  readonly table: DocumentTableName
  readonly key: string
}

export type SyncOutcome = 'synced' | NetFailure

/** Where the sync stands: idle, running, or its last run stopped; how many stores wait; when it last got through. */
export interface SyncStatus {
  readonly state: 'idle' | 'syncing' | 'offline' | 'failed'
  readonly waiting: number
  readonly lastSynced: string | null
}

export interface SyncRunner {
  /** The storage the stores save to: it notes which of them changed since their last sync. */
  readonly storage: Storage
  /** One sync of every store; a request while one runs joins it. */
  syncNow(): Promise<SyncOutcome>
  status(): SyncStatus
  /** Hears every change of `status`; returns how to stop. */
  subscribe(listener: () => void): () => void
  /** Hears every save a store writes; returns how to stop. */
  onChange(listener: () => void): () => void
}

/** What the device keeps of each store's sync: the cloud copy it last saw, and when it changed since. */
interface Entry {
  readonly base: SyncDocument | null
  readonly changedAt: string | null
}

const JOURNAL_KEY = 'pt-sync'
const VERSION_FIELD = '_version'
const PUSHES = 3
const EMPTY: SyncDocument = { id: STATE_ID, data: {}, updatedAt: '', deleted: false }

interface Save {
  readonly state: Record<string, unknown>
  readonly version: number
}

function saveOf(json: string | null): Save | null {
  if (json === null) return null
  try {
    const saved: unknown = JSON.parse(json)
    if (typeof saved !== 'object' || saved === null) return null
    const { state, version } = saved as Record<string, unknown>
    return typeof state === 'object' && state !== null && typeof version === 'number'
      ? { state: state as Record<string, unknown>, version }
      : null
  } catch {
    return null
  }
}

const versionOf = (document: SyncDocument): number => {
  const version = document.data[VERSION_FIELD]
  return typeof version === 'number' ? version : 0
}

const sameDocument = (a: SyncDocument, b: SyncDocument) => JSON.stringify(a) === JSON.stringify(b)

/**
 * The sync of the learner's stores (ADR 0116), each store one document in its table. The device
 * notes a store changed when its save is written; a sync reads the cloud's copy, merges it with the
 * device's against the copy both started from where both changed (`mergeDocuments`), writes the
 * result into the store as another tab would (`announce`), and pushes it naming the copy it was
 * based on, merging again where the server refuses. A save of another app version is not read: the
 * newer version's stands. Offline, nothing changes and the changes wait.
 */
export function createSyncRunner({
  cloud,
  saves,
  storage,
  announce,
  now = () => new Date().toISOString(),
}: {
  cloud: CloudSync
  saves: readonly SyncedSave[]
  storage: Storage
  /** Tells the store saved under `key` to read its save again, as after another tab's save. */
  announce: (key: string) => void
  now?: () => string
}): SyncRunner {
  const tableOf = new Map(saves.map((save) => [save.key, save.table]))
  const statusListeners = new Set<() => void>()
  const changeListeners = new Set<() => void>()
  let state: SyncStatus['state'] = 'idle'
  let lastSynced: string | null = null
  let status: SyncStatus = { state, waiting: 0, lastSynced }
  const refresh = () => {
    const entries = journal()
    const waiting = saves.filter((save) => entries[save.table]?.changedAt).length
    if (status.state === state && status.waiting === waiting && status.lastSynced === lastSynced)
      return
    status = { state, waiting, lastSynced }
    for (const listener of statusListeners) listener()
  }
  /** What the sync itself last wrote under each key: a store writing the same back is no change. */
  const applied = new Map<string, string>()

  const journal = (): Partial<Record<DocumentTableName, Entry>> => {
    try {
      const read: unknown = JSON.parse(storage.getItem(JOURNAL_KEY) ?? '{}')
      return typeof read === 'object' && read !== null ? read : {}
    } catch {
      return {}
    }
  }
  const record = (table: DocumentTableName, entry: Entry) =>
    storage.setItem(JOURNAL_KEY, JSON.stringify({ ...journal(), [table]: entry }))
  const entryOf = (table: DocumentTableName): Entry =>
    journal()[table] ?? { base: null, changedAt: null }

  const noteChange = (key: string, value: string | null) => {
    const table = tableOf.get(key)
    if (!table || value === applied.get(key)) return
    record(table, { ...entryOf(table), changedAt: now() })
    refresh()
    for (const listener of changeListeners) listener()
  }

  const watched: Storage = {
    get length() {
      return storage.length
    },
    key: (index) => storage.key(index),
    getItem: (key) => storage.getItem(key),
    setItem: (key, value) => {
      storage.setItem(key, value)
      noteChange(key, value)
    },
    removeItem: (key) => {
      storage.removeItem(key)
      noteChange(key, null)
    },
    clear: () => storage.clear(),
  }

  const apply = (key: string, document: SyncDocument) => {
    const { [VERSION_FIELD]: version, ...state } = document.data
    const json = JSON.stringify({ state, version })
    if (storage.getItem(key) === json) return
    storage.setItem(key, json)
    applied.set(key, json)
    announce(key)
  }

  async function syncSave({ table, key }: SyncedSave): Promise<SyncOutcome> {
    const entry = entryOf(table)
    const local = saveOf(storage.getItem(key))
    const fetched = await cloud.fetch(table)
    if (!fetched.ok) return fetched.reason
    const theirs = fetched.value
    const mine: SyncDocument | null = local && {
      id: STATE_ID,
      data: { ...local.state, [VERSION_FIELD]: local.version },
      updatedAt: entry.changedAt ?? entry.base?.updatedAt ?? now(),
      deleted: false,
    }
    const changedThere =
      theirs !== null && (entry.base === null || !sameDocument(theirs, entry.base))
    const changedHere = mine !== null && (entry.changedAt !== null || theirs === null)
    if (!changedHere) {
      if (theirs && changedThere) {
        if (!local || versionOf(theirs) === local.version) apply(key, theirs)
        record(table, { base: theirs, changedAt: null })
      }
      return 'synced'
    }
    if (theirs && local && versionOf(theirs) > local.version) {
      // The cloud holds a newer app's save: this device leaves it be until it is updated too.
      record(table, { base: theirs, changedAt: entry.changedAt })
      return 'synced'
    }
    const merged = (target: SyncDocument, other: SyncDocument, base: SyncDocument | null) =>
      versionOf(other) === versionOf(target)
        ? mergeDocuments(target, other, base ?? EMPTY).document
        : target
    // A store's first sync knows no copy both started from, so every field reads as changed on both
    // sides: the account's plain values stand (a fresh device's defaults never overwrite them), and
    // records and lists still merge item by item, keeping both sides' items.
    const first = entry.base === null
    let target =
      theirs && changedThere
        ? merged(first ? { ...mine, updatedAt: '' } : mine, theirs, entry.base)
        : mine
    let base = theirs
    for (let push = 0; push < PUSHES; push++) {
      const pushed = await cloud.push(table, target, base)
      if (!pushed.ok) return pushed.reason
      if (pushed.value === null) {
        if (!sameDocument(target, mine)) apply(key, target)
        const changedAt =
          entryOf(table).changedAt === entry.changedAt ? null : entryOf(table).changedAt
        record(table, { base: target, changedAt })
        return 'synced'
      }
      target = merged(target, pushed.value, base)
      base = pushed.value
    }
    return 'failed'
  }

  let running: Promise<SyncOutcome> | null = null
  async function run(): Promise<SyncOutcome> {
    state = 'syncing'
    refresh()
    let outcome: SyncOutcome = 'synced'
    for (const save of saves) {
      const result = await syncSave(save)
      if (result === 'offline') {
        outcome = 'offline'
        break
      }
      if (result !== 'synced') outcome = result
    }
    state = outcome === 'synced' ? 'idle' : outcome === 'offline' ? 'offline' : 'failed'
    if (outcome === 'synced') lastSynced = now()
    refresh()
    return outcome
  }

  // Changes saved before this page opened still wait.
  refresh()

  return {
    storage: watched,
    status: () => status,
    subscribe: (listener) => {
      statusListeners.add(listener)
      return () => void statusListeners.delete(listener)
    },
    onChange: (listener) => {
      changeListeners.add(listener)
      return () => void changeListeners.delete(listener)
    },
    syncNow: () => {
      running ??= run().finally(() => {
        running = null
      })
      return running
    },
  }
}
