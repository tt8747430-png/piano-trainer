// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { followOtherTabs } from './other-tabs'

const SAVE = { key: 'pt-progress', version: 2 }

/** Another tab's save under `key`, as the browser tells this one. */
const saved = (key: string | null, newValue: string | null) =>
  new StorageEvent('storage', { key, newValue })
const at = (version: number) => JSON.stringify({ state: {}, version })

function follow() {
  const tabs = new EventTarget()
  const rehydrate = vi.fn()
  followOtherTabs({ rehydrate }, SAVE, tabs)
  return { tabs, rehydrate }
}

describe('followOtherTabs', () => {
  it('reads again a save of its own version made in another tab', () => {
    const { tabs, rehydrate } = follow()
    tabs.dispatchEvent(saved('pt-progress', at(2)))
    expect(rehydrate).toHaveBeenCalledOnce()
  })

  it.each([1, 3])('leaves a version-%i save to the tab that wrote it', (version) => {
    const { tabs, rehydrate } = follow()
    tabs.dispatchEvent(saved('pt-progress', at(version)))
    expect(rehydrate).not.toHaveBeenCalled()
  })

  it('leaves it alone when another key is saved, or the save is removed or unreadable', () => {
    const { tabs, rehydrate } = follow()
    tabs.dispatchEvent(saved('pt-settings', at(2)))
    tabs.dispatchEvent(saved('pt-progress', null))
    tabs.dispatchEvent(saved(null, null))
    tabs.dispatchEvent(saved('pt-progress', '{oops'))
    expect(rehydrate).not.toHaveBeenCalled()
  })
})
