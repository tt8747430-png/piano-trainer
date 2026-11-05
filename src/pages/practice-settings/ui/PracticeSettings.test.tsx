import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

const title = (name: string) => screen.findByRole('heading', { level: 1, name })

describe('Practice pages’ Settings (A24, R18)', () => {
  it.each([
    ['/practice/chords', 'Chords', '/settings/chords'],
    ['/practice/scales', 'Scales and keys', '/settings/scales'],
    ['/practice/intervals', 'Intervals', '/settings/intervals'],
    ['/practice/progressions', 'Progressions', '/settings/progressions'],
    ['/practice/accompaniment', 'Accompaniment', '/settings/accompaniment'],
    ['/practice/chord-finder', 'Chord finder', '/settings/chord-finder'],
    ['/practice/exercises', 'Exercises', '/settings/exercises-and-quiz'],
    ['/practice/quiz', 'Quiz', '/settings/exercises-and-quiz'],
  ])(
    'opens %s’s Settings from the gear in its bar, and Back returns to it',
    async (path, name, to) => {
      const user = userEvent.setup()
      const { router } = await renderApp(path)
      await title(name)
      await user.click(screen.getByRole('link', { name: `${name} settings` }))
      await waitFor(() => expect(router.state.location.pathname).toBe(to))
      await screen.findByRole('link', { name: 'On-screen piano' })
      await user.click(screen.getByRole('button', { name: 'Back' }))
      await waitFor(() => expect(router.state.location.pathname).toBe(path))
    },
  )

  it('keeps each Practice page’s Settings behind its page’s gear, not in Settings', async () => {
    await renderApp('/settings')
    await screen.findByRole('navigation', { name: 'Account' })
    expect(screen.queryByRole('region', { name: 'Practice' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Progressions' })).toBeNull()
  })

  it('goes up to Practice from a page’s Settings opened without its page', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings/progressions')
    await title('Progressions')
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice'))
  })

  it('writes and voices every progression as chosen, its first inversion only where voice-led', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/progressions')
    await title('Progressions')
    await user.click(screen.getByRole('radio', { name: 'Nashville' }))
    expect(settingsStore.getState().progressions.names).toBe('nashville')
    await user.click(screen.getByRole('radio', { name: '1st' }))
    expect(settingsStore.getState().progressions.inversion).toBe(1)
    await user.click(screen.getByRole('radio', { name: 'Block' }))
    expect(settingsStore.getState().progressions.voicing).toBe('block')
    expect(screen.queryByRole('radiogroup', { name: 'First chord’s inversion' })).toBeNull()
  })

  it('keeps the Chord finder’s choices on its Settings page, saved', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/chord-finder')
    await title('Chord finder')
    await user.click(screen.getByRole('switch', { name: /Remember the chords/ }))
    await user.click(screen.getByRole('switch', { name: /Scale on the keys/ }))
    expect(settingsStore.getState().chordFinder).toMatchObject({ remember: true, scale: true })
  })

  it('goes on to the next question by itself where asked, on Exercises and Quiz’s Settings', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/exercises-and-quiz')
    await title('Exercises and Quiz')
    await user.click(screen.getByRole('switch', { name: /Go on automatically/ }))
    expect(settingsStore.getState().trainer.autoNext).toBe(true)
  })

  it('hides an Accompaniment source from its tabs, and shows it again', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/settings/accompaniment')
    await title('Accompaniment')
    await user.click(screen.getByRole('switch', { name: 'Rhythm styles' }))
    expect(settingsStore.getState().accompaniment.hidden).toEqual(['styles'])
  })
})
