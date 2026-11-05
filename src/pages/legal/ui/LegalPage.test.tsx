import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Privacy and Terms (ADR 0116)', () => {
  it('opens the Privacy Policy from About’s Legal, its sections each under a heading', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings/about')
    await user.click(await screen.findByRole('link', { name: 'Privacy Policy' }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Privacy Policy' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Where it is kept' })).toBeInTheDocument()
    expect(screen.getByText(/Supabase in the European Union/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings/about'))
  })

  it('goes up to About when opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/legal/terms')
    await screen.findByRole('heading', { level: 1, name: 'Terms of Service' })
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings/about'))
  })

  it('opens the Terms of Service from About’s Legal', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/about')
    await user.click(await screen.findByRole('link', { name: 'Terms of Service' }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Terms of Service' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'What you publish' })).toBeInTheDocument()
  })

  it('is linked from Create an account', async () => {
    await renderApp('/account/create')
    expect(await screen.findByRole('link', { name: 'Terms' })).toHaveAttribute(
      'href',
      '/legal/terms',
    )
    expect(screen.getByRole('link', { name: 'Privacy notice' })).toHaveAttribute(
      'href',
      '/legal/privacy',
    )
  })

  it('reads in Russian', async () => {
    await renderApp('/legal/privacy', { locale: 'ru' })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Политика конфиденциальности' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Где всё хранится' })).toBeInTheDocument()
  })
})
