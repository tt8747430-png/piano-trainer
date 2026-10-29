import { act, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { createFakeAuth } from '@/shared/api/auth'

describe('the Profile', () => {
  it('offers a guest Sign in', async () => {
    await renderApp('/profile')
    const guest = await screen.findByRole('region', { name: 'Playing without an account' })
    expect(within(guest).getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/account/sign-in',
    )
  })

  it('shows the learner signed in, by their initial and name', async () => {
    const auth = createFakeAuth({
      accounts: [{ email: 'ana@example.com', name: 'ana', password: 'correct horse' }],
    })
    await auth.signIn('ana@example.com', 'correct horse')
    await renderApp('/profile', { auth })
    const learner = await screen.findByRole('region', { name: 'ana' })
    expect(learner).toHaveTextContent(/A\s*ana\s*ana@example.com/)
  })

  it('counts the learner’s record from their progress', async () => {
    const { progressStore } = await renderApp('/profile')
    act(() =>
      progressStore.setState({
        days: ['2026-10-01', '2026-10-02'],
        practised: { bz5: '2026-10-02T10:00:00Z' },
      }),
    )
    const record = await screen.findByRole('region', { name: 'Your record' })
    await waitFor(() => expect(within(record).getByText('Days practised')).toBeVisible())
    const figure = (name: string) => within(record).getByText(name).parentElement
    expect(figure('Days practised')).toHaveTextContent('2')
    expect(figure('Best run of days')).toHaveTextContent('2')
    expect(figure('Songs played')).toHaveTextContent('1')
    expect(screen.getByRole('heading', { name: 'Recently practised' })).toBeVisible()
  })

  it('is reached from Learn', async () => {
    await renderApp('/')
    expect(
      within(await screen.findByRole('main')).getByRole('link', { name: 'Profile' }),
    ).toHaveAttribute('href', '/profile')
  })

  it('reads in Russian', async () => {
    await renderApp('/profile', { locale: 'ru' })
    await screen.findByRole('heading', { level: 1, name: 'Профиль' })
    expect(untranslated(document.body)).toEqual([])
  })
})
