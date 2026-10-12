import { describe, expect, it } from 'vitest'
import { viewToOpen } from './remember'

const REMEMBERED = { key: 'G', pattern: 'r4', tempo: 90 }

describe('viewToOpen', () => {
  it('fills no hands or inversion kept from another pattern when a link names a pattern', () => {
    const kept = ['pattern', 'rh', 'lh', 'inversion', 'tempo']
    const remembered = { pattern: 'block', rh: 'b1', inversion: 1, tempo: 80 }
    expect(viewToOpen({ pattern: 'r5' }, remembered, kept, false)).toEqual({
      pattern: 'r5',
      tempo: 80,
    })
  })

  it('opens the remembered view when opened plainly', () => {
    expect(viewToOpen({}, REMEMBERED, [], true)).toBe(REMEMBERED)
  })

  it('opens a link as it names it, the kept params it leaves out remembered', () => {
    expect(viewToOpen({ key: 'D' }, REMEMBERED, ['key', 'pattern'], false)).toEqual({
      key: 'D',
      pattern: 'r4',
    })
    expect(viewToOpen({}, REMEMBERED, ['pattern'], false)).toEqual({ pattern: 'r4' })
  })

  it('hands back the URL itself when there is nothing to fill or nothing remembered', () => {
    const url = { key: 'D', pattern: 'r3' }
    expect(viewToOpen(url, REMEMBERED, ['key', 'pattern'], false)).toBe(url)
    expect(viewToOpen(url, REMEMBERED, [], false)).toBe(url)
    expect(viewToOpen(url, undefined, ['tempo'], true)).toBe(url)
    expect(viewToOpen(url, REMEMBERED, [], true)).toBe(url)
  })
})
