import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('The pattern editor', () => {
  it('makes a pattern from another, saves it under the learner’s name and opens its page', async () => {
    const user = userEvent.setup()
    const { router, patternsStore } = await renderApp('/learn/patterns/M1')
    await user.click(await screen.findByRole('link', { name: 'Make your own from it' }))
    const name = await screen.findByRole('textbox', { name: 'Name' })
    expect(name).toHaveValue('1 · Bass + chords (mine)')
    await user.click(screen.getByRole('combobox', { name: 'Right hand' }))
    await user.click(await screen.findByRole('option', { name: 'Charleston' }))
    await user.clear(name)
    await user.type(name, 'Sunday')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/learn/patterns/my-1'))
    expect(await screen.findByRole('heading', { level: 1, name: 'Sunday' })).toBeInTheDocument()
    expect(patternsStore.getState().own).toEqual([
      { id: 'my-1', name: 'Sunday', rh: 'jaz', lh: 'o' },
    ])
    // The editor gave way to the page: Back returns to the pattern it was made from.
    router.history.back()
    await waitFor(() => expect(router.state.location.pathname).toBe('/learn/patterns/M1'))
  })

  it('saves nothing without a name', async () => {
    const user = userEvent.setup()
    const { patternsStore } = await renderApp('/learn/patterns/new')
    const save = await screen.findByRole('button', { name: 'Save' })
    expect(save).toBeDisabled()
    await user.type(screen.getByRole('textbox', { name: 'Name' }), '   ')
    expect(save).toBeDisabled()
    expect(patternsStore.getState().own).toEqual([])
  })

  it('plays the draft as it changes', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/learn/patterns/new')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
  })

  it('changes the learner’s pattern in its place, and is not found for a built-in', async () => {
    const user = userEvent.setup()
    const { router, patternsStore } = await renderApp('/learn/patterns/new')
    await user.type(await screen.findByRole('textbox', { name: 'Name' }), 'Monday')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    await user.click(await screen.findByRole('link', { name: 'Edit' }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Edit pattern' }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('combobox', { name: 'Left hand' }))
    await user.click(await screen.findByRole('option', { name: /^Root, then 5th/ }))
    await user.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/learn/patterns/my-1'))
    expect(patternsStore.getState().own).toEqual([
      { id: 'my-1', name: 'Monday', rh: 'x1', lh: 'bal' },
    ])
    await router.navigate({ to: '/learn/patterns/$patternRef/edit', params: { patternRef: 'M1' } })
    expect(await screen.findByRole('heading', { level: 1, name: /not found/i })).toBeInTheDocument()
  })

  it('cancels back where it was opened from', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/patterns')
    await user.click(await screen.findByRole('link', { name: 'New pattern' }))
    const form = (await screen.findByRole('textbox', { name: 'Name' })).closest('form')
    if (!form) throw new Error('the editor is a form')
    await user.click(within(form).getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/learn/patterns'))
  })
})
