import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { noticeOf } from '@/entities/notification'
import { localDay } from '@/entities/progress'

const today = () => localDay(new Date())

describe('Streak', () => {
  it('says how to start a streak, and browses the months before', async () => {
    const user = userEvent.setup()
    await renderApp('/profile/streak')
    expect(await screen.findByText('Practise today to start a streak.')).toBeVisible()
    const month = screen.getByRole('region', { name: 'This month' })
    const now = within(month).getByText(/\d{4}/).textContent
    expect(within(month).getByRole('button', { name: 'Next month' })).toBeDisabled()
    await user.click(within(month).getByRole('button', { name: 'Previous month' }))
    expect(within(month).getByText(/\d{4}/).textContent).not.toBe(now)
    expect(screen.getByText('Longest streak')).toBeVisible()
    expect(screen.getByText('Days this month')).toBeVisible()
  })

  it('reads in Russian', async () => {
    await renderApp('/profile/streak', { locale: 'ru' })
    await screen.findByText('Позанимайтесь сегодня, чтобы начать серию.')
    expect(untranslated(document.body)).toEqual([])
  })
})

describe('a badge', () => {
  it('shows its tiers: the day each was reached, how many to go, the rest locked', async () => {
    const { progressStore } = await renderApp('/profile/badges/repertoire')
    act(() =>
      progressStore.setState({
        learned: { 'piece:bz5': '2026-11-01', 'piece:ode': '2026-11-02' },
        earned: { 'repertoire:1': '2026-11-03' },
      }),
    )
    await screen.findByRole('heading', { level: 1, name: 'Repertoire' })
    expect(screen.getByText(/Tier 1 of 4/)).toBeVisible()
    expect(screen.getByText('Mark a song Learned on its page in Songs.')).toBeVisible()
    const rows = within(screen.getByRole('region', { name: /Tiers/ })).getAllByRole('listitem')
    expect(rows[0]).toHaveTextContent(/Bronze.*1 song learned.*Reached Nov 3, 2026/)
    expect(rows[1]).toHaveTextContent(/Silver.*5 songs learned.*3 to go/)
    expect(rows[2]).toHaveTextContent('Locked')
    expect(screen.getByText('You: 2')).toBeVisible()
  })

  it('is not found for a badge there is not', async () => {
    await renderApp('/profile/badges/juggling')
    const main = await screen.findByRole('main')
    expect(await within(main).findByRole('link', { name: /Learn/ })).toBeVisible()
  })
})

describe('Achievements', () => {
  it('shows the personal records and the milestones, earned first', async () => {
    const { progressStore } = await renderApp('/profile/achievements')
    act(() =>
      progressStore.setState({
        seconds: { [today()]: 2 * 3600 + 15 * 60 },
        earned: { 'first-lesson': '2026-11-02' },
      }),
    )
    const records = await screen.findByRole('region', { name: 'Personal records' })
    expect(records).toHaveTextContent('Level 3')
    expect(records).toHaveTextContent('2 h 15 min')
    const milestones = screen.getByRole('region', { name: 'Milestones' })
    const rows = within(milestones).getAllByRole('link')
    expect(rows[0]).toHaveTextContent(/First lesson done.*Earned/)
    expect(rows[1]).toHaveTextContent('Not earned yet')
  })

  it('opens a milestone: not earned yet, and how to earn it', async () => {
    await renderApp('/profile/achievements/first-recording')
    await screen.findByRole('heading', { level: 1, name: 'First recording' })
    expect(screen.getByText('Not earned yet')).toBeVisible()
    expect(screen.getByText('Record a take in the Player.')).toBeVisible()
  })
})

describe('Notifications', () => {
  const NOW = new Date().toISOString()

  it('says none yet, with nothing to clear', async () => {
    await renderApp('/profile/notifications')
    expect(await screen.findByText('No notifications yet')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'More' })).toBeNull()
  })

  it('Mark all read', async () => {
    const user = userEvent.setup()
    const { notificationsStore } = await renderApp('/profile/notifications')
    act(() =>
      notificationsStore.setState({
        notices: [noticeOf('level', '4', NOW), noticeOf('tier', 'repertoire:2', NOW)],
      }),
    )
    const todays = await screen.findByRole('region', { name: 'Today' })
    expect(todays).toHaveTextContent('Level 4 reached')
    expect(todays).toHaveTextContent('Silver Repertoire')
    // Opening the page marks nothing.
    expect(notificationsStore.getState().notices.every((notice) => !notice.read)).toBe(true)
    await user.click(screen.getByRole('button', { name: 'More' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Mark all read' }))
    expect(notificationsStore.getState().notices.every((notice) => notice.read)).toBe(true)
  })

  it('Clear all asks first', async () => {
    const user = userEvent.setup()
    const { notificationsStore } = await renderApp('/profile/notifications')
    act(() => notificationsStore.setState({ notices: [noticeOf('streak', '12', NOW)] }))
    expect(await screen.findByText('New longest streak: 12 days')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'More' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Clear all' }))
    const asked = await screen.findByRole('alertdialog', { name: 'Clear all notifications?' })
    expect(notificationsStore.getState().notices).toHaveLength(1)
    await user.click(within(asked).getByRole('button', { name: 'Clear' }))
    await waitFor(() => expect(notificationsStore.getState().notices).toEqual([]))
  })

  it('opening one marks it read and goes to its badge; × removes one', async () => {
    const user = userEvent.setup()
    const { notificationsStore, router } = await renderApp('/profile/notifications')
    act(() =>
      notificationsStore.setState({
        notices: [noticeOf('tier', 'repertoire:2', NOW), noticeOf('accuracy', '96', NOW)],
      }),
    )
    const removes = await screen.findAllByRole('button', { name: 'Remove' })
    await user.click(removes[1]!)
    expect(notificationsStore.getState().notices.map((notice) => notice.id)).toEqual([
      'tier:repertoire:2',
    ])
    await user.click(screen.getByRole('button', { name: /Silver Repertoire/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/profile/badges/repertoire'))
    expect(notificationsStore.getState().notices[0]?.read).toBe(true)
  })
})
