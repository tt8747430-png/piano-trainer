import { act, screen } from '@testing-library/react'
import { describe, expect, it, onTestFinished } from 'vitest'
import type { Theme } from '@/entities/settings'
import { setTheme } from '@/features/set-preference'
import { THEME_COLORS } from '@/shared/config'
import { stubMatchMedia } from '@/shared/test/match-media'
import { renderWithSettings } from '../testing/render-with-settings'
import { ThemeProvider } from './ThemeProvider'

function renderWith(theme: Theme, { osDark = false } = {}) {
  const media = stubMatchMedia({ dark: osDark })
  const { settingsStore } = renderWithSettings(
    <ThemeProvider>
      <p>app</p>
    </ThemeProvider>,
    { theme },
  )
  return { media, settingsStore }
}

const painted = () => document.documentElement.dataset.theme

/** The per-scheme toolbar colours the build puts in index.html's head. */
function addToolbarColors() {
  const metas = (['light', 'dark'] as const).map((scheme) => {
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.media = `(prefers-color-scheme: ${scheme})`
    meta.content = THEME_COLORS[scheme]
    document.head.append(meta)
    return meta
  })
  onTestFinished(() => metas.forEach((meta) => meta.remove()))
  return () => metas.map((meta) => meta.content)
}

describe('ThemeProvider', () => {
  it('renders its children', () => {
    renderWith('light')
    expect(screen.getByText('app')).toBeInTheDocument()
  })

  it('paints a chosen theme whatever the OS says', () => {
    renderWith('dark', { osDark: false })
    expect(painted()).toBe('dark')
  })

  it('paints the OS scheme on system', () => {
    renderWith('system', { osDark: true })
    expect(painted()).toBe('dark')
  })

  it('follows the OS while on system', () => {
    const { media } = renderWith('system', { osDark: false })
    act(() => media.setDark(true))
    expect(painted()).toBe('dark')
    act(() => media.setDark(false))
    expect(painted()).toBe('light')
  })

  it('stops following the OS once a theme is chosen', () => {
    const { media, settingsStore } = renderWith('system', { osDark: false })
    act(() => setTheme(settingsStore, 'light'))
    act(() => media.setDark(true))
    expect(painted()).toBe('light')
  })

  it('colours the browser toolbar with the painted theme, whichever scheme it was declared for', () => {
    const toolbar = addToolbarColors()
    const { settingsStore } = renderWith('dark', { osDark: false })
    expect(toolbar()).toEqual([THEME_COLORS.dark, THEME_COLORS.dark])
    act(() => setTheme(settingsStore, 'light'))
    expect(toolbar()).toEqual([THEME_COLORS.light, THEME_COLORS.light])
  })
})
