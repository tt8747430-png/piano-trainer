// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { untilTestEnds } from '@/shared/test/listeners'
import { createAuth, createBackend, createServices, createStores } from './composition-root'

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
  it('build on the project the .env names, asking the network nothing until a call needs it', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    const auth = createAuth(createBackend())
    expect(await auth.current()).toBeNull()
    expect(fetch).not.toHaveBeenCalled()
    expect(import.meta.env.VITE_SUPABASE_URL).toBe('https://itmiutianxvtlwhdsalo.supabase.co')
  })
})
