import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderRouted } from '@/app/testing/render-routed'
import type { SyncLine } from '@/shared/lib/sync'
import { AccountCardFace } from './AccountCard'

const ANA = { id: 'ana', email: 'ana@example.com', name: 'Ana', role: 'learner' } as const

describe('the account card (A15)', () => {
  it.each<[SyncLine, string]>([
    [{ kind: 'synced', ago: { value: -2, unit: 'minute' } }, 'Synced 2 min. ago'],
    [{ kind: 'waiting', count: 3 }, '3 changes pending'],
    [{ kind: 'offline' }, 'Offline'],
    [{ kind: 'failed' }, 'Last sync failed'],
    [{ kind: 'syncing' }, 'Syncing…'],
  ])('shows the learner and one line of the sync: %o', async (line, said) => {
    await renderRouted(<AccountCardFace account={ANA} line={line} />)
    const card = await screen.findByRole('link', { name: /Ana/ })
    expect(card).toHaveTextContent(`Ana ana@example.com ${said}`)
    expect(card).toHaveAttribute('href', '/settings/account')
  })

  it('asks a learner signed out to sign in, and says why', async () => {
    await renderRouted(<AccountCardFace account={null} line={{ kind: 'idle' }} />)
    const card = await screen.findByRole('link', { name: /Sign in/ })
    expect(card).toHaveTextContent('Sync your library across your devices')
    expect(card).toHaveAttribute('href', '/account/sign-in')
  })
})
