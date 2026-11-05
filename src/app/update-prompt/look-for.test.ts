import { describe, expect, it, vi } from 'vitest'
import { lookFor, type Registration } from './look-for'

/** A worker whose state the test moves on. */
function worker(state: ServiceWorkerState) {
  const listeners = new Set<() => void>()
  return {
    state,
    addEventListener: (_: 'statechange', listener: () => void) => void listeners.add(listener),
    removeEventListener: (_: 'statechange', listener: () => void) =>
      void listeners.delete(listener),
    moveTo(next: ServiceWorkerState) {
      this.state = next
      for (const listener of [...listeners]) listener()
    },
  }
}

const registration = (parts: Partial<Registration> = {}): Registration => ({
  waiting: null,
  installing: null,
  update: () => Promise.resolve(),
  ...parts,
})

const quiet = { onInstalled: () => undefined, onLost: () => undefined }

describe('lookFor', () => {
  it('finds a version waiting', async () => {
    expect(await lookFor(registration({ waiting: worker('installed') }), quiet)).toBe('ready')
  })

  it('finds none where none comes', async () => {
    expect(await lookFor(registration(), quiet)).toBe('none')
  })

  it('answers at once for a version still downloading, and says when it has come', async () => {
    const installing = worker('installing')
    const onInstalled = vi.fn()
    expect(await lookFor(registration({ installing }), { ...quiet, onInstalled })).toBe(
      'downloading',
    )
    installing.moveTo('installed')
    expect(onInstalled).toHaveBeenCalledOnce()
  })

  it('says when a download came to nothing', async () => {
    const installing = worker('installing')
    const onLost = vi.fn()
    await lookFor(registration({ installing }), { ...quiet, onLost })
    installing.moveTo('redundant')
    expect(onLost).toHaveBeenCalledOnce()
  })

  it('gives up on a look the browser never answers', async () => {
    vi.useFakeTimers()
    const looked = lookFor(registration({ update: () => new Promise(() => undefined) }), quiet, 50)
    const failed = expect(looked).rejects.toThrow('timed out')
    await vi.advanceTimersByTimeAsync(50)
    await failed
    vi.useRealTimers()
  })
})
