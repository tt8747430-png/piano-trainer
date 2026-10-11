import { describe, expect, it } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { backupName, readBackup, restoreBackup, SAVE_KEYS, writeBackup } from './backup'

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
    ])
  })
})
