import { describe, expect, it } from 'vitest'
import { toggled } from './toggled'

describe('toggled', () => {
  it('puts an item in a list or takes it out, at the end where it goes in', () => {
    expect(toggled([60, 64], 67)).toEqual([60, 64, 67])
    expect(toggled([60, 64, 67], 64)).toEqual([60, 67])
  })

  it('puts it in or takes it out as asked', () => {
    expect(toggled(['tri'], 'sev', true)).toEqual(['tri', 'sev'])
    expect(toggled(['tri', 'sev'], 'tri', false)).toEqual(['sev'])
    expect(toggled(['tri'], 'sev', false)).toEqual(['tri'])
  })
})
