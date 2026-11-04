import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { createFakeAuth } from '@/shared/api/auth'
import { createFakeProfile } from '@/shared/api/profile'

const ANA = { email: 'ana@example.com', name: 'Ana', password: 'correct horse' }

async function signedIn() {
  const auth = createFakeAuth({ accounts: [ANA] })
  await auth.signIn(ANA.email, ANA.password)
  return auth
}

afterEach(() => vi.restoreAllMocks())

describe('Edit profile', () => {
  it('saves a name, a free handle and a bio from the bar', async () => {
    const user = userEvent.setup()
    const profile = createFakeProfile({ initial: { name: 'Ana' } })
    const auth = await signedIn()
    await renderApp('/settings/account/profile', { auth, profile })
    const save = await screen.findByRole('button', { name: 'Save changes' })
    expect(save).toBeDisabled()
    await user.type(screen.getByLabelText('Username'), 'Ana_Plays')
    expect(screen.getByLabelText('Username')).toHaveValue('ana_plays')
    expect(await screen.findByText('Available')).toBeVisible()
    await user.type(screen.getByLabelText('Bio'), 'Waltzes, mostly.')
    expect(screen.getByText('16 of 160')).toBeVisible()
    await user.clear(screen.getByLabelText('Name'))
    await user.type(screen.getByLabelText('Name'), 'Ana P.')
    await user.click(save)
    await waitFor(async () =>
      expect(await profile.read()).toMatchObject({
        ok: true,
        value: { name: 'Ana P.', handle: 'ana_plays', bio: 'Waltzes, mostly.' },
      }),
    )
    // The account's name follows.
    expect(await auth.current()).toMatchObject({ name: 'Ana P.' })
  })

  it('a taken handle disables Save', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/account/profile', {
      auth: await signedIn(),
      profile: createFakeProfile({ taken: ['bob'] }),
    })
    await user.type(await screen.findByLabelText('Username'), 'bob')
    // Taken, once checked.
    expect(await screen.findByText('Taken')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled()
    await user.clear(screen.getByLabelText('Username'))
    await user.type(screen.getByLabelText('Username'), 'a!')
    expect(screen.getByText('Use 3–24 letters, digits or _')).toBeVisible()
  })

  it('offline reads only', async () => {
    const auth = await signedIn()
    const profile = createFakeProfile({ initial: { name: 'Ana' } })
    await renderApp('/settings/account/profile', { auth, profile })
    const name = await screen.findByLabelText('Name')
    expect(name).not.toHaveAttribute('readonly')
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })
    expect(await screen.findByText('Available when online')).toBeVisible()
    expect(name).toHaveAttribute('readonly')
    expect(screen.getByRole('button', { name: 'Change photo' })).toBeDisabled()
  })

  it('chooses a built-in picture from Change photo', async () => {
    const user = userEvent.setup()
    const profile = createFakeProfile()
    await renderApp('/settings/account/profile', { auth: await signedIn(), profile })
    await user.click(await screen.findByRole('button', { name: 'Change photo' }))
    const sheet = await screen.findByRole('dialog', { name: 'Change photo' })
    await user.click(within(sheet).getByRole('button', { name: 'Piano' }))
    await waitFor(async () =>
      expect(await profile.read()).toMatchObject({ ok: true, value: { avatar: 'piano' } }),
    )
  })

  it('reads in Russian', async () => {
    await renderApp('/settings/account/profile', {
      locale: 'ru',
      auth: await signedIn(),
      profile: createFakeProfile({ initial: { name: 'Ana' } }),
    })
    await screen.findByLabelText('Имя пользователя')
    expect(untranslated(document.body)).toEqual([])
  })
})

describe('Privacy', () => {
  it('shows the profile, or keeps it private, one switch', async () => {
    const user = userEvent.setup()
    const profile = createFakeProfile()
    await renderApp('/settings/privacy', { auth: await signedIn(), profile })
    const show = await screen.findByRole('switch', { name: /Show my profile/ })
    await waitFor(() => expect(show).toBeEnabled())
    expect(show).not.toBeChecked()
    await user.click(show)
    await waitFor(async () =>
      expect(await profile.read()).toMatchObject({ ok: true, value: { public: true } }),
    )
    expect(show).toBeChecked()
  })
})

describe('Change password', () => {
  it('checks the current one, and that the new ones match', async () => {
    const user = userEvent.setup()
    const auth = await signedIn()
    await renderApp('/settings/account/password', { auth })
    const submit = await screen.findByRole('button', { name: 'Update password' })
    await user.type(screen.getByLabelText('Current password'), 'wrong one')
    await user.type(screen.getByLabelText('New password'), 'a new phrase')
    await user.type(screen.getByLabelText('Confirm new password'), 'a new phrasx')
    expect(screen.getByText('The new passwords don’t match.')).toBeVisible()
    expect(submit).toBeDisabled()
    await user.type(screen.getByLabelText('Confirm new password'), '{Backspace}e')
    await user.click(submit)
    expect(await screen.findByText('The current password isn’t right.')).toBeVisible()
    await user.clear(screen.getByLabelText('Current password'))
    await user.type(screen.getByLabelText('Current password'), ANA.password)
    await user.click(submit)
    await waitFor(() => expect(screen.getByLabelText('Current password')).toHaveValue(''))
    expect((await auth.signIn(ANA.email, 'a new phrase')).ok).toBe(true)
  })
})
