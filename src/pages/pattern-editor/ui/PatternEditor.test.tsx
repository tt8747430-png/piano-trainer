import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { PatternRef } from '@/entities/pattern'

/** Save, the phone's under the hands (a laptop's stands under the name; jsdom renders both). */
const save = () => screen.getAllByRole('button', { name: 'Save' }).at(-1) ?? document.body

describe('The pattern editor', () => {
  it('makes a pattern from another, saves it under the learner’s name and opens its page', async () => {
    const user = userEvent.setup()
    const { router, patternsStore } = await renderApp('/practice/accompaniment/patterns/M1')
    await user.click(await screen.findByRole('button', { name: 'More' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Make your own from it' }))
    const name = await screen.findByRole('textbox', { name: 'Name' })
    expect(name).toHaveValue('1 · Bass + chords (mine)')
    await user.click(screen.getByRole('radio', { name: 'Charleston' }))
    await user.clear(name)
    await user.type(name, 'Sunday')
    await user.click(save())
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/practice/accompaniment/patterns/my-1'),
    )
    expect(await screen.findByRole('heading', { level: 2, name: 'Sunday' })).toBeInTheDocument()
    expect(patternsStore.getState().own).toEqual([
      { id: 'my-1', name: 'Sunday', rh: 'jaz', lh: 'o' },
    ])
    // The editor gave way to the page: Back returns to the pattern it was made from.
    router.history.back()
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/practice/accompaniment/patterns/M1'),
    )
    // A long walk through the editor, its sample's staff of buttons queried at each step.
  }, 15_000)

  it('makes one the Player’s picker offers, which plays its own figures', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/practice/accompaniment/patterns/new?from=M1')
    await user.click(await screen.findByRole('radio', { name: 'Charleston' }))
    await user.click(save())
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/practice/accompaniment/patterns/my-1'),
    )
    const playWith = async (pattern: PatternRef) => {
      await router.navigate({ to: '/play/progression', search: { p: 'ii-V-I', pattern } })
      // The Player opens on its Setup, Play under it; the same Player again keeps it shut.
      const setup = () => screen.queryByRole('dialog', { name: 'Setup' })
      await waitFor(() =>
        expect(setup() ?? screen.queryByRole('button', { name: 'Play' })).not.toBeNull(),
      )
      if (setup()) await user.keyboard('{Escape}')
      await user.click(await screen.findByRole('button', { name: 'Play' }))
      await user.click(screen.getByRole('button', { name: 'Stop' }))
      return audio.played.at(-1)?.sounds
    }
    const builtIn = await playWith('M1')
    await user.click(screen.getByRole('button', { name: 'Player settings' }))
    await user.click(await screen.findByRole('button', { name: /^Pattern/ }))
    // Its Pattern page lists the learner's own beside the books'.
    await user.type(await screen.findByRole('searchbox', { name: 'Search patterns' }), '(mine)')
    await user.click(await screen.findByRole('button', { name: /^1 · Bass \+ chords \(mine\)/ }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ pattern: 'my-1' }))
    await user.keyboard('{Escape}')
    expect(await playWith('my-1')).not.toEqual(builtIn)
  })

  it('saves nothing without a name', async () => {
    const user = userEvent.setup()
    const { patternsStore } = await renderApp('/practice/accompaniment/patterns/new')
    await screen.findByRole('textbox', { name: 'Name' })
    for (const each of screen.getAllByRole('button', { name: 'Save' })) expect(each).toBeDisabled()
    await user.type(screen.getByRole('textbox', { name: 'Name' }), '   ')
    for (const each of screen.getAllByRole('button', { name: 'Save' })) expect(each).toBeDisabled()
    expect(patternsStore.getState().own).toEqual([])
  })

  it('starts from a long-named pattern with a name that fits, so it saves', async () => {
    await renderApp('/practice/accompaniment/patterns/new?from=M3')
    const name = await screen.findByRole('textbox', { name: 'Name' })
    // 40 characters at most: the name the source has, cut at a word.
    expect(name).toHaveValue('3 · Arpeggio (3rd, then 5th +… (mine)')
    expect(save()).toBeEnabled()
  })

  it('draws the draft as it changes, its roll named by its two figures', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/accompaniment/patterns/new?from=M1')
    expect(
      await screen.findByRole('img', {
        name: 'Chord on every beat in the right hand, Octave, whole note in the left',
      }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Charleston' }))
    expect(
      screen.getByRole('img', {
        name: 'Charleston in the right hand, Octave, whole note in the left',
      }),
    ).toBeInTheDocument()
  })

  it('changes the learner’s pattern in its place, and is not found for a built-in', async () => {
    const user = userEvent.setup()
    const { router, patternsStore } = await renderApp('/practice/accompaniment/patterns/new')
    await user.type(await screen.findByRole('textbox', { name: 'Name' }), 'Monday')
    await user.click(save())
    await user.click(await screen.findByRole('button', { name: 'More' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Edit' }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Edit pattern' }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: /^Root, then 5th/ }))
    await user.click(save())
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/practice/accompaniment/patterns/my-1'),
    )
    expect(patternsStore.getState().own).toEqual([
      { id: 'my-1', name: 'Monday', rh: 'x1', lh: 'bal' },
    ])
    await router.navigate({
      to: '/practice/accompaniment/patterns/$patternRef/edit',
      params: { patternRef: 'M1' },
    })
    expect(await screen.findByRole('heading', { level: 1, name: /not found/i })).toBeInTheDocument()
  })

  it('keeps its changes when another tab deletes the pattern, saving them as a new one', async () => {
    const user = userEvent.setup()
    const { router, patternsStore } = await renderApp('/practice/accompaniment/patterns/new')
    await user.type(await screen.findByRole('textbox', { name: 'Name' }), 'Monday')
    await user.click(save())
    await user.click(await screen.findByRole('button', { name: 'More' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Edit' }))
    await screen.findByRole('heading', { level: 1, name: 'Edit pattern' })
    act(() => patternsStore.setState({ own: [] }))
    await user.click(save())
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/practice/accompaniment/patterns/my-2'),
    )
    expect(patternsStore.getState().own.map((pattern) => pattern.name)).toEqual(['Monday'])
  })

  it('cancels back where it was opened from', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/accompaniment')
    await user.click(await screen.findByRole('button', { name: 'New' }))
    await user.click(await screen.findByRole('button', { name: 'New pattern' }))
    const form = (await screen.findByRole('textbox', { name: 'Name' })).closest('form')
    if (!form) throw new Error('the editor is a form')
    // The phone's Cancel, under the hands (a laptop's stands under the name).
    await user.click(within(form).getAllByRole('button', { name: 'Cancel' }).at(-1) ?? form)
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice/accompaniment'))
  })
})
