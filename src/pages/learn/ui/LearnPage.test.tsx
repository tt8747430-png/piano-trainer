import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Learn', () => {
  it('lists the lessons under their module, with their level and category, and the references', async () => {
    await renderApp('/learn')
    const fundamentals = await screen.findByRole('region', { name: 'Fundamentals' })
    expect(
      within(fundamentals).getByRole('link', {
        name: 'How to read chord symbols Beginner · Chords',
      }),
    ).toHaveAttribute('href', '/learn/lessons/reading-chord-symbols')
    const references = screen.getByRole('region', { name: 'References' })
    expect(within(references).getByRole('link', { name: 'Chords' })).toHaveAttribute(
      'href',
      '/learn/chords',
    )
    expect(within(references).getByRole('link', { name: 'Scales' })).toHaveAttribute(
      'href',
      '/learn/scales',
    )
    expect(within(references).getByRole('link', { name: 'Keys' })).toHaveAttribute(
      'href',
      '/learn/keys',
    )
    expect(within(references).getByRole('link', { name: 'Intervals' })).toHaveAttribute(
      'href',
      '/learn/intervals',
    )
    expect(within(references).getByRole('link', { name: 'Available tensions' })).toHaveAttribute(
      'href',
      '/learn/tensions',
    )
    const tools = screen.getByRole('region', { name: 'Tools' })
    expect(within(tools).getByRole('link', { name: 'Chord finder' })).toHaveAttribute(
      'href',
      '/learn/chord-finder',
    )
  })

  it('filters the lessons by level and category, kept in the URL, and says when none match', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn')
    await user.click(await screen.findByRole('combobox', { name: 'Category' }))
    await user.click(await screen.findByRole('option', { name: 'Chords' }))
    expect(router.state.location.search).toEqual({ category: 'chords' })
    expect(screen.getByRole('link', { name: /How to read chord symbols/ })).toBeInTheDocument()
    await router.navigate({ to: '/learn', search: { level: 4, category: 'chords' } })
    expect(await screen.findByText('No lessons match.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show every lesson' }))
    expect(router.state.location.search).toEqual({})
  })

  it('opens a reference and comes back', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn')
    await user.click(await screen.findByRole('link', { name: 'Scales' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Scales' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/learn'))
    expect(await screen.findByRole('heading', { level: 1, name: 'Learn' })).toBeInTheDocument()
  })

  it('speaks Russian', async () => {
    await renderApp('/learn', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Обучение' })).toBeInTheDocument()
  })
})
