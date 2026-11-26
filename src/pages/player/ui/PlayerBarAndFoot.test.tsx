import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { stubMatchMedia } from '@/shared/test/match-media'

type User = ReturnType<typeof userEvent.setup>

/** Opens the Player's gear: its settings and, under More, its acts on the music. */
async function openGear(user: User) {
  await user.click(await screen.findByRole('button', { name: 'Player settings' }))
  return screen.findByRole('dialog', { name: 'Player settings' })
}

/** The Player's Settings pages in the order they stand, by each row's name (R32). */
const pageTitles = (sheet: HTMLElement) =>
  [...sheet.querySelectorAll('button, a')]
    .map((row) =>
      ['Transpose', 'Score view', 'Playback', 'Staves'].find((title) =>
        row.textContent?.startsWith(title),
      ),
    )
    .filter((title) => title !== undefined)

describe('the Player’s bar, foot and gear (R31-P)', () => {
  it('has no Tools button: its bar holds Close, the mode and the one gear', async () => {
    await renderApp('/play/bz5')
    expect(await screen.findByRole('button', { name: 'Player settings' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Tools' })).not.toBeInTheDocument()
    expect(screen.queryByRole('toolbar', { name: 'Tools' })).not.toBeInTheDocument()
  })

  it('lists in its Settings what the Player does while you play, no acts of the music', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    const sheet = await openGear(user)
    expect(pageTitles(sheet)).toEqual(['Transpose', 'Score view', 'Playback', 'Staves'])
    expect(within(sheet).getByRole('radiogroup', { name: 'What you play' })).toBeInTheDocument()
    for (const name of ['This song', 'Share'])
      expect(within(sheet).queryByRole('region', { name })).not.toBeInTheDocument()
  })

  it('opens the Player’s Score view in its Settings: one home', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    const sheet = await openGear(user)
    await user.click(within(sheet).getByRole('button', { name: /^Score view/ }))
    const settings = await screen.findByRole('dialog', { name: 'Score view' })
    expect(within(settings).getByRole('radiogroup', { name: 'Layout' })).toBeInTheDocument()
  })

  it('chooses the version in its Settings’ Level', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    const sheet = await openGear(user)
    const level = within(sheet).getByRole('radiogroup', { name: 'Level' })
    expect(within(level).getByRole('radio', { name: 'Original' })).toBeChecked()
    await user.click(within(level).getByRole('radio', { name: 'Simplified' }))
    expect(router.state.location.search).toMatchObject({ version: 'simple' })
  })

  it('opens Transpose from its Settings’ Transpose', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    const sheet = await openGear(user)
    await user.click(within(sheet).getByRole('button', { name: /^Transpose/ }))
    const transpose = await screen.findByRole('dialog', { name: 'Transpose' })
    expect(within(transpose).getByRole('button', { name: 'Down a semitone' })).toBeInTheDocument()
  })

  it('annotates the place the cursor is in, typed, saved with the song (R29 B8, D7)', async () => {
    // A laptop: the gear a card hung under its button, the score beside it in reach.
    stubMatchMedia({ dark: true })
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/play/bz5')
    const sheet = await openGear(user)
    await user.click(within(sheet).getByRole('button', { name: 'More' }))
    const menu = await screen.findByRole('menu')
    await user.click(within(menu).getByRole('menuitem', { name: 'Annotate' }))
    const bar = await screen.findByRole('toolbar', { name: 'Annotations' })
    await user.click(within(bar).getByRole('button', { name: 'Pause' }))
    await user.click(within(bar).getByRole('button', { name: 'Fingering' }))
    await user.click(await screen.findByRole('button', { name: '3' }))
    expect(piecesStore.getState().annotations.bz5).toEqual([
      { at: 0, staff: 'treble', kind: 'pause' },
      { at: 0, staff: 'treble', kind: 'fingering', value: 3 },
    ])
    await user.click(within(bar).getByRole('button', { name: 'Clear the marks here' }))
    expect(piecesStore.getState().annotations).toEqual({})
    await user.click(within(bar).getByRole('button', { name: 'Done' }))
    expect(screen.queryByRole('toolbar', { name: 'Annotations' })).toBeNull()
  })
})
