import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { createFakeAuth } from '@/shared/api/auth'

describe('the welcome', () => {
  it('greets the first run once, its language chosen there', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/', { welcomed: false })
    const welcome = await screen.findByRole('alertdialog', { name: 'Welcome to Piano Trainer' })
    await user.click(within(welcome).getByRole('radio', { name: 'Русский' }))
    expect(settingsStore.getState().locale).toBe('ru')
    await user.click(within(welcome).getByRole('button', { name: 'Начать' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
    expect(settingsStore.getState().welcomed).toBe(true)
  })

  it('leads on to Sign in', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/', { welcomed: false })
    await user.click(await screen.findByRole('button', { name: 'Sign in' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/account/sign-in'))
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('never asks a learner signed in, after an update started the settings afresh (R32)', async () => {
    const learner = { email: 'ana@example.com', name: 'Ana', password: 'correct horse' }
    const auth = createFakeAuth({ accounts: [learner] })
    await auth.signIn(learner.email, learner.password)
    const { settingsStore } = await renderApp('/', { welcomed: false, auth })
    await waitFor(() => expect(settingsStore.getState().welcomed).toBe(true))
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('stays away from a link an email brought to the account pages', async () => {
    await renderApp('/auth/callback?error=expired', { welcomed: false })
    await screen.findByText(/This link didn’t work/)
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('reads in Russian', async () => {
    await renderApp('/', { welcomed: false, locale: 'ru' })
    await screen.findByRole('alertdialog')
    expect(untranslated(document.body)).toEqual([])
  })
})
