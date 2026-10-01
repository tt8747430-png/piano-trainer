import { describe, expect, it } from 'vitest'
import { createViewsStore, MOST_VIEWS } from '@/entities/views'
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

  it('puts the screen used last at the end, forgetting the oldest past 200', () => {
    const views = store()
    for (let i = 0; i <= MOST_VIEWS; i++) rememberView(views, `/play/p${i}`, { tempo: i })
    rememberView(views, '/play/p1', { tempo: 99 })
    const paths = Object.keys(views.getState().views)
    expect(paths).toHaveLength(MOST_VIEWS)
    expect(paths[0]).toBe('/play/p2')
    expect(paths.at(-1)).toBe('/play/p1')
  })

  it('writes nothing for the view it already remembers', () => {
    const views = store()
    rememberView(views, '/learn/keys', { key: 'G' })
    const before = views.getState()
    rememberView(views, '/learn/keys', { key: 'G' })
    expect(views.getState()).toBe(before)
  })
})
