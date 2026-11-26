import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { localDay } from '@/entities/progress'
import { createFakeAuth } from '@/shared/api/auth'
import { createFakeProfile, type ProfilePort } from '@/shared/api/profile'

async function signedIn() {
  const auth = createFakeAuth({
    accounts: [{ email: 'ana@example.com', name: 'ana', password: 'correct horse' }],
  })
  await auth.signIn('ana@example.com', 'correct horse')
  return auth
}

const ANA = createFakeProfile({
  initial: { name: 'Ana Petrova', handle: 'ana_plays', joined: '2026-03-14T10:00:00.000Z' },
})

describe('the Profile', () => {
  it('shows @handle · Joined', async () => {
    await renderApp('/profile', { auth: await signedIn(), profile: ANA })
    const learner = await screen.findByRole('region', { name: 'Ana Petrova' })
    expect(await within(learner).findByText('@ana_plays · Joined 2026')).toBeVisible()
    expect(within(learner).getByRole('link', { name: 'Edit profile photo' })).toHaveAttribute(
      'href',
      '/settings/account/profile',
    )
  })

  it('shows a skeleton while loading', async () => {
    const waiting: ProfilePort = { ...createFakeProfile(), read: () => new Promise(() => {}) }
    await renderApp('/profile', { auth: await signedIn(), profile: waiting })
    expect(await screen.findByRole('status')).toHaveTextContent('Loading your profile…')
  })

  it('a guest sees Exploring as a guest and Sign in', async () => {
    await renderApp('/profile')
    await screen.findByRole('heading', { level: 1, name: 'Profile' })
    const guest = await screen.findByRole('region', { name: 'Exploring as a guest' })
    expect(within(guest).getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/account/sign-in',
    )
    // The device's figures still show, under it.
    expect(screen.getByRole('list', { name: 'Your practice' })).toHaveTextContent(
      /0\s*Day streak.*0\s*Songs learned.*0 min\s*Practice time/,
    )
  })

  it('the streak tile opens Streak', async () => {
    const user = userEvent.setup()
    const { router, progressStore } = await renderApp('/profile')
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    act(() => progressStore.setState({ days: [localDay(yesterday), localDay(today)] }))
    await user.click(await screen.findByRole('link', { name: /2\s*Day streak/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/profile/streak'))
    expect(await screen.findByText('2 day streak')).toBeVisible()
    // Today counted, the days to the streak badge's next tier said.
    expect(screen.getByText('Today counts. 1 more day to the Bronze badge.')).toBeVisible()
  })

  it('See all opens Badges', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/profile')
    const badges = await screen.findByRole('region', { name: 'Badges' })
    // The first three, then See all.
    expect(within(badges).getAllByRole('link')).toHaveLength(4)
    await user.click(within(badges).getByRole('link', { name: 'See all' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/profile/badges'))
    expect(await screen.findByRole('link', { name: /Scale Master/ })).toBeVisible()
  })

  it("says a locked badge's distance to its next tier over its meter, once", async () => {
    await renderApp('/profile')
    const badges = await screen.findByRole('region', { name: 'Badges' })
    const streak = within(badges).getByRole('link', { name: /Streak Keeper/ })
    expect(streak).toHaveTextContent('3 more days to Bronze')
    expect(streak.textContent?.match(/3 more days/g)).toHaveLength(1)
  })

  it('opens the bell with its unread count', async () => {
    const { notificationsStore } = await renderApp('/profile')
    act(() =>
      notificationsStore.setState({
        notices: [
          { id: 'level:1', kind: 'level', ref: '1', at: new Date().toISOString(), read: false },
        ],
      }),
    )
    expect(await screen.findByRole('link', { name: 'Notifications, 1 unread' })).toHaveAttribute(
      'href',
      '/profile/notifications',
    )
  })

  it('reads in Russian', async () => {
    await renderApp('/profile', { locale: 'ru', auth: await signedIn(), profile: ANA })
    await screen.findByText('@ana_plays · С нами с 2026')
    expect(untranslated(document.body)).toEqual([])
  })
})
