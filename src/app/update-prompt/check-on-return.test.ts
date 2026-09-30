import { describe, expect, it, vi } from 'vitest'
import { checkOnReturn } from './check-on-return'

/** A page that can be shown or hidden, as the browser shows and hides the app. */
class Page extends EventTarget {
  visibilityState: DocumentVisibilityState = 'visible'

  turn(state: DocumentVisibilityState) {
    this.visibilityState = state
    this.dispatchEvent(new Event('visibilitychange'))
  }
}

describe('checkOnReturn', () => {
  it('looks for a new version each time the app comes back to the screen', () => {
    const app = new Page()
    const registration = { update: vi.fn(async () => undefined) }
    checkOnReturn(registration, app)
    app.turn('hidden')
    expect(registration.update).not.toHaveBeenCalled()
    app.turn('visible')
    app.turn('hidden')
    app.turn('visible')
    expect(registration.update).toHaveBeenCalledTimes(2)
  })

  it('waits for the next return when the look fails offline', async () => {
    const app = new Page()
    let looks = 0
    // Not a spy: a spy handles the promise it returns, and the test must see the rejection unhandled.
    const registration = {
      update: () => {
        looks++
        return Promise.reject(new TypeError('Failed to fetch'))
      },
    }
    checkOnReturn(registration, app)
    app.turn('visible')
    await new Promise((settled) => setTimeout(settled))
    expect(looks).toBe(1)
  })
})
