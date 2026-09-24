import { describe, expect, it, vi } from 'vitest'
import { createMemoryStorage, safeLocalStorage } from './safe-storage'

const blockWrites = () =>
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('The quota has been exceeded.', 'QuotaExceededError')
  })

describe('safeLocalStorage', () => {
  it('reads and writes the real localStorage when the browser allows it', () => {
    const storage = safeLocalStorage()
    storage.setItem('k', 'v')
    expect(localStorage.getItem('k')).toBe('v')
    expect(storage.getItem('k')).toBe('v')
  })

  it('falls back to memory when localStorage cannot be written at all', () => {
    blockWrites()
    const storage = safeLocalStorage()
    storage.setItem('k', 'v')
    expect(storage.getItem('k')).toBe('v')
  })

  it('loses a write instead of throwing when storage starts failing later', () => {
    const storage = safeLocalStorage()
    blockWrites()
    expect(() => storage.setItem('k', 'v')).not.toThrow()
    expect(storage.getItem('k')).toBeNull()
  })

  it('answers null instead of throwing when a read fails', () => {
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
