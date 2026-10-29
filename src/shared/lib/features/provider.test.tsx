import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createFakeFeatures } from '@/shared/api/admin'
import { createFakeAuth } from '@/shared/api/auth'
import { createFakeCloud } from '@/shared/api/sync'
import { createMemoryStorage } from '../safe-storage'
import { AccountProvider } from '../account'
import { createSyncRunner } from '../sync'
import { FeaturesProvider } from './provider'
import { useFeature } from './use-feature'

function Shows({ feature }: { feature: string }) {
  return <p>{useFeature(feature) ? 'on' : 'off'}</p>
}

describe('feature switches', () => {
  it('turns on what the switches say, once they are known; anything else stays off', async () => {
    const sync = createSyncRunner({
      cloud: createFakeCloud(),
      saves: [],
      storage: createMemoryStorage(),
      announce: () => {},
    })
    render(
      <AccountProvider auth={createFakeAuth()} sync={sync}>
        <FeaturesProvider features={createFakeFeatures(['beta-editor'])}>
          <Shows feature="beta-editor" />
          <Shows feature="other" />
        </FeaturesProvider>
      </AccountProvider>,
    )
    await act(async () => {})
    expect(screen.getAllByRole('paragraph').map((p) => p.textContent)).toEqual(['on', 'off'])
  })
})
