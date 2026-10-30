import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { createFakeAuth } from '@/shared/api/auth'

const ANA = { email: 'ana@example.com', name: 'Ana', password: 'correct horse' }

async function signedIn(now?: () => number) {
  const auth = createFakeAuth({ accounts: [ANA], ...(now && { now }) })
  await auth.signIn(ANA.email, ANA.password)
  return auth
}

describe('Settings, signed in', () => {
  it('shows the learner on the account card, leading to their account', async () => {
    await renderApp('/settings', { auth: await signedIn() })
    const card = await screen.findByRole('navigation', { name: 'Account' })
    await waitFor(() => expect(within(card).getByRole('link')).toHaveTextContent(/Ana/))
    expect(within(card).getByRole('link')).toHaveTextContent(/ana@example.com · Up to date/)
    expect(within(card).getByRole('link')).toHaveAttribute('href', '/settings/account')
  })

  it('syncs now from Sync and data, saying where the sync stands', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/data', { auth: await signedIn() })
    const sync = await screen.findByRole('region', { name: 'Sync' })
    await user.click(await within(sync).findByRole('button', { name: 'Sync now' }))
    expect(await within(sync).findByText(/Last synced/)).toBeVisible()
    expect(within(sync).getByText('Up to date')).toBeVisible()
  })
})

describe('Settings › Account', () => {
  it('shows the learner’s email and Change password under Sign-in', async () => {
    await renderApp('/settings/account', { auth: await signedIn() })
    const signIn = await screen.findByRole('region', { name: 'Sign-in' })
    expect(signIn).toHaveTextContent(/Email\s*ana@example.com/)
    expect(within(signIn).getByRole('link', { name: 'Change password' })).toHaveAttribute(
      'href',
      '/account/new-password',
    )
  })

  it('renames the learner, Save showing only once the name is changed', async () => {
    const user = userEvent.setup()
    const auth = await signedIn()
    await renderApp('/settings/account', { auth })
    const name = await screen.findByLabelText('Your name')
    await waitFor(() => expect(name).toHaveValue('Ana'))
    expect(screen.queryByRole('button', { name: 'Save' })).toBeNull()
    await user.clear(name)
    await user.type(name, 'Anna')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(await screen.findByText('Saved')).toBeVisible()
    expect(await auth.current()).toMatchObject({ name: 'Anna' })
    expect(screen.queryByRole('button', { name: 'Save' })).toBeNull()
  })

  it('signs out once asked, saying what stays, and goes back to Settings', async () => {
    const user = userEvent.setup()
    const auth = await signedIn()
    const { router } = await renderApp('/settings/account', { auth })
    await user.click(await screen.findByRole('button', { name: 'Sign out' }))
    const dialog = await screen.findByRole('alertdialog', { name: 'Sign out?' })
    expect(dialog).toHaveTextContent('Your songs and progress stay on this device.')
    await user.click(within(dialog).getByRole('button', { name: 'Sign out' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings'))
    expect(await auth.current()).toBeNull()
  })

  it('deletes the account only once the learner types their email, after 30 days', async () => {
    const user = userEvent.setup()
    const auth = await signedIn(() => Date.parse('2026-10-29T10:00:00Z'))
    await renderApp('/settings/account', { auth })
    await user.click(await screen.findByRole('button', { name: 'Delete account…' }))
    const dialog = await screen.findByRole('alertdialog', { name: 'Delete your account?' })
    expect(dialog).toHaveTextContent('deleted in 30 days')
    const confirm = within(dialog).getByRole('button', { name: 'Delete' })
    expect(confirm).toBeDisabled()
    await user.type(within(dialog).getByLabelText('Your email'), 'ANA@example.com')
    await user.click(confirm)
    expect(
      await screen.findByText(
        'Your account will be deleted on November 28, 2026. Sign in before then to keep it.',
      ),
    ).toBeVisible()
    expect(await auth.current()).toBeNull()
  })

  it('offers a guest Sign in and Create an account', async () => {
    await renderApp('/settings/account')
    expect(await screen.findByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/account/sign-in',
    )
    expect(screen.getByRole('link', { name: 'Create an account' })).toHaveAttribute(
      'href',
      '/account/create',
    )
  })

  it('on signing in to an account to be deleted, keeps it or signs out', async () => {
    const user = userEvent.setup()
    const auth = await signedIn(() => Date.parse('2026-10-29T10:00:00Z'))
    await auth.requestDeletion()
    await auth.signIn(ANA.email, ANA.password)
    await renderApp('/settings', { auth })
    const gate = await screen.findByRole('alertdialog', { name: 'Your account is to be deleted' })
    expect(gate).toHaveTextContent('It will be deleted on November 28, 2026.')
    await user.click(within(gate).getByRole('button', { name: 'Keep my account' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
    expect(await auth.pendingDeletion()).toEqual({ ok: true, value: null })
  })

  it('reads in Russian', async () => {
    await renderApp('/settings/account', { auth: await signedIn(), locale: 'ru' })
    await screen.findByRole('button', { name: 'Удалить аккаунт…' })
    expect(untranslated(document.body)).toEqual([])
  })
})
