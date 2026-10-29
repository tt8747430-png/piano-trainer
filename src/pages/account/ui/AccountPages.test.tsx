import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { createFakeAuth, type AuthGateway } from '@/shared/api/auth'

const ANA = { email: 'ana@example.com', name: 'Ana', password: 'correct horse' }

afterEach(() => vi.restoreAllMocks())

describe('Sign in', () => {
  it('signs in with an email and a password, then goes back where it was opened from', async () => {
    const user = userEvent.setup()
    const auth = createFakeAuth({ accounts: [ANA] })
    const { router } = await renderApp('/account/sign-in', { auth })
    await user.type(await screen.findByLabelText('Email'), ANA.email)
    await user.type(screen.getByLabelText('Password'), ANA.password)
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings'))
    expect(await auth.current()).toMatchObject({ email: ANA.email, name: 'Ana' })
  })

  it('says plainly when the email and password match no account', async () => {
    const user = userEvent.setup()
    await renderApp('/account/sign-in', { auth: createFakeAuth({ accounts: [ANA] }) })
    await user.type(await screen.findByLabelText('Email'), ANA.email)
    await user.type(screen.getByLabelText('Password'), 'wrong password')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'That email and password don’t match an account.',
    )
  })

  it('says what is wrong with a field before asking the server', async () => {
    const user = userEvent.setup()
    const auth = createFakeAuth()
    const signIn = vi.spyOn(auth, 'signIn')
    await renderApp('/account/sign-in', { auth })
    await user.type(await screen.findByLabelText('Email'), 'ana')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription(
      'Enter an email address, like name@example.com.',
    )
    expect(signIn).not.toHaveBeenCalled()
  })

  it('offers Google, and Apple as coming soon', async () => {
    const user = userEvent.setup()
    const auth = createFakeAuth()
    const signInWith = vi.spyOn(auth, 'signInWith')
    await renderApp('/account/sign-in', { auth })
    await user.click(await screen.findByRole('button', { name: 'Continue with Google' }))
    expect(signInWith).toHaveBeenCalledWith('google')
    expect(screen.getByRole('button', { name: /Continue with Apple/ })).toBeDisabled()
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
  })

  it('waits for a connection, saying so, with nothing to press', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    await renderApp('/account/sign-in')
    expect(await screen.findByText('You’re offline. Signing in needs a connection.')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeDisabled()
  })

  it('leads on to a new account and to a forgotten password', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/account/sign-in')
    await user.click(await screen.findByRole('link', { name: 'Forgot password?' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/account/forgot'))
    await user.click(await screen.findByRole('link', { name: 'Back to sign in' }))
    await user.click(await screen.findByRole('link', { name: 'Create an account' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/account/create'))
  })

  it('reads in Russian', async () => {
    await renderApp('/account/sign-in', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Вход' })).toBeVisible()
    expect(untranslated(document.body)).toEqual([])
  })
})

describe('Create an account', () => {
  it('makes the account and signs in', async () => {
    const user = userEvent.setup()
    const auth = createFakeAuth()
    const { router } = await renderApp('/account/create', { auth })
    await user.type(await screen.findByLabelText('Your name'), 'Ana')
    await user.type(screen.getByLabelText('Email'), ANA.email)
    await user.type(screen.getByLabelText('Password'), ANA.password)
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings'))
    expect(await auth.current()).toMatchObject({ name: 'Ana' })
  })

  it('asks the learner to confirm their email where the server wants it', async () => {
    const user = userEvent.setup()
    const auth: AuthGateway = {
      ...createFakeAuth(),
      signUp: async ({ email, name }) => ({
        ok: true,
        value: { account: { id: 'a', email, name, role: 'learner' }, confirm: true },
      }),
    }
    await renderApp('/account/create', { auth })
    await user.type(await screen.findByLabelText('Your name'), 'Ana')
    await user.type(screen.getByLabelText('Email'), ANA.email)
    await user.type(screen.getByLabelText('Password'), ANA.password)
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    expect(await screen.findByRole('heading', { name: 'Check your email' })).toBeVisible()
    expect(screen.getByText(/We sent a link to ana@example.com/)).toBeVisible()
  })

  it('says an email already has an account, and a short password before asking', async () => {
    const user = userEvent.setup()
    await renderApp('/account/create', { auth: createFakeAuth({ accounts: [ANA] }) })
    await user.type(await screen.findByLabelText('Your name'), 'Ana')
    await user.type(screen.getByLabelText('Email'), ANA.email)
    await user.type(screen.getByLabelText('Password'), 'short')
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    expect(screen.getByLabelText('Password')).toHaveAccessibleDescription(
      'Use at least 8 characters.',
    )
    await user.type(screen.getByLabelText('Password'), ' and long')
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'That email already has an account. Sign in instead.',
    )
  })
})

describe('Forgotten password', () => {
  it('sends the link and says so, whatever the address', async () => {
    const user = userEvent.setup()
    const auth = createFakeAuth()
    const reset = vi.spyOn(auth, 'requestPasswordReset')
    await renderApp('/account/forgot', { auth })
    await user.type(await screen.findByLabelText('Email'), 'who@example.com')
    await user.click(screen.getByRole('button', { name: 'Send the link' }))
    expect(
      await screen.findByText(
        'If who@example.com has an account, a link to choose a new password is on its way.',
      ),
    ).toBeVisible()
    expect(reset).toHaveBeenCalledWith('who@example.com')
  })
})

describe('The sign-in callback', () => {
  it('finishes the sign-in the link brought back, and goes to Settings', async () => {
    const auth = createFakeAuth({ accounts: [ANA] })
    const complete = vi.spyOn(auth, 'completeRedirect')
    await auth.signIn(ANA.email, ANA.password)
    const { router } = await renderApp('/auth/callback?code=abc', { auth })
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings'))
    expect(complete).toHaveBeenCalledTimes(1)
    expect(complete).toHaveBeenCalledWith('abc')
  })

  it('opens New password after a reset link, and saves it', async () => {
    const user = userEvent.setup()
    const auth = createFakeAuth({ accounts: [ANA] })
    await auth.signIn(ANA.email, ANA.password)
    const update = vi.spyOn(auth, 'updatePassword')
    const { router } = await renderApp('/auth/callback?code=abc&next=reset', { auth })
    await waitFor(() => expect(router.state.location.pathname).toBe('/account/new-password'))
    await user.type(await screen.findByLabelText('Password'), 'a new long one')
    await user.click(screen.getByRole('button', { name: 'Save password' }))
    expect(await screen.findByText('Your new password is saved.')).toBeVisible()
    expect(update).toHaveBeenCalledWith('a new long one')
  })

  it('says a link that did not work, and leads back to Sign in', async () => {
    await renderApp('/auth/callback?error=access_denied')
    expect(
      await screen.findByText('This link didn’t work. It may have expired or been used already.'),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'Sign in again' })).toHaveAttribute(
      'href',
      '/account/sign-in',
    )
  })
})
