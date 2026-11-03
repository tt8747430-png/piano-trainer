import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { stubMatchMedia } from '@/shared/test/match-media'

describe('Settings › On-screen piano holds Computer keys', () => {
  it('shows Computer keys on a computer', async () => {
    stubMatchMedia({ dark: false, pointer: 'fine' })
    await renderApp('/settings/on-screen-piano')
    expect(await screen.findByRole('region', { name: 'Computer keys' })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: /Play from the computer keys/ })).toBeInTheDocument()
  })

  it('hides Computer keys on a phone', async () => {
    stubMatchMedia({ dark: false, pointer: 'coarse' })
    await renderApp('/settings/on-screen-piano')
    await screen.findByRole('heading', { level: 1, name: 'On-screen piano' })
    expect(screen.queryByRole('region', { name: 'Computer keys' })).toBeNull()
  })

  it('the old Computer keys link opens On-screen piano', async () => {
    const { router } = await renderApp('/settings/computer-keys')
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings/on-screen-piano'))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'On-screen piano' }),
    ).toBeInTheDocument()
  })
})
