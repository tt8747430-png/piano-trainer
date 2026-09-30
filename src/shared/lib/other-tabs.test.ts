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

  it('reads again a save of an older version, which it can bring up to date', () => {
    const { tabs, rehydrate } = follow()
    tabs.dispatchEvent(saved('pt-progress', at(1)))
    expect(rehydrate).toHaveBeenCalledOnce()
  })

  it('leaves a newer version’s save to the tab that wrote it', () => {
    const { tabs, rehydrate } = follow()
    tabs.dispatchEvent(saved('pt-progress', at(3)))
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
