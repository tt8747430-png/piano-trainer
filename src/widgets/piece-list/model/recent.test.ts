import { describe, expect, it } from 'vitest'
import { byLastOpened } from './recent'

describe('byLastOpened', () => {
  it('lists the pieces opened, latest first', () => {
    const practised = {
      bz5: '2026-10-09T10:00:00.000Z',
      ode: '2026-10-11T08:00:00.000Z',
      silent: '2026-10-10T21:00:00.000Z',
      hgta: '2026-09-01T10:00:00.000Z',
    }
    expect(byLastOpened(practised)).toEqual(['ode', 'silent', 'bz5', 'hgta'])
    expect(byLastOpened({})).toEqual([])
  })
})
