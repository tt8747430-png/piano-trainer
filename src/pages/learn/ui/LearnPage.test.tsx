import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Learn', () => {
  it('lists the lessons with their level and category, and the references', async () => {
    await renderApp('/learn')
    const lessons = await screen.findByRole('region', { name: 'Lessons' })
    expect(
      within(lessons).getByRole('link', { name: 'How to read chord symbols Beginner · Chords' }),
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
