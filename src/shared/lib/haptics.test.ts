import { afterEach, describe, expect, it, vi } from 'vitest'
import { impact } from './haptics'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('impact', () => {
  it('knocks through the Vibration API', () => {
    const vibrate = vi.fn()
    vi.stubGlobal('navigator', { vibrate })
    impact()
    expect(vibrate).toHaveBeenCalledWith(16)
  })

  it('is silent where there is none', () => {
    vi.stubGlobal('navigator', {})
    expect(() => impact()).not.toThrow()
  })
})
