import { describe, expect, it, vi } from 'vitest'
import { RELOADED_KEY, reloadOnStaleCode, type StaleCodePage } from './stale-code'

function fakePage() {
  const listeners: ((event: Event) => void)[] = []
  const stored = new Map<string, string>()
  const page: StaleCodePage = {
    addEventListener: (_type, listener) => void listeners.push(listener),
    sessionStorage: {
      getItem: (key) => stored.get(key) ?? null,
      setItem: (key, value) => void stored.set(key, value),
    },
    location: { reload: vi.fn() },
  }
  const fail = () => {
    const event = new Event('vite:preloadError', { cancelable: true })
    listeners.forEach((listener) => listener(event))
    return event
  }
  return { page, stored, fail }
}

describe('code left behind by a deploy', () => {
  it('loads the page again when a screen asks for code the new build no longer has', () => {
    const { page, stored, fail } = fakePage()
    reloadOnStaleCode(page, () => 1_000_000)
    expect(fail().defaultPrevented).toBe(true)
    expect(page.location.reload).toHaveBeenCalledOnce()
    expect(stored.get(RELOADED_KEY)).toBe('1000000')
  })

  it('lets a second failure within a minute throw, so a real fault is not a loop of reloads', () => {
    const { page, fail } = fakePage()
    let now = 1_000_000
    reloadOnStaleCode(page, () => now)
    fail()
    now += 30_000
    expect(fail().defaultPrevented).toBe(false)
    expect(page.location.reload).toHaveBeenCalledOnce()
  })
})
