import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('About (R29 B9, R32)', () => {
  it('shows the version and build, Software update, the licence, Legal and every credit', async () => {
    await renderApp('/settings/about')
    expect(await screen.findByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument()
    for (const text of [
      'Version',
      'Software update',
      'All rights reserved',
      'Acknowledgements',
      'Verovio',
      'three.js',
      'WebXR generic hand',
      'Salamander Grand Piano',
      'Splendid Grand Piano',
      'Virtuosity Drums',
      'Growlybass',
      'Meatbass',
      'Noto',
      'Called to Play for Him',
    ]) {
      expect(document.body).toHaveTextContent(text)
    }
    expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute(
      'href',
      '/legal/terms',
    )
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute(
      'href',
      '/legal/privacy',
    )
  })

  it('opens from Settings › Support, and its Back returns there on a phone (the owner’s bug)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/settings')
    expect(await screen.findByRole('link', { name: /^About/ })).toHaveAttribute(
      'href',
      '/settings/about',
    )
    await user.click(screen.getByRole('link', { name: /^About/ }))
    await screen.findByRole('heading', { level: 1, name: 'About' })
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings'))
  })
})
