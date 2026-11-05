import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SETTING_HOMES, type SettingKey, type SettingsPageId } from '@/entities/settings'
import { LESSONS } from '@/entities/lesson'
import { openGear } from './testing/editor-gear'
import { renderApp } from './testing/render-app'

/**
 * Settings' own pages, by the page each is the home of (R18, R20): a route, or the rows that turn a
 * screen's gear to it (the score editor's, R31-E).
 */
const PAGES: readonly (readonly [SettingsPageId, string, ...RegExp[]])[] = [
  ['general', '/settings/general'],
  ['on-screen-piano', '/settings/on-screen-piano'],
  ['connect-piano', '/settings/connect-piano'],
  ['player', '/settings/player'],
  ['score-editor', '/edit/bz5', /^How the editor works/, /^Note input/],
  ['score-editor', '/edit/bz5', /^How the editor works/, /^Recording/],
  ['progressions', '/settings/progressions'],
  ['accompaniment', '/settings/accompaniment'],
  ['chord-player', '/practice/chord-player/settings'],
  ['metronome', '/practice/metronome'],
  ['tuner', '/practice/tuner'],
  ['chord-finder', '/settings/chord-finder'],
  ['trainers', '/practice/quiz/chords'],
  ['select-toolbar', '/settings/select-toolbar'],
  ['swipe-actions', '/settings/swipe-actions'],
  ['lessons', `/lessons/${LESSONS[0]!.id}/settings`],
]

const isKey = (key: string): key is SettingKey => key in SETTING_HOMES

describe('each setting drawn on its one home (R18, A10)', () => {
  // Sixteen pages opened in turn: a suite's load slows each, so the walk has room (R32).
  it('draws on each Settings page only the settings whose home it is, none on two', async () => {
    const seen = new Map<string, SettingsPageId>()
    const user = userEvent.setup()
    for (const [page, path, ...rows] of PAGES) {
      const { unmount } = await renderApp(path)
      let place: ParentNode = document
      if (rows.length > 0) place = await openGear(user, ...rows)
      else await screen.findByRole('heading', { level: 1 })
      // A key drawn more than once on its own page (a volume a staff) counts once.
      const keys = [
        ...new Set(
          [
            ...place.querySelectorAll(rows.length > 0 ? '[data-setting]' : 'main [data-setting]'),
          ].map((row) => row.getAttribute('data-setting') ?? ''),
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
  }, 30_000)
})
