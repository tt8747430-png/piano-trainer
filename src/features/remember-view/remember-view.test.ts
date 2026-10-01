import { describe, expect, it } from 'vitest'
import { createViewsStore } from '@/entities/views'
import { createMemoryStorage } from '@/shared/lib'
import { rememberView } from './remember-view'

const store = () =>
  createViewsStore({ storage: createMemoryStorage(), otherTabs: new EventTarget() })

describe('rememberView', () => {
  it('remembers a screen’s params, never its loop or a path step’s panel, nor what is left out', () => {
    const views = store()
    rememberView(views, '/play/bz5', {
      key: 'A',
      tempo: 80,
      swing: false,
      loop: '3-4',
      step: 'p1',
      pattern: undefined,
    })
    expect(views.getState().views).toEqual({ '/play/bz5': { key: 'A', tempo: 80, swing: false } })
  })

  it('writes nothing for the view it already remembers', () => {
    const views = store()
    rememberView(views, '/learn/keys', { key: 'G' })
    const before = views.getState()
    rememberView(views, '/learn/keys', { key: 'G' })
    expect(views.getState()).toBe(before)
  })
})
