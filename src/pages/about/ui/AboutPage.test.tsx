import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('About (R29 B9)', () => {
  it('shows the version, the build, the licence and every credit, then Terms and Privacy', async () => {
    await renderApp('/settings/about')
    expect(await screen.findByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument()
    for (const text of [
      'Version',
      'Build',
      'All rights reserved',
      'Verovio',
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
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/legal/terms')
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/legal/privacy')
  })

  it('opens from Settings › Help', async () => {
    await renderApp('/settings')
    expect(await screen.findByRole('link', { name: /^About/ })).toHaveAttribute(
      'href',
      '/settings/about',
    )
  })
})
