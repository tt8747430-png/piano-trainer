import { describe, expect, it, vi } from 'vitest'
import { installed } from './installed'

/** A worker whose state the test moves on. */
function worker(state: ServiceWorkerState) {
  const listeners = new Set<() => void>()
  return {
    state,
    addEventListener: (_: string, listener: () => void) => void listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => void listeners.delete(listener),
    moveTo(next: ServiceWorkerState) {
      this.state = next
      for (const listener of [...listeners]) listener()
    },
  }
}

const registrationOf = (parts: { waiting?: unknown; installing?: unknown }) =>
  ({ waiting: null, installing: null, ...parts }) as unknown as ServiceWorkerRegistration

describe('installed', () => {
  it('gives the waiting version at once', async () => {
    const waiting = worker('installed')
    expect(await installed(registrationOf({ waiting }))).toBe(waiting)
  })

  it('gives none where no version comes', async () => {
    expect(await installed(registrationOf({}))).toBeNull()
  })

  it('waits for a version still downloading, then gives it', async () => {
    const installing = worker('installing')
    const registration = registrationOf({ installing })
    const found = installed(registration)
    Object.assign(registration, { waiting: installing, installing: null })
    installing.moveTo('installed')
    expect(await found).toBe(installing)
  })

  it('gives up on a download that never ends', async () => {
    vi.useFakeTimers()
    const found = installed(registrationOf({ installing: worker('installing') }), 1000)
    vi.advanceTimersByTime(1000)
    expect(await found).toBeNull()
    vi.useRealTimers()
  })
})
