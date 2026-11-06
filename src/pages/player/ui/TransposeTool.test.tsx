import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { shownText } from '@/shared/test/shown-text'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'

type User = ReturnType<typeof userEvent.setup>

/** The Player's foot bar (R31-P). */
const toolsRow = () => screen.findByRole('toolbar', { name: 'Practice tools' })

/** Opens Transpose from the tools row: its popover. */
async function openTranspose(user: User) {
  await user.click(within(await toolsRow()).getByRole('button', { name: /^Transpose/ }))
  const popovers = await screen.findAllByRole('dialog', { name: 'Transpose' })
  const popover = popovers[0]
  if (!popover) throw new Error('the Transpose popover')
  return popover
}

/** Presses the popover's Transpose, which writes what it shows to the URL and closes it. */
async function applyTranspose(user: User, popover: HTMLElement) {
  await user.click(within(popover).getByRole('button', { name: 'Transpose' }))
  await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Transpose' })).toBeNull())
}

describe('Transpose (ADR 0105)', () => {
  it('stands after the View in the foot bar, named by the key the music is in', async () => {
    await renderApp('/play/lightly-row')
    const tools = within(await toolsRow()).getAllByRole('button')
    expect(tools.map((tool) => tool.getAttribute('aria-label') ?? tool.textContent)).toEqual([
      'View: Sheet',
      'Transpose: C major',
      'Version: Original',
      'Listen',
      'More',
    ])
    expect(shownText(tools[1] ?? document.body)).toContain('C')
  })

  it('moves the key a semitone at a time, each key spelled by its simplest signature', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/lightly-row')
    const popover = await openTranspose(user)
    // C down a semitone is B major, never C♭ major's seven flats.
    await user.click(within(popover).getByRole('button', { name: 'Down a semitone' }))
    expect(popover).toHaveTextContent('B major')
    expect(popover).toHaveTextContent('−1')
    // Only shown until Transpose: the URL and the trigger are the key played.
    expect(router.state.location.search).not.toHaveProperty('transpose')
    expect(screen.getByRole('button', { name: 'Transpose: C major' })).toBeInTheDocument()
    await applyTranspose(user, popover)
    expect(router.state.location.search).toMatchObject({ transpose: -1 })
    expect(shownText(screen.getByRole('button', { name: 'Transpose: B major, −1' }))).toContain('B')
    const again = await openTranspose(user)
    await user.click(within(again).getByRole('button', { name: 'Up a semitone' }))
    await user.click(within(again).getByRole('button', { name: 'Up a semitone' }))
    // Up a semitone from C: D♭ major's five flats, not C♯ major's seven sharps.
    expect(again).toHaveTextContent('D♭ major')
    expect(again).toHaveTextContent('+1')
    await applyTranspose(user, again)
    expect(router.state.location.search).toMatchObject({ transpose: 1 })
    expect(await screen.findByRole('region', { name: 'Sheet music' })).toBeInTheDocument()
  })

  it('names F♯ a semitone over F, where F♯ and G♭ write six each', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/brahms-lullaby')
    const popover = await openTranspose(user)
    await user.click(within(popover).getByRole('button', { name: 'Up a semitone' }))
    expect(popover).toHaveTextContent('F♯ major')
    expect(popover).toHaveTextContent('+1')
    await applyTranspose(user, popover)
    expect(router.state.location.search).toMatchObject({ transpose: 1 })
    // The tool prints the key as a chord symbol is printed.
    expect(shownText(screen.getByRole('button', { name: 'Transpose: F♯ major, +1' }))).toContain(
      'F♯',
    )
  })

  it.each([
    ['6', '+6', 'Up a semitone', 'Down a semitone'],
    ['-5', '−5', 'Down a semitone', 'Up a semitone'],
  ])(
    'goes a tritone up and five semitones down at most, the short way the music moves: %s',
    async (key, by, last, back) => {
      const user = userEvent.setup()
      await renderApp(`/play/lightly-row?transpose=${key}`)
      const popover = await openTranspose(user)
      expect(popover).toHaveTextContent(by)
      expect(within(popover).getByRole('button', { name: last })).toBeDisabled()
      expect(within(popover).getByRole('button', { name: back })).toBeEnabled()
    },
  )

  it('goes back to the song’s key with Reset, greyed there', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/lightly-row?transpose=4')
    const popover = await openTranspose(user)
    expect(popover).toHaveTextContent('E major')
    expect(popover).toHaveTextContent('+4')
    await user.click(within(popover).getByRole('button', { name: 'Reset' }))
    expect(popover).toHaveTextContent('C major')
    expect(popover).toHaveTextContent('The song’s key')
    expect(within(popover).getByRole('button', { name: 'Reset' })).toBeDisabled()
    // Shown only: the key played is still E major until Transpose.
    expect(router.state.location.search).toMatchObject({ transpose: 4 })
    await applyTranspose(user, popover)
    expect(router.state.location.search).not.toHaveProperty('transpose')
    expect(screen.getByRole('button', { name: 'Transpose: C major' })).toBeInTheDocument()
  })

  it('shows the first line in the key it lands in, a Preview, while it is open', async () => {
    const user = userEvent.setup()
    await renderApp('/play/lightly-row')
    const popover = await openTranspose(user)
    expect(within(popover).getByRole('region', { name: 'Preview' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Transpose' })).toBeNull())
    expect(screen.queryByRole('region', { name: 'Preview' })).toBeNull()
  })

  it('applies nothing until Transpose: greyed where nothing changed, and closing leaves the URL as it was', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/lightly-row?transpose=2')
    const popover = await openTranspose(user)
    const apply = within(popover).getByRole('button', { name: 'Transpose' })
    expect(apply).toBeDisabled()
    await user.click(within(popover).getByRole('button', { name: 'Up a semitone' }))
    await user.click(within(popover).getByRole('switch', { name: 'Transpose key signature' }))
    expect(apply).toBeEnabled()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Transpose' })).toBeNull())
    expect(router.state.location.search).toEqual({ transpose: 2 })
    // Opened again, it starts from the key played, not from what was left unapplied.
    const reopened = await openTranspose(user)
    expect(reopened).toHaveTextContent('+2')
    expect(within(reopened).getByRole('button', { name: 'Transpose' })).toBeDisabled()
  })

  it('returns to the written key with Reset then Transpose', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/lightly-row?transpose=-3&tkey=false')
    const popover = await openTranspose(user)
    await user.click(within(popover).getByRole('button', { name: 'Reset' }))
    await user.click(within(popover).getByRole('switch', { name: 'Transpose key signature' }))
    await applyTranspose(user, popover)
    expect(router.state.location.search).toEqual({})
    expect(screen.getByRole('button', { name: 'Transpose: C major' })).toBeInTheDocument()
  })

  it('moves a song with a recording to any key, saying nothing of it: the recording follows', async () => {
    const user = userEvent.setup()
    await renderApp('/play/romashki?transpose=2')
    const popover = await openTranspose(user)
    expect(popover).toHaveTextContent('E minor')
    expect(within(popover).queryByRole('button', { name: 'About Transpose' })).toBeNull()
  })

  it('offers the editor’s two switches, each written in the URL only when off (R29 T)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/lightly-row?transpose=2')
    const popover = await openTranspose(user)
    const signature = within(popover).getByRole('switch', { name: 'Transpose key signature' })
    const symbols = within(popover).getByRole('switch', { name: 'Transpose chord symbols' })
    expect(signature).toBeChecked()
    expect(symbols).toBeChecked()
    await user.click(signature)
    await user.click(symbols)
    expect(router.state.location.search).toEqual({ transpose: 2 })
    await applyTranspose(user, popover)
    expect(router.state.location.search).toMatchObject({
      transpose: 2,
      tkey: false,
      tchords: false,
    })
    const again = await openTranspose(user)
    await user.click(within(again).getByRole('switch', { name: 'Transpose key signature' }))
    await applyTranspose(user, again)
    expect(router.state.location.search).not.toHaveProperty('tkey')
    expect(router.state.location.search).toMatchObject({ tchords: false })
  })

  it('keeps the key out of the Setup', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Player settings' }))
    const setup = await screen.findByRole('dialog', { name: 'Player settings' })
    expect(within(setup).queryByRole('group', { name: 'Key' })).toBeNull()
    await user.click(within(setup).getByRole('button', { name: /^Accompaniment/ }))
    expect(
      await screen.findByRole('region', { name: 'Accompaniment from the chords' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Key' })).toBeNull()
  })

  it('reads in Russian: its name the key’s, its heading the verb’s', async () => {
    const user = userEvent.setup()
    await renderApp('/play/romashki?transpose=2', { locale: 'ru' })
    const tool = await screen.findByRole('button', { name: 'Тональность: E минор, +2' })
    expect(shownText(tool)).toContain('Em')
    await user.click(tool)
    const popover = (await screen.findAllByRole('dialog', { name: 'Транспонировать' }))[0]
    expect(popover).toHaveTextContent('+2 полутона')
    expect(untranslated(document.body)).toEqual([])
  })
})
