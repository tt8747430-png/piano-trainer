import { describe, expect, it } from 'vitest'
import { createViewsStore } from '@/entities/views'
import { createMemoryStorage } from '@/shared/lib'
import { rememberSearch } from './remember-search'

const store = () =>
  createViewsStore({ storage: createMemoryStorage(), otherTabs: new EventTarget() })

describe('rememberSearch', () => {
  it('puts a search first, trimmed, and keeps nothing blank', () => {
    const views = store()
    rememberSearch(views, 'dorian')
    rememberSearch(views, '  grace ')
    rememberSearch(views, '   ')
    expect(views.getState().searchRecent).toEqual(['grace', 'dorian'])
  })

  it('keeps a search once, in any case, moving it first', () => {
    const views = store()
    rememberSearch(views, 'dorian')
    rememberSearch(views, 'grace')
    rememberSearch(views, 'Dorian')
    expect(views.getState().searchRecent).toEqual(['Dorian', 'grace'])
  })

  it('keeps the latest eight', () => {
    const views = store()
    for (let i = 0; i < 10; i++) rememberSearch(views, `query ${i}`)
    expect(views.getState().searchRecent).toEqual(
      Array.from({ length: 8 }, (_, i) => `query ${9 - i}`),
    )
  })
})
