import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
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

describe('Transpose (ADR 0104)', () => {
  it('stands after the View in the tools row, named by the key the music is in', async () => {
    await renderApp('/play/lightly-row')
    const tools = within(await toolsRow()).getAllByRole('button')
    expect(tools.map((tool) => tool.getAttribute('aria-label'))).toEqual([
      'View: Sheet music',
      'Transpose: C major',
      'Simplify',
    ])
    expect(tools[1]).toHaveTextContent('TransposeC')
  })

  it('moves the key a semitone at a time, each key spelled by its simplest signature', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/lightly-row')
    const popover = await openTranspose(user)
    // C down a semitone is B major, never C♭ major's seven flats.
    await user.click(within(popover).getByRole('button', { name: 'Down a semitone' }))
    expect(router.state.location.search).toMatchObject({ key: 'B' })
    expect(popover).toHaveTextContent('B major')
    expect(popover).toHaveTextContent('−1')
    expect(screen.getByRole('button', { name: 'Transpose: B major, −1' })).toHaveTextContent(
      'TransposeB',
    )
    await user.click(within(popover).getByRole('button', { name: 'Up a semitone' }))
    await user.click(within(popover).getByRole('button', { name: 'Up a semitone' }))
    // Up a semitone from C: D♭ major's five flats, not C♯ major's seven sharps.
    expect(router.state.location.search).toMatchObject({ key: 'Db' })
    expect(popover).toHaveTextContent('D♭ major')
    expect(popover).toHaveTextContent('+1')
    expect(await screen.findByRole('region', { name: 'Sheet music' })).toBeInTheDocument()
  })

  it('names F♯ a semitone over F, where F♯ and G♭ write six each', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/brahms-lullaby')
    const popover = await openTranspose(user)
    await user.click(within(popover).getByRole('button', { name: 'Up a semitone' }))
    expect(router.state.location.search).toMatchObject({ key: 'F#' })
    expect(popover).toHaveTextContent('F# major')
    expect(popover).toHaveTextContent('+1')
    // The tool prints the key as a chord symbol is printed.
    expect(screen.getByRole('button', { name: 'Transpose: F# major, +1' })).toHaveTextContent(
      'TransposeF♯',
    )
  })

  it.each([
    ['F%23', '+6', 'Up a semitone', 'Down a semitone'],
    ['G', '−5', 'Down a semitone', 'Up a semitone'],
  ])(
    'goes a tritone up and five semitones down at most, the short way the music moves: %s',
    async (key, by, last, back) => {
      const user = userEvent.setup()
      await renderApp(`/play/lightly-row?key=${key}`)
      const popover = await openTranspose(user)
      expect(popover).toHaveTextContent(by)
      expect(within(popover).getByRole('button', { name: last })).toBeDisabled()
      expect(within(popover).getByRole('button', { name: back })).toBeEnabled()
    },
  )

  it('goes back to the song’s key with Reset, greyed there', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/lightly-row?key=E')
    const popover = await openTranspose(user)
    expect(popover).toHaveTextContent('E major')
    expect(popover).toHaveTextContent('+4')
    await user.click(within(popover).getByRole('button', { name: 'Reset' }))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('key'))
    expect(popover).toHaveTextContent('C major')
    expect(popover).toHaveTextContent('The song’s key')
    expect(within(popover).getByRole('button', { name: 'Reset' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Transpose: C major' })).toBeInTheDocument()
  })

  it('says beside its heading where the recording falls silent, and nowhere in the song’s key', async () => {
    const user = userEvent.setup()
    await renderApp('/play/romashki?key=E')
    const popover = await openTranspose(user)
    expect(popover).toHaveTextContent('E minor')
    await user.click(within(popover).getByRole('button', { name: 'About Transpose' }))
    const about = await screen.findAllByRole('dialog', { name: 'Transpose' })
    expect(about.at(-1)).toHaveTextContent('The recording plays only in D minor, its own key.')
    await user.keyboard('{Escape}')
    await user.click(within(popover).getByRole('button', { name: 'Reset' }))
    expect(within(popover).queryByRole('button', { name: 'About Transpose' })).toBeNull()
  })

  it('keeps the key out of the Setup', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    const setup = await screen.findByRole('dialog', { name: 'Setup' })
    expect(within(setup).queryByRole('group', { name: 'Key' })).toBeNull()
    expect(within(setup).getByRole('region', { name: 'How it plays' })).toBeInTheDocument()
  })

  it('reads in Russian: its name the key’s, its heading the verb’s', async () => {
    const user = userEvent.setup()
    await renderApp('/play/romashki?key=E', { locale: 'ru' })
    const tool = await screen.findByRole('button', { name: 'Тональность: E минор, +2' })
    expect(tool).toHaveTextContent('ТональностьEm')
    await user.click(tool)
    const popover = (await screen.findAllByRole('dialog', { name: 'Транспонировать' }))[0]
    expect(popover).toHaveTextContent('+2 полутона')
    expect(untranslated(document.body)).toEqual([])
  })
})
