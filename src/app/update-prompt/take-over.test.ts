import { afterEach, describe, expect, it, vi } from 'vitest'
import { takeOver } from './take-over'

function worker(state: ServiceWorkerState) {
  const listeners = new Set<() => void>()
  return {
    state,
    postMessage: vi.fn(),
    addEventListener: (_: 'statechange', listener: () => void) => void listeners.add(listener),
    moveTo(next: ServiceWorkerState) {
      this.state = next
      for (const listener of [...listeners]) listener()
    },
  }
}

const page = () => {
  const listeners = new Set<() => void>()
  return {
    addEventListener: (_: 'controllerchange', listener: () => void) => void listeners.add(listener),
    change: () => {
      for (const listener of [...listeners]) listener()
    },
  }
}

afterEach(() => void vi.useRealTimers())

describe('takeOver', () => {
  it('asks the waiting version to take over and reloads once it controls the page', () => {
    const waiting = worker('installed')
    const container = page()
    const reload = vi.fn()
    takeOver({ waiting }, container, reload)
    expect(waiting.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' })
    container.change()
    waiting.moveTo('activated')
    expect(reload).toHaveBeenCalledOnce()
  })

  it('reloads once it is active on a page no version controlled', () => {
    const waiting = worker('installed')
    const reload = vi.fn()
    takeOver({ waiting }, page(), reload)
    waiting.moveTo('activated')
    expect(reload).toHaveBeenCalledOnce()
  })

  it('reloads when another tab took the version first', () => {
    const waiting = worker('installed')
    const reload = vi.fn()
    takeOver({ waiting }, page(), reload)
    waiting.moveTo('redundant')
    expect(reload).toHaveBeenCalledOnce()
  })

  it('reloads at once when none waits', () => {
    const reload = vi.fn()
    takeOver({ waiting: null }, page(), reload)
    expect(reload).toHaveBeenCalledOnce()
  })

  it('reloads anyway when the browser never says the version took over', () => {
    vi.useFakeTimers()
    const reload = vi.fn()
    takeOver({ waiting: worker('installed') }, page(), reload, 100)
    vi.advanceTimersByTime(100)
    expect(reload).toHaveBeenCalledOnce()
  })
})
