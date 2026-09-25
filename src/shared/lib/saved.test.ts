import { describe, expect, it } from 'vitest'
import { isRecord, savedObject } from './saved'

describe('savedObject', () => {
  it('reads a saved object’s fields, each still unchecked', () => {
    const saved = savedObject<{ theme: string; locale: string }>({ theme: 'dark', extra: 1 })
    expect(saved.theme).toBe('dark')
    expect(saved.locale).toBeUndefined()
  })

  it.each([null, undefined, 'dark', 42, ['dark']])('reads %j as no fields', (value) => {
    expect(savedObject(value)).toEqual({})
  })
})

describe('isRecord', () => {
  it('tells an object with fields from null, an array or a value', () => {
    expect(isRecord({ a: 1 })).toBe(true)
    expect([null, [], 'a', 1, undefined].some(isRecord)).toBe(false)
  })
})
