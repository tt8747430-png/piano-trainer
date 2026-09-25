import { describe, expect, it } from 'vitest'
import { canonicalFamilies, canonicalScales, detectLocale, isLocale, isTheme } from './types'

describe('detectLocale', () => {
  it.each([
    [['ru-RU'], 'ru'],
    [['RU'], 'ru'],
    [['de-DE', 'ru'], 'ru'],
    [['en-GB', 'ru'], 'en'],
    [['de-DE'], 'en'],
    [[], 'en'],
    [undefined, 'en'],
  ] as const)('%j → %s', (languages, expected) => {
    expect(detectLocale(languages)).toBe(expected)
  })
})

describe('guards', () => {
  it('recognise only the themes and locales the app has', () => {
    expect(isTheme('dark')).toBe(true)
    expect(isTheme('sepia')).toBe(false)
    expect(isLocale('ru')).toBe(true)
    expect(isLocale('fr')).toBe(false)
    expect(isLocale(undefined)).toBe(false)
  })
})

describe('canonical lists', () => {
  it('keep the known families once each, in table order', () => {
    expect(canonicalFamilies(['nin', 'bogus', 'tri', 'nin', 3])).toEqual(['tri', 'nin'])
  })

  it('keep the known scales once each, in table order', () => {
    expect(canonicalScales(['blues', 'major', 'constructor'])).toEqual(['major', 'blues'])
  })
})
