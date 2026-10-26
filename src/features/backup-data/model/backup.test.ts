// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createMemoryStorage, onFailedWrite, safeLocalStorage } from '@/shared/lib'
import {
  backupName,
  readBackup,
  restoreBackup,
  SAVE_KEYS,
  writeBackup,
  type Backup,
} from './backup'

// The storage is chosen once a page, and a file before this one in its worker may have chosen it:
// this file loads the app's modules afresh, as a page would.
vi.hoisted(() => vi.resetModules())

const NOW = new Date('2026-10-11T09:30:00Z')
const SETTINGS = { state: { theme: 'dark' }, version: 1 }
const PIECES = { state: { versions: {}, songs: [], nextSong: 1 }, version: 1 }

function saved() {
  const storage = createMemoryStorage()
  storage.setItem('pt-settings', JSON.stringify(SETTINGS))
  storage.setItem('pt-pieces', JSON.stringify(PIECES))
  storage.setItem('pt-progress', '{oops')
  storage.setItem('other', 'kept out')
  return storage
}

/** A save whose text is `length` characters long. */
function saveOf(length: number) {
  const bare = JSON.stringify({ state: '', version: 1 }).length
  return { state: 'x'.repeat(length - bare), version: 1 }
}

/** Storage with room for `room` characters of saves, throwing as a full browser does past it. */
function roomFor(room: number): Storage {
  const storage = createMemoryStorage()
  const used = (key: string) =>
    Array.from({ length: storage.length }, (_, index) => storage.key(index))
      .filter((other) => other !== null && other !== key)
      .reduce((sum, other) => sum + (storage.getItem(other ?? '')?.length ?? 0), 0)
  return {
    get length() {
      return storage.length
    },
    clear: () => storage.clear(),
    getItem: (key) => storage.getItem(key),
    key: (index) => storage.key(index),
    removeItem: (key) => storage.removeItem(key),
    setItem: (key, value) => {
      if (used(key) + value.length > room)
        throw new DOMException('The quota has been exceeded.', 'QuotaExceededError')
      storage.setItem(key, value)
    },
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('backup', () => {
  it('holds every store’s save, and nothing it cannot read', () => {
    const backup = readBackup(writeBackup(saved(), NOW))
    expect(backup).toEqual({
      made: '2026-10-11T09:30:00.000Z',
      saves: { 'pt-settings': SETTINGS, 'pt-pieces': PIECES },
    })
  })

  it('puts a backup in place of what is there, a store without a save starting afresh', () => {
    const backup = readBackup(writeBackup(saved(), NOW))
    if (!backup) throw new Error('no backup')
    const other = createMemoryStorage()
    other.setItem('pt-takes', JSON.stringify({ state: { takes: [] }, version: 1 }))
    restoreBackup(other, backup)
    expect(JSON.parse(other.getItem('pt-settings') ?? 'null')).toEqual(SETTINGS)
    expect(JSON.parse(other.getItem('pt-pieces') ?? 'null')).toEqual(PIECES)
    expect(other.getItem('pt-takes')).toBeNull()
  })

  it('puts everything back as it was where the backup does not fit, whatever order it fits in', () => {
    const storage = roomFor(320)
    const before = {
      'pt-settings': saveOf(130),
      'pt-progress': saveOf(40),
      'pt-pieces': saveOf(130),
    }
    for (const [key, save] of Object.entries(before)) storage.setItem(key, JSON.stringify(save))
    const backup: Backup = {
      made: '',
      saves: { 'pt-settings': saveOf(40), 'pt-progress': saveOf(140), 'pt-pieces': saveOf(150) },
    }
    expect(restoreBackup(storage, backup)).toBe(false)
    for (const [key, save] of Object.entries(before))
      expect(JSON.parse(storage.getItem(key) ?? 'null')).toEqual(save)
  })

  it('does not say a change was lost when a backup does not fit: the restore says so itself', () => {
    const storage = safeLocalStorage()
    storage.setItem('pt-settings', JSON.stringify(SETTINGS))
    const heard = vi.fn()
    const stop = onFailedWrite(heard)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('The quota has been exceeded.', 'QuotaExceededError')
    })
    expect(restoreBackup(storage, { made: '', saves: { 'pt-settings': saveOf(60) } })).toBe(false)
    stop()
    expect(heard).not.toHaveBeenCalled()
  })

  it('reads no other file as a backup', () => {
    expect(readBackup('not json')).toBeNull()
    expect(readBackup(JSON.stringify({ saves: {} }))).toBeNull()
    expect(
      readBackup(JSON.stringify({ kind: 'piano-trainer-backup', format: 2, saves: {} })),
    ).toBeNull()
    expect(
      readBackup(
        JSON.stringify({
          kind: 'piano-trainer-backup',
          format: 1,
          saves: { 'pt-settings': { theme: 'dark' }, other: SETTINGS },
        }),
      ),
    ).toEqual({ made: '', saves: {} })
  })

  it('names the file by the day', () => {
    expect(backupName(NOW)).toBe('piano-trainer-2026-10-11.json')
  })

  it('knows every saved store', () => {
    expect(SAVE_KEYS).toEqual([
      'pt-settings',
      'pt-progress',
      'pt-pieces',
      'pt-patterns',
      'pt-takes',
      'pt-views',
      'pt-diagram-inversions',
    ])
  })
})
