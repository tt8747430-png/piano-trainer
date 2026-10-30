import { act, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { localDay } from '@/entities/progress'
import { createFakeAuth } from '@/shared/api/auth'

async function signedIn() {
  const auth = createFakeAuth({
    accounts: [{ email: 'ana@example.com', name: 'ana', password: 'correct horse' }],
  })
  await auth.signIn('ana@example.com', 'correct horse')
  return auth
}

describe('the Profile', () => {
  it('offers a guest Sign in, under the title Profile', async () => {
    await renderApp('/profile')
    await screen.findByRole('heading', { level: 1, name: 'Profile' })
    const guest = await screen.findByRole('region', { name: 'Playing without an account' })
    expect(within(guest).getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/account/sign-in',
    )
    expect(screen.queryByRole('link', { name: 'Account' })).toBeNull()
  })

  it('is titled with the learner’s name, their picture their initial', async () => {
    await renderApp('/profile', { auth: await signedIn() })
    await screen.findByRole('heading', { level: 1, name: 'ana' })
    const learner = await screen.findByRole('region', { name: 'ana' })
    expect(learner).toHaveTextContent(/A\s*ana@example.com/)
  })

  it('opens Settings one way, from its bar (the Account is Settings’ first row)', async () => {
    await renderApp('/profile', { auth: await signedIn() })
    await screen.findByRole('heading', { level: 1, name: 'ana' })
    const main = screen.getByRole('main')
    const settings = within(main).getAllByRole('link', { name: 'Settings' })
    expect(settings).toHaveLength(1)
    expect(settings[0]).toHaveAttribute('href', '/settings')
    expect(within(main).queryByRole('link', { name: 'Account' })).not.toBeInTheDocument()
  })

  it('counts the days in a row, the days practised and the songs played, then the rest of the record', async () => {
    const { progressStore } = await renderApp('/profile')
    const today = new Date()
    const yesterday = localDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1))
    act(() =>
      progressStore.setState({
        days: ['2026-01-02', yesterday, localDay(today)],
        practised: { bz5: '2026-10-02T10:00:00Z' },
      }),
    )
    const figure = (name: string) => screen.getAllByText(name)[0]!.parentElement
    await waitFor(() => expect(figure('Days in a row')).toHaveTextContent('2'))
    expect(figure('Days practised')).toHaveTextContent('3')
    expect(figure('Songs played')).toHaveTextContent('1')
    const record = screen.getByRole('region', { name: 'Your record' })
    expect(within(record).getByText('Best run of days').parentElement).toHaveTextContent('2')
    expect(within(record).queryByText('Days practised')).toBeNull()
  })

  it('shows the month’s Activity and nothing of what was practised last', async () => {
    await renderApp('/profile')
    expect(await screen.findByRole('region', { name: 'Activity' })).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Recently practised' })).toBeNull()
    expect(screen.queryByRole('list', { name: 'The last seven days' })).toBeNull()
  })

  it('says where a new learner’s record starts, with the way to start it', async () => {
    await renderApp('/profile')
    expect(
      await screen.findByText(
        'Nothing here yet. Finish a lesson or play a song, and your record starts.',
      ),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'Start learning' })).toHaveAttribute('href', '/')
  })

  it('is a tab of the main navigation', async () => {
    await renderApp('/')
    const nav = await screen.findByRole('navigation', { name: 'Main navigation' })
    expect(within(nav).getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/profile')
  })

  it('reads in Russian', async () => {
    await renderApp('/profile', { locale: 'ru' })
    await screen.findByRole('heading', { level: 1, name: 'Профиль' })
    expect(untranslated(document.body)).toEqual([])
  })
})
