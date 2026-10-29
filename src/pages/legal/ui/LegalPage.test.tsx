import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Privacy and Terms (ADR 0116)', () => {
  it('opens Privacy from Settings › Help, its sections each under a heading', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/help')
    await user.click(await screen.findByRole('link', { name: /^Privacy/ }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Privacy' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Where it is kept' })).toBeInTheDocument()
    expect(screen.getByText(/Supabase in the European Union/)).toBeInTheDocument()
  })

  it('opens Terms from Settings › Help', async () => {
    const user = userEvent.setup()
    await renderApp('/settings/help')
    await user.click(await screen.findByRole('link', { name: /^Terms/ }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Terms' })).toBeInTheDocument()
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
      await screen.findByRole('heading', { level: 1, name: 'Конфиденциальность' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Где всё хранится' })).toBeInTheDocument()
  })
})
