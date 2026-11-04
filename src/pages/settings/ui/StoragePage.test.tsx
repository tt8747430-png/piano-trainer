import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { expectLastAndAlone } from '@/shared/test/danger'

const MANIFEST = {
  instrument: 'piano',
  set: 'Salamander Grand Piano V3',
  licence: 'CC-BY-3.0',
  layers: [{ name: 'mf', upTo: 1 }],
  samples: [
    { file: 'mf/A0.m4a', midi: 21, layer: 'mf', bytes: 2_300_000 },
    { file: 'mf/C4.m4a', midi: 60, layer: 'mf', bytes: 6_800_000 },
  ],
}

/** The browser's caches, holding `kept` of the grand's files, and a network that answers. */
function stubBrowser(kept: string[]) {
  const entries = new Set(kept)
  const cache = {
    keys: async () => [...entries].map((path) => new Request(`http://localhost${path}`)),
    put: async (url: string) => void entries.add(url),
  }
  vi.stubGlobal('caches', {
    open: async () => cache,
    delete: async () => {
      entries.clear()
      return true
    },
  })
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) =>
      url.endsWith('manifest.json') ? Response.json(MANIFEST) : new Response('aac'),
    ),
  )
  return entries
}

describe('Storage and backup › Piano sound (A27)', () => {
  it('shows the samples’ size and downloads them for offline', async () => {
    const user = userEvent.setup()
    const entries = stubBrowser(['/samples/piano/mf/A0.m4a'])
    await renderApp('/settings/storage')
    const group = await screen.findByRole('region', { name: 'Piano sound' })
    expect(await within(group).findByText('2.3 MB of 9.1 MB on this device')).toBeVisible()
    await user.click(within(group).getByRole('button', { name: /Download for offline/ }))
    expect(await within(group).findByText('Ready offline')).toBeVisible()
    expect(within(group).getByText('9.1 MB of 9.1 MB on this device')).toBeVisible()
    expect(within(group).queryByRole('button', { name: /Download for offline/ })).toBeNull()
    expect(entries.size).toBe(2)
  })

  it('asks before removing them', async () => {
    const user = userEvent.setup()
    const entries = stubBrowser(['/samples/piano/mf/A0.m4a', '/samples/piano/mf/C4.m4a'])
    await renderApp('/settings/storage')
    const remove = await screen.findByRole('button', { name: 'Remove piano samples' })
    expectLastAndAlone(remove)
    await user.click(remove)
    const dialog = await screen.findByRole('alertdialog', { name: 'Remove the piano samples?' })
    expect(dialog).toHaveTextContent('Offline, the piano plays a lighter recorded sound')
    await user.click(within(dialog).getByRole('button', { name: 'Remove' }))
    const group = screen.getByRole('region', { name: 'Piano sound' })
    expect(await within(group).findByText('0 MB of 9.1 MB on this device')).toBeVisible()
    expect(entries.size).toBe(0)
    expect(screen.queryByRole('button', { name: 'Remove piano samples' })).toBeNull()
  })

  it('shows no group where the browser keeps no caches', async () => {
    await renderApp('/settings/storage')
    await screen.findByRole('region', { name: 'Backup' })
    expect(screen.queryByRole('region', { name: 'Piano sound' })).toBeNull()
  })
})
