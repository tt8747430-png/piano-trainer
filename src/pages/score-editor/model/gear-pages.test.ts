import { describe, expect, it } from 'vitest'
import { gearBack, GEAR_PAGES } from './gear-pages'

describe('the gear’s pages (R32-B)', () => {
  it('goes back from each setting to the first page, and shuts from the first', () => {
    expect(gearBack('main')).toBeNull()
    expect(gearBack('view')).toBe('main')
    expect(gearBack('instruments')).toBe('main')
    expect(gearBack('input')).toBe('main')
  })

  it('shuts from Title and credits, which the printed title opens', () => {
    expect(gearBack('credits')).toBeNull()
  })

  it('holds nothing the score prints and sets where it prints it', () => {
    expect(GEAR_PAGES).not.toContain('key')
    expect(GEAR_PAGES).not.toContain('time')
    expect(GEAR_PAGES).not.toContain('tempo')
    expect(GEAR_PAGES).not.toContain('bars')
  })
})
