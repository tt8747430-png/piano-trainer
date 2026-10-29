// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { untilTestEnds } from '@/shared/test/listeners'
import { SETTINGS_VERSION } from '@/entities/settings'
import { createFakeCloud } from '@/shared/api/sync'
import {
  createAuth,
  createBackend,
  createServices,
  createStores,
  createSync,
  SYNCED_SAVES,
} from './composition-root'

describe('createServices', () => {
  it('builds audio without creating an AudioContext, and no MIDI where the browser has none', () => {
    const AudioContext = vi.fn()
    vi.stubGlobal('AudioContext', AudioContext)
    const services = createServices()
    expect(services.audio.now()).toBe(0)
    expect(services.midi).toBeNull()
    expect(AudioContext).not.toHaveBeenCalled()
  })

  it('builds a MIDI input where the browser has Web MIDI', () => {
    vi.stubGlobal('navigator', { ...navigator, requestMIDIAccess: vi.fn() })
    expect(createServices().midi).not.toBeNull()
  })
})

describe('createStores', () => {
  it('builds every saved store on the one storage it is given', () => {
    const storage = createMemoryStorage()
    const stores = createStores({ storage, signal: untilTestEnds() }, { languages: ['ru'] })
    expect(Object.keys(stores).sort()).toEqual([
      'diagramInversions',
      'library',
      'patterns',
      'pieces',
      'progress',
      'settings',
      'takes',
      'views',
    ])
    stores.settings.setState({ ...stores.settings.getState() })
    stores.progress.setState({ ...stores.progress.getState() })
    expect(storage.getItem('pt-settings')).not.toBeNull()
    expect(storage.getItem('pt-progress')).not.toBeNull()
  })
})

describe('createBackend and createAuth', () => {
  it('build on the project the environment names, asking the network nothing until a call needs it', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    const auth = createAuth(createBackend())
    expect(await auth.current()).toBeNull()
    expect(fetch).not.toHaveBeenCalled()
  })
})

describe('createSync', () => {
  it('syncs every saved store but the keyboard’s, which is this device’s alone', () => {
    expect(SYNCED_SAVES.map((save) => save.key).sort()).toEqual([
      'pt-diagram-inversions',
      'pt-library',
      'pt-patterns',
      'pt-pieces',
      'pt-progress',
      'pt-settings',
      'pt-takes',
      'pt-views',
    ])
  })

  it('brings a save from the cloud into its store, as another tab’s would be', async () => {
    const cloud = createFakeCloud()
    const tabs = new EventTarget()
    const storage = createMemoryStorage()
    const sync = createSync(cloud, storage, tabs)
    const stores = createStores(
      { storage: sync.storage, otherTabs: tabs, signal: untilTestEnds() },
      { languages: ['en'] },
    )
    const saved = JSON.parse(sync.storage.getItem('pt-settings') ?? 'null') ?? {
      state: stores.settings.getState(),
      version: 0,
    }
    await cloud.push(
      'settings',
      {
        id: 'state',
        data: {
          ...saved.state,
          theme: 'dark',
          _version: SETTINGS_VERSION,
        },
        updatedAt: '2026-10-29T10:00:00.000Z',
        deleted: false,
      },
      null,
    )
    await sync.syncNow()
    await vi.waitFor(() => expect(stores.settings.getState().theme).toBe('dark'))
  })
})
