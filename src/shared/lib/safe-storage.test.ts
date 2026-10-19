// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryStorage } from './safe-storage'

// The storage is chosen once a page: each test loads the module afresh, as a page would.
const load = () => import('./safe-storage')
beforeEach(() => {
  vi.resetModules()
})

const blockWrites = () =>
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('The quota has been exceeded.', 'QuotaExceededError')
  })

describe('safeLocalStorage', () => {
  it('reads and writes the real localStorage when the browser allows it', async () => {
    const { safeLocalStorage } = await load()
    const storage = safeLocalStorage()
    storage.setItem('k', 'v')
    expect(localStorage.getItem('k')).toBe('v')
    expect(storage.getItem('k')).toBe('v')
  })

  it('falls back to memory when localStorage cannot be written at all', async () => {
    const { safeLocalStorage, keepsSaves } = await load()
    blockWrites()
    const storage = safeLocalStorage()
    storage.setItem('k', 'v')
    expect(storage.getItem('k')).toBe('v')
    expect(keepsSaves(storage)).toBe(false)
  })

  it('keeps reading a full localStorage, its saves all there, chosen once for every caller', async () => {
    const { safeLocalStorage, keepsSaves } = await load()
    localStorage.setItem('pt-songs', 'kept')
    blockWrites()
    const storage = safeLocalStorage()
    expect(storage.getItem('pt-songs')).toBe('kept')
    expect(keepsSaves(storage)).toBe(true)
    expect(safeLocalStorage()).toBe(storage)
  })

  it('loses a write instead of throwing when storage starts failing later', async () => {
    const { safeLocalStorage } = await load()
    const storage = safeLocalStorage()
    blockWrites()
    expect(() => storage.setItem('k', 'v')).not.toThrow()
    expect(storage.getItem('k')).toBeNull()
  })

  it('says so to who listens when a write is lost, until they stop listening', async () => {
    const { safeLocalStorage, onFailedWrite } = await load()
    const storage = safeLocalStorage()
    const heard = vi.fn()
    const stop = onFailedWrite(heard)
    storage.setItem('k', 'v')
    expect(heard).not.toHaveBeenCalled()
    blockWrites()
    storage.setItem('k', 'w')
    expect(heard).toHaveBeenCalledOnce()
    stop()
    storage.setItem('k', 'x')
    expect(heard).toHaveBeenCalledOnce()
  })

  it('hands the storage under its guard to a caller that reports its own failed writes', async () => {
    const { safeLocalStorage, unguarded } = await load()
    expect(unguarded(safeLocalStorage())).toBe(localStorage)
    const memory = createMemoryStorage()
    expect(unguarded(memory)).toBe(memory)
  })

  it('passes every Storage operation through to localStorage while it works', async () => {
    const { safeLocalStorage } = await load()
    const storage = safeLocalStorage()
    storage.setItem('a', '1')
    storage.setItem('b', '2')
    expect(storage.length).toBe(2)
    expect([storage.key(0), storage.key(1)].sort()).toEqual(['a', 'b'])
    storage.removeItem('a')
    expect(localStorage.getItem('a')).toBeNull()
    storage.clear()
    expect(localStorage.length).toBe(0)
  })

  it('swallows a failing key, remove or clear instead of throwing', async () => {
    const { safeLocalStorage } = await load()
    const storage = safeLocalStorage()
    const denied = () => {
      throw new DOMException('Access denied', 'SecurityError')
    }
    vi.spyOn(Storage.prototype, 'key').mockImplementation(denied)
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(denied)
    vi.spyOn(Storage.prototype, 'clear').mockImplementation(denied)
    expect(storage.key(0)).toBeNull()
    expect(() => storage.removeItem('k')).not.toThrow()
    expect(() => storage.clear()).not.toThrow()
  })

  it('answers null instead of throwing when a read fails', async () => {
    const { safeLocalStorage } = await load()
    const storage = safeLocalStorage()
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError')
    })
    expect(storage.getItem('k')).toBeNull()
  })
})

describe('createMemoryStorage', () => {
  it('behaves like Storage', () => {
    const storage = createMemoryStorage()
    storage.setItem('a', '1')
    storage.setItem('b', '2')
    expect(storage.length).toBe(2)
    expect(storage.key(0)).toBe('a')
    storage.removeItem('a')
    expect(storage.getItem('a')).toBeNull()
    storage.clear()
    expect(storage.length).toBe(0)
  })
})
