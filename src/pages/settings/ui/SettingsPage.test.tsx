import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Settings', () => {
  it('shows the saved language and theme as chosen', async () => {
    await renderApp('/settings')
    expect(await screen.findByRole('button', { name: 'English' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'System' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('groups each choice under its own heading', async () => {
    await renderApp('/settings')
    const language = await screen.findByRole('group', { name: 'Language' })
    expect(
      within(language)
        .getAllByRole('button')
        .map((b) => b.textContent),
    ).toEqual(['English', 'Русский'])
    const theme = screen.getByRole('group', { name: 'Theme' })
    expect(
      within(theme)
        .getAllByRole('button')
        .map((b) => b.textContent),
    ).toEqual(['System', 'Light', 'Dark'])
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings.slice(headings.indexOf('Theme'), headings.indexOf('Theme') + 3)).toEqual([
      'Theme',
      'Keyboard',
      'MIDI keyboard',
    ])
  })

  it('sets up the keyboard, and saves each change', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings')
    const keys = await screen.findByRole('group', { name: 'Keys' })
    await user.click(within(keys).getByRole('button', { name: 'Large' }))
    await user.click(screen.getByRole('switch', { name: 'Keyboard map' }))
    expect(settingsStore.getState().keyboard).toMatchObject({ keySize: 'large', map: true })
  })

  it('names each keyboard choice as a row of its group, not as a second heading', async () => {
    await renderApp('/settings')
    const keys = await screen.findByText('Keys')
    expect(keys).toHaveClass('text-foreground')
    expect(keys).not.toHaveClass('text-muted-foreground')
  })

  it('saves a new language', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings')
    await user.click(await screen.findByRole('button', { name: 'Русский' }))
    expect(settingsStore.getState().locale).toBe('ru')
  })

  it('saves a new theme', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings')
    await user.click(await screen.findByRole('button', { name: 'Dark' }))
    expect(settingsStore.getState().theme).toBe('dark')
  })

  it('says in one line when the browser cannot connect a keyboard', async () => {
    await renderApp('/settings', { webMidi: false })
    expect(
      await screen.findByText('This browser can’t connect a MIDI keyboard.'),
    ).toBeInTheDocument()
  })

  it('resets progress only after confirming, then closes the dialog', async () => {
    const user = userEvent.setup()
    const { progressStore } = await renderApp('/settings')
    act(() => progressStore.setState({ learned: { 'chords:tri': '2026-09-25T10:00:00Z' } }))
    await user.click(await screen.findByRole('button', { name: 'Reset progress' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(progressStore.getState().learned['chords:tri']).toBeDefined()
    await user.click(screen.getByRole('button', { name: 'Reset progress' }))
    await user.click(await screen.findByRole('button', { name: 'Reset' }))
    expect(progressStore.getState().learned).toEqual({})
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
  })
})
