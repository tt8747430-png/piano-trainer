import { afterEach, describe, expect, it, vi } from 'vitest'
import { morph } from './morph'

let finish = () => {}
const startViewTransition = vi.fn((update: () => void) => {
  update()
  const finished = new Promise<void>((resolve) => (finish = resolve))
  return { finished } as ViewTransition
})

afterEach(() => {
  Reflect.deleteProperty(document, 'startViewTransition')
  startViewTransition.mockClear()
})

describe('morph', () => {
  it('makes the change at once where the browser has no view transitions', () => {
    const change = vi.fn()
    morph(change)
    expect(change).toHaveBeenCalledOnce()
  })

  it('makes the change inside a view transition, so what moves morphs into its new place', () => {
    Object.assign(document, { startViewTransition })
    const change = vi.fn()
    morph(change)
    expect(startViewTransition).toHaveBeenCalledOnce()
    expect(change).toHaveBeenCalledOnce()
  })

  it('makes the change at once while the learner asks for less motion', () => {
    Object.assign(document, { startViewTransition })
    const reduced = vi
      .spyOn(window, 'matchMedia')
      .mockReturnValue({ matches: true } as MediaQueryList)
    const change = vi.fn()
    morph(change)
    expect(startViewTransition).not.toHaveBeenCalled()
    expect(change).toHaveBeenCalledOnce()
    reduced.mockRestore()
  })

  it('names the way it goes on the page while it runs, so the motion can follow it', async () => {
    Object.assign(document, { startViewTransition })
    morph(() => {}, 'keys-unfold')
    expect(document.documentElement.dataset['morph']).toBe('keys-unfold')
    finish()
    await Promise.resolve()
    await Promise.resolve()
    expect(document.documentElement.dataset['morph']).toBeUndefined()
  })
})
