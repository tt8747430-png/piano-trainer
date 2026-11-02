// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'

import { NOT_PREFERENCES, SETTING_HOMES, SETTINGS_PAGES } from './registry'
import { createMemoryStorage } from '@/shared/lib'

import { createSettingsStore } from './store'

/** Every field of a saved settings value, a group's fields one by one. */
function fields(value: object): string[] {
  return Object.entries(value).flatMap(([key, field]: [string, unknown]) =>
    field !== null && typeof field === 'object' && !Array.isArray(field)
      ? Object.keys(field).map((inner) => `${key}.${inner}`)
      : [key],
  )
}

const initialSettings = () =>
  createSettingsStore({ storage: createMemoryStorage(), languages: ['en'] }).getState()

describe('the settings registry', () => {
  it('gives every field of the saved settings a home, or calls it no preference', () => {
    const known = new Set(Object.keys(SETTING_HOMES))
    const kept = (field: string) =>
      NOT_PREFERENCES.some((name) => field === name || field.startsWith(`${name}.`))
    expect(fields(initialSettings()).filter((field) => !known.has(field) && !kept(field))).toEqual(
      [],
    )
  })

  it('names only fields the saved settings have', () => {
    const real = new Set(fields(initialSettings()))
    expect(Object.keys(SETTING_HOMES).filter((key) => !real.has(key))).toEqual([])
  })

  it('homes each preference on a known page', () => {
    for (const home of Object.values(SETTING_HOMES)) expect(SETTINGS_PAGES).toContain(home)
  })
})
