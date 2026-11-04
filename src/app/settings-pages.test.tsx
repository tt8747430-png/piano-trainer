import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SETTING_HOMES, type SettingKey, type SettingsPageId } from '@/entities/settings'
import { LESSONS } from '@/entities/lesson'
import { renderApp } from './testing/render-app'

/** Settings' own pages, by the page each is the home of (R18, R20). */
const PAGES: readonly (readonly [SettingsPageId, string])[] = [
  ['general', '/settings/general'],
  ['on-screen-piano', '/settings/on-screen-piano'],
  ['connect-piano', '/settings/connect-piano'],
  ['player', '/settings/player'],
  ['score-editor', '/edit/bz5/settings?page=input'],
  ['score-editor', '/edit/bz5/settings?page=recording'],
  ['progressions', '/settings/progressions'],
  ['accompaniment', '/settings/accompaniment'],
  ['chord-player', '/practice/chord-player/settings'],
  ['chord-finder', '/settings/chord-finder'],
  ['trainers', '/settings/exercises-and-quiz'],
  ['lessons', `/lessons/${LESSONS[0]!.id}/settings`],
]

const isKey = (key: string): key is SettingKey => key in SETTING_HOMES

describe('each setting drawn on its one home (R18, A10)', () => {
  it('draws on each Settings page only the settings whose home it is, none on two', async () => {
    const seen = new Map<string, SettingsPageId>()
    for (const [page, path] of PAGES) {
      const { unmount } = await renderApp(path)
      await screen.findByRole('heading', { level: 1 })
      // A key drawn more than once on its own page (a volume a staff) counts once.
      const keys = [
        ...new Set(
          [...document.querySelectorAll('main [data-setting]')].map(
            (row) => row.getAttribute('data-setting') ?? '',
          ),
        ),
      ]
      expect(keys.length, page).toBeGreaterThan(0)
      for (const key of keys) {
        expect(isKey(key) ? SETTING_HOMES[key] : 'not a setting', `${key} on ${page}`).toBe(page)
        expect(seen.get(key), `${key} on ${page}`).toBeUndefined()
        seen.set(key, page)
      }
      unmount()
    }
  })
})
