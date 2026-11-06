import { describe, expect, it } from 'vitest'
import { ADMIN_SECTIONS, settingsPlaceOf, SETTINGS_GROUPS } from './sections'

describe('the Settings page a path belongs to (R32)', () => {
  it('marks each of Settings’ own pages', () => {
    for (const page of SETTINGS_GROUPS.flatMap((group) => group.pages))
      expect(settingsPlaceOf(page.to)).toEqual({ kind: 'page', to: page.to })
  })

  it('marks the page a page sits under: the MIDI log, the legal pages', () => {
    expect(settingsPlaceOf('/settings/connect-piano/log')).toEqual({
      kind: 'page',
      to: '/settings/connect-piano',
    })
    expect(settingsPlaceOf('/legal/privacy')).toEqual({ kind: 'page', to: '/settings/about' })
    expect(settingsPlaceOf('/legal/terms')).toEqual({ kind: 'page', to: '/settings/about' })
  })

  it('marks the account under its own pages', () => {
    for (const path of [
      '/settings/account',
      '/settings/account/profile',
      '/settings/account/password',
      '/settings/privacy',
    ])
      expect(settingsPlaceOf(path)).toEqual({ kind: 'account' })
  })

  it('marks each Administration section, and the Administration’s list', () => {
    expect(settingsPlaceOf('/admin')).toEqual({ kind: 'admin', section: null })
    for (const section of ADMIN_SECTIONS)
      expect(settingsPlaceOf(`/admin/${section}`)).toEqual({ kind: 'admin', section })
    expect(settingsPlaceOf('/admin/nothing')).toBeNull()
  })

  it('lists no page Settings does not hold: a Practice page’s Settings, a song’s', () => {
    expect(settingsPlaceOf('/settings/chords')).toBeNull()
    expect(settingsPlaceOf('/settings/exercises-and-quiz')).toBeNull()
    expect(settingsPlaceOf('/songs/abc/settings')).toBeNull()
  })
})
