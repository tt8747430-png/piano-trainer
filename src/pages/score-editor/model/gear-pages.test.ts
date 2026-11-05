import { describe, expect, it } from 'vitest'
import { gearBack, GEAR_PAGES } from './gear-pages'

describe('the gear’s pages (R31-E)', () => {
  it('goes back from each page to the one it was turned from, and shuts from the first', () => {
    expect(gearBack('main')).toBeNull()
    expect(gearBack('view')).toBe('main')
    expect(gearBack('music')).toBe('main')
    expect(gearBack('time')).toBe('music')
    expect(gearBack('input')).toBe('howItWorks')
  })

  it('reaches the first page from every page', () => {
    for (const page of GEAR_PAGES) {
      let at: typeof page | null = page
      for (let steps = 0; at !== null && at !== 'main' && steps < 4; steps++) at = gearBack(at)
      expect(at === null || at === 'main').toBe(true)
    }
  })
})
