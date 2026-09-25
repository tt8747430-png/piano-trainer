import { describe, expect, it } from 'vitest'
import { isLocale } from './locale'

describe('isLocale', () => {
  it('recognises only the languages the app speaks', () => {
    expect(isLocale('ru')).toBe(true)
    expect(isLocale('fr')).toBe(false)
    expect(isLocale(undefined)).toBe(false)
  })
})
