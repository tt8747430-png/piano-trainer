import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

const title = (name: string) => screen.findByRole('heading', { level: 1, name })

describe('Practice pages’ settings (A24, R18)', () => {
  it.each([
    ['/practice/intervals', 'Intervals', 'Interval settings'],
    ['/practice/progressions/doo-wop', /Doo-wop/, 'Progression settings'],
    ['/practice/chord-finder', 'Chord finder', 'Chord finder settings'],
  ])('opens %s’s settings in place from the gear in its bar', async (path, name, settings) => {
    const user = userEvent.setup()
    const { router } = await renderApp(path)
    await screen.findByRole('heading', { level: 1, name })
    const gear = screen.getByRole('button', { name: settings })
    expect(gear).toHaveAttribute('aria-expanded', 'false')
    await user.click(gear)
    expect(await screen.findByRole('dialog', { name: settings })).toBeVisible()
    expect(gear).toHaveAttribute('aria-expanded', 'true')
    expect(router.state.location.pathname).toBe(path)
  })

  it('keeps each Practice page’s settings behind its page’s gear, not in Settings', async () => {
    await renderApp('/settings')
    await screen.findByRole('navigation', { name: 'Account' })
    expect(screen.queryByRole('region', { name: 'Practice' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Progressions' })).toBeNull()
  })

  it('goes up to Scales and keys from what its staff writes, opened without its page', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings/scales')
    await title('Scales and keys')
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice'))
  })

  it('writes and voices every progression as chosen, its first inversion only where voice-led', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/practice/progressions/doo-wop')
    await user.click(await screen.findByRole('button', { name: 'Progression settings' }))
    const sheet = await screen.findByRole('dialog', { name: 'Progression settings' })
    await user.click(within(sheet).getByRole('radio', { name: 'Nashville' }))
    expect(settingsStore.getState().progressions.names).toBe('nashville')
    await user.click(within(sheet).getByRole('radio', { name: '1st' }))
    expect(settingsStore.getState().progressions.inversion).toBe(1)
    await user.click(within(sheet).getByRole('radio', { name: 'Block' }))
    expect(settingsStore.getState().progressions.voicing).toBe('block')
    expect(within(sheet).queryByRole('radiogroup', { name: 'First chord’s inversion' })).toBeNull()
  })

  it('keeps the Chord finder’s choices in its settings, saved', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/practice/chord-finder')
    await user.click(await screen.findByRole('button', { name: 'Chord finder settings' }))
    const sheet = await screen.findByRole('dialog', { name: 'Chord finder settings' })
    await user.click(within(sheet).getByRole('switch', { name: /Remember the chords played/ }))
    await user.click(within(sheet).getByRole('switch', { name: /Key’s scale on the keyboard/ }))
    expect(settingsStore.getState().chordFinder).toMatchObject({ remember: true, scale: true })
  })

  it.each([
    ['/practice/chords', 'Chords'],
    ['/practice/exercises', 'Exercises'],
    ['/practice/quiz', 'Quiz'],
    ['/practice/accompaniment', 'Accompaniment'],
  ])('gives %s no gear: nothing of its own to set on a page (R32)', async (path, name) => {
    await renderApp(path)
    await title(name)
    expect(screen.queryByRole('button', { name: `${name} settings` })).toBeNull()
  })

  it('goes on to the next question by itself where asked, set in the drill’s setup (R32)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/practice/quiz/chords')
    await screen.findByRole('heading', { level: 1 })
    await user.click(screen.getByRole('switch', { name: /Advance automatically/ }))
    expect(settingsStore.getState().trainer.autoNext).toBe(true)
  })
})
