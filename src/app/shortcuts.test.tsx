import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from './testing/render-app'

describe('the shell’s shortcuts', () => {
  it('goes to a place on Alt and its number', async () => {
    const user = userEvent.setup()
    await renderApp('/')
    await screen.findByRole('heading', { level: 1, name: 'Path' })
    await user.keyboard('{Alt>}2{/Alt}')
    expect(await screen.findByRole('heading', { level: 1, name: 'Songs' })).toBeInTheDocument()
    await user.keyboard('{Alt>}4{/Alt}')
    expect(await screen.findByRole('heading', { level: 1, name: 'Practice' })).toBeInTheDocument()
    await user.keyboard('{Alt>}3{/Alt}')
    expect(await screen.findByRole('heading', { level: 1, name: 'Learn' })).toBeInTheDocument()
    await user.keyboard('{Alt>}1{/Alt}')
    expect(await screen.findByRole('heading', { level: 1, name: 'Path' })).toBeInTheDocument()
  })

  it('collapses and opens the sidebar on Ctrl and B, and says so on its button', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/songs')
    const bar = await screen.findByRole('navigation', { name: 'Main navigation' })
    expect(within(bar).getByRole('button', { name: 'Collapse the sidebar' })).toHaveAttribute(
      'title',
      'Collapse the sidebar (Ctrl B)',
    )
    await user.keyboard('{Control>}b{/Control}')
    expect(settingsStore.getState().sidebar).toBe('collapsed')
    await user.keyboard('{Control>}b{/Control}')
    expect(settingsStore.getState().sidebar).toBe('open')
  })

  it('puts the cursor in the Songs search on /', async () => {
    const user = userEvent.setup()
    await renderApp('/songs')
    const search = await screen.findByRole('searchbox', { name: 'Search songs' })
    await user.keyboard('/')
    expect(search).toHaveFocus()
    expect(search).toHaveValue('')
  })

  it('lists the screen’s shortcuts on ?, and from Settings', async () => {
    const user = userEvent.setup()
    await renderApp('/settings')
    await user.click(await screen.findByRole('button', { name: 'Shortcuts' }))
    const sheet = await screen.findByRole('dialog', { name: 'Shortcuts' })
    expect(within(sheet).getByRole('heading', { level: 3, name: 'Anywhere' })).toBeInTheDocument()
    expect(within(sheet).getByText('Songs')).toBeInTheDocument()
    expect(within(sheet).getByText('Show the shortcuts')).toBeInTheDocument()
  })

  it('lists the Player’s keys first in the Player', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await screen.findByRole('button', { name: 'Play' })
    await user.keyboard('?')
    const sheet = await screen.findByRole('dialog', { name: 'Shortcuts' })
    const groups = within(sheet).getAllByRole('heading', { level: 3 })
    expect(groups[0]).toHaveTextContent('Player')
    expect(groups.at(-1)).toHaveTextContent('Anywhere')
    // The shell's places are not the Player's: it has no navigation.
    expect(within(sheet).queryByText('Songs')).not.toBeInTheDocument()
  })

  it.each(['/practice/chords', '/practice/scales', '/practice/progressions'])(
    'plays %s’s one Play on Enter, and stops it',
    async (path) => {
      const user = userEvent.setup()
      const { audio } = await renderApp(path)
      await screen.findByRole('group', { name: 'Keyboard' })
      await user.keyboard('{Enter}')
      expect(audio.played).toHaveLength(1)
      const stops = audio.stops
      await user.keyboard('{Enter}')
      expect(audio.stops).toBeGreaterThan(stops)
    },
  )

  it('plays the chord found on Enter, once keys are chosen', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/chords/find')
    await user.click(await screen.findByRole('button', { name: 'C4' }))
    const played = audio.played.length
    await user.keyboard('{Enter}')
    expect(audio.played).toHaveLength(played + 1)
  })

  it('lists the piano’s typing keys once the computer keyboard plays them', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/chords')
    await user.click(await screen.findByRole('button', { name: 'Play from the computer keyboard' }))
    await user.keyboard('?')
    const sheet = await screen.findByRole('dialog', { name: 'Shortcuts' })
    const groups = within(sheet).getAllByRole('heading', { level: 3 })
    expect(groups.map((group) => group.textContent)).toEqual([
      'This screen',
      'Piano keys',
      'Anywhere',
    ])
    expect(within(sheet).getByText('Hold the pedal').closest('div')).toHaveTextContent('Space')
  })

  it('lists the score editor’s keys in the editor', async () => {
    const user = userEvent.setup()
    await renderApp('/edit/bz5')
    await screen.findByRole('button', { name: /^Undo/ })
    await user.keyboard('?')
    const sheet = await screen.findByRole('dialog', { name: 'Shortcuts' })
    expect(within(sheet).getAllByRole('heading', { level: 3 })[0]).toHaveTextContent('Score editor')
    expect(within(sheet).getByText('Undo').closest('div')).toHaveTextContent('CtrlZ')
  })
})
