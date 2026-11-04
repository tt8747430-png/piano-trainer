import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { shownText } from '@/shared/test/shown-text'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'

type User = ReturnType<typeof userEvent.setup>

/** The tools row under the Player's bar. */
const toolsRow = () => screen.findByRole('toolbar', { name: 'Tools' })

/** Opens Transpose from the tools row: its popover. */
async function openTranspose(user: User) {
  await user.click(within(await toolsRow()).getByRole('button', { name: /^Transpose/ }))
  const popovers = await screen.findAllByRole('dialog', { name: 'Transpose' })
  const popover = popovers[0]
  if (!popover) throw new Error('the Transpose popover')
  return popover
}

describe('Transpose (ADR 0105)', () => {
  it('stands after the View in the tools row, named by the key the music is in', async () => {
    await renderApp('/play/lightly-row')
    const tools = within(await toolsRow()).getAllByRole('button')
    expect(tools.map((tool) => tool.getAttribute('aria-label'))).toEqual([
      'View: Sheet',
      'Transpose: C major',
      'Simplify',
    ])
    expect(shownText(tools[1] ?? document.body)).toContain('TransposeC')
  })

  it('moves the key a semitone at a time, each key spelled by its simplest signature', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/lightly-row')
    const popover = await openTranspose(user)
    // C down a semitone is B major, never C♭ major's seven flats.
    await user.click(within(popover).getByRole('button', { name: 'Down a semitone' }))
    expect(router.state.location.search).toMatchObject({ transpose: -1 })
    expect(popover).toHaveTextContent('B major')
    expect(popover).toHaveTextContent('−1')
    expect(shownText(screen.getByRole('button', { name: 'Transpose: B major, −1' }))).toContain(
      'TransposeB',
    )
    await user.click(within(popover).getByRole('button', { name: 'Up a semitone' }))
    await user.click(within(popover).getByRole('button', { name: 'Up a semitone' }))
    // Up a semitone from C: D♭ major's five flats, not C♯ major's seven sharps.
    expect(router.state.location.search).toMatchObject({ transpose: 1 })
    expect(popover).toHaveTextContent('D♭ major')
    expect(popover).toHaveTextContent('+1')
    expect(await screen.findByRole('region', { name: 'Sheet music' })).toBeInTheDocument()
  })

  it('names F♯ a semitone over F, where F♯ and G♭ write six each', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/brahms-lullaby')
    const popover = await openTranspose(user)
    await user.click(within(popover).getByRole('button', { name: 'Up a semitone' }))
    expect(router.state.location.search).toMatchObject({ transpose: 1 })
    expect(popover).toHaveTextContent('F♯ major')
    expect(popover).toHaveTextContent('+1')
    // The tool prints the key as a chord symbol is printed.
    expect(shownText(screen.getByRole('button', { name: 'Transpose: F♯ major, +1' }))).toContain(
      'TransposeF♯',
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
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('transpose'))
    expect(popover).toHaveTextContent('C major')
    expect(popover).toHaveTextContent('The song’s key')
    expect(within(popover).getByRole('button', { name: 'Reset' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Transpose: C major' })).toBeInTheDocument()
  })

  it('says beside its heading where the recording falls silent, and nowhere in the song’s key', async () => {
    const user = userEvent.setup()
    await renderApp('/play/romashki?transpose=2')
    const popover = await openTranspose(user)
    expect(popover).toHaveTextContent('E minor')
    await user.click(within(popover).getByRole('button', { name: 'About Transpose' }))
    const about = await screen.findAllByRole('dialog', { name: 'Transpose' })
    expect(about.at(-1)).toHaveTextContent('The recording plays only in D minor, its own key.')
    await user.keyboard('{Escape}')
    await user.click(within(popover).getByRole('button', { name: 'Reset' }))
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
    expect(router.state.location.search).toMatchObject({ transpose: 2, tkey: false })
    await user.click(symbols)
    expect(router.state.location.search).toMatchObject({ tchords: false })
    await user.click(signature)
    expect(router.state.location.search).not.toHaveProperty('tkey')
  })

  it('keeps the key out of the Setup', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Player settings' }))
    const setup = await screen.findByRole('dialog', { name: 'Player settings' })
    expect(within(setup).queryByRole('group', { name: 'Key' })).toBeNull()
    expect(
      within(setup).getByRole('region', { name: 'Accompaniment from the chords' }),
    ).toBeInTheDocument()
  })

  it('reads in Russian: its name the key’s, its heading the verb’s', async () => {
    const user = userEvent.setup()
    await renderApp('/play/romashki?transpose=2', { locale: 'ru' })
    const tool = await screen.findByRole('button', { name: 'Тональность: E минор, +2' })
    expect(shownText(tool)).toContain('ТональностьEm')
    await user.click(tool)
    const popover = (await screen.findAllByRole('dialog', { name: 'Транспонировать' }))[0]
    expect(popover).toHaveTextContent('+2 полутона')
    expect(untranslated(document.body)).toEqual([])
  })
})
