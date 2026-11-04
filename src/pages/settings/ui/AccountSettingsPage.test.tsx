import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { createFakeAuth } from '@/shared/api/auth'
import { expectLastAndAlone } from '@/shared/test/danger'

const ANA = { email: 'ana@example.com', name: 'Ana', password: 'correct horse' }

async function signedIn(now?: () => number) {
  const auth = createFakeAuth({ accounts: [ANA], ...(now && { now }) })
  await auth.signIn(ANA.email, ANA.password)
  return auth
}

describe('Settings, signed in', () => {
  it('shows the learner on the account card, with where the sync stands, leading to their account', async () => {
    await renderApp('/settings', { auth: await signedIn() })
    const card = await screen.findByRole('navigation', { name: 'Account' })
    const learner = () => within(card).getByRole('link')
    await waitFor(() => expect(learner()).toHaveTextContent(/Ana\s*ana@example.com\s*Synced/))
    expect(learner()).toHaveAttribute('href', '/settings/account')
    // Sync now has one home, the Account (A15).
    expect(screen.queryByRole('button', { name: 'Sync now' })).toBeNull()
  })

  it('syncs now from the Account, saying where the sync stands', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/account', { auth: await signedIn() })
    const sync = await screen.findByRole('region', { name: 'Sync' })
    await user.click(await within(sync).findByRole('button', { name: 'Sync now' }))
    expect(await within(sync).findByText(/Last synced/)).toBeVisible()
    expect(within(sync).getByText('Up to date')).toBeVisible()
  })
})

describe('Settings › Account', () => {
  it('opens Edit profile from its first row, and Change password and Privacy from theirs', async () => {
    await renderApp('/settings/account', { auth: await signedIn() })
    expect(await screen.findByRole('link', { name: /Edit profile/ })).toHaveAttribute(
      'href',
      '/settings/account/profile',
    )
    const password = screen.getByRole('link', { name: 'Change password' })
    expect(password.closest('section')).toHaveTextContent(/Email\s*ana@example.com/)
    expect(password).toHaveAttribute('href', '/settings/account/password')
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      '/settings/privacy',
    )
  })

  it('puts Sign out and Delete account last, each red and alone with its footnote (R25)', async () => {
    await renderApp('/settings/account', { auth: await signedIn() })
    const signOut = await screen.findByRole('button', { name: 'Sign out' })
    const remove = screen.getByRole('button', { name: 'Delete account…' })
    expectLastAndAlone(signOut)
    expectLastAndAlone(remove)
    expect(signOut.closest('section')).not.toBe(remove.closest('section'))
    expect(remove.closest('section')).toHaveTextContent(
      'Your account and synced data are deleted after 30 days.',
    )
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
    await user.type(within(dialog).getByLabelText('Type “DELETE” to confirm'), 'DELETE')
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
