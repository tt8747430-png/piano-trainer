import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createSettingsStore, SettingsStoreProvider, type Theme } from '@/entities/settings'
import { setTheme } from '@/features/set-preference'
import { createMemoryStorage } from '@/shared/lib'
import { stubMatchMedia } from '@/shared/test/match-media'
import { ThemeProvider } from './ThemeProvider'

function renderWith(theme: Theme, { osDark = false } = {}) {
  const media = stubMatchMedia({ dark: osDark })
  const store = createSettingsStore({ storage: createMemoryStorage(), languages: ['en'] })
  setTheme(store, theme)
  render(
    <SettingsStoreProvider store={store}>
      <ThemeProvider>
        <p>app</p>
      </ThemeProvider>
    </SettingsStoreProvider>,
  )
  return { media, store }
}

const painted = () => document.documentElement.dataset.theme

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
    const { media, store } = renderWith('system', { osDark: false })
    act(() => setTheme(store, 'light'))
    act(() => media.setDark(true))
    expect(painted()).toBe('light')
    expect(media.listenerCount()).toBe(0)
  })
})
