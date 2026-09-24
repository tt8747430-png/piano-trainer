import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { createSettingsStore, SETTINGS_STORAGE_KEY } from '@/entities/settings'
import { setTheme } from '@/features/set-preference'
import { stubMatchMedia } from '@/shared/test/match-media'

const html = readFileSync('index.html', 'utf8')
const boot = html.match(/<script id="theme-boot">([\s\S]*?)<\/script>/)?.[1]

/** Runs index.html's boot script as the browser would, before any module loads. */
function runBoot() {
  if (!boot) throw new Error('index.html has no <script id="theme-boot">')
  new Function(boot)()
  return document.documentElement.dataset.theme
}

describe('the #theme-boot script in index.html', () => {
  it('paints the theme the settings store saved', () => {
    stubMatchMedia({ dark: false })
    setTheme(createSettingsStore({ languages: ['en'] }), 'dark')
    expect(runBoot()).toBe('dark')
  })

  it('asks the OS when the saved theme is system', () => {
    stubMatchMedia({ dark: true })
    setTheme(createSettingsStore({ languages: ['en'] }), 'system')
    expect(runBoot()).toBe('dark')
  })

  it('asks the OS when nothing is saved', () => {
    stubMatchMedia({ dark: true })
    expect(runBoot()).toBe('dark')
  })

  it('asks the OS when the saved JSON is corrupt', () => {
    stubMatchMedia({ dark: false })
    localStorage.setItem(SETTINGS_STORAGE_KEY, '{oops')
    expect(runBoot()).toBe('light')
  })
})
