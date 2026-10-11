import { PATTERNS_STORAGE_KEY } from '@/entities/pattern'
import { PIECES_STORAGE_KEY } from '@/entities/piece'
import { PROGRESS_STORAGE_KEY } from '@/entities/progress'
import { SETTINGS_STORAGE_KEY } from '@/entities/settings'
import { TAKES_STORAGE_KEY } from '@/entities/take'
import { VIEWS_STORAGE_KEY } from '@/entities/views'
import { isRecord } from '@/shared/lib'

/** Every saved store, by the key it saves under: what a backup holds. */
export const SAVE_KEYS = [
  SETTINGS_STORAGE_KEY,
  PROGRESS_STORAGE_KEY,
  PIECES_STORAGE_KEY,
  PATTERNS_STORAGE_KEY,
  TAKES_STORAGE_KEY,
  VIEWS_STORAGE_KEY,
] as const

const KIND = 'piano-trainer-backup'
const FORMAT = 1

/** A store's save as it lies in storage: its state (or the compact form it writes) and its version. */
interface Save {
  readonly state: unknown
  readonly version: number
}

/** A backup read from a file: the saves it holds, by key. */
export interface Backup {
  readonly made: string
  readonly saves: Readonly<Partial<Record<(typeof SAVE_KEYS)[number], Save>>>
}

const isSave = (value: unknown): value is Save =>
  isRecord(value) && 'state' in value && typeof value.version === 'number'

function readSave(json: string | null): Save | null {
  if (json === null) return null
  try {
    const saved: unknown = JSON.parse(json)
    return isSave(saved) ? saved : null
  } catch {
    return null
  }
}

/** Every store's save in `storage` as one file's text, made `now`. */
export function writeBackup(storage: Storage, now: Date): string {
  const saves = Object.fromEntries(
    SAVE_KEYS.flatMap((key) => {
      const save = readSave(storage.getItem(key))
      return save ? [[key, save]] : []
    }),
  )
  return JSON.stringify({ kind: KIND, format: FORMAT, made: now.toISOString(), saves })
}

/** The file's name: the app's and the day's. */
export const backupName = (now: Date): string =>
  `piano-trainer-${now.toISOString().slice(0, 10)}.json`

/**
 * A file's text read as a backup, or null where it is not one. Each save is checked only for its
 * shape: its store's own sanitiser reads it, as it reads any save, and starts afresh from another
 * version's (ADR 0038).
 */
export function readBackup(text: string): Backup | null {
  let file: unknown
  try {
    file = JSON.parse(text)
  } catch {
    return null
  }
  if (!isRecord(file) || file.kind !== KIND || file.format !== FORMAT || !isRecord(file.saves))
    return null
  const { saves } = file
  const kept = Object.fromEntries(
    SAVE_KEYS.flatMap((key) => {
      const save = saves[key]
      return isSave(save) ? [[key, save]] : []
    }),
  )
  return { made: typeof file.made === 'string' ? file.made : '', saves: kept }
}

/** Puts a backup's saves in storage in place of what is there: a store it has no save of starts afresh. */
export function restoreBackup(storage: Storage, backup: Backup): void {
  for (const key of SAVE_KEYS) {
    const save = backup.saves[key]
    if (save) storage.setItem(key, JSON.stringify(save))
    else storage.removeItem(key)
  }
}
