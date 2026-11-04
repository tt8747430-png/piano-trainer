import { describe, expect, it, vi } from 'vitest'
import { createPianoDownload, PIANO_CACHE } from './piano-download'

const MANIFEST = {
  instrument: 'piano',
  set: 'Salamander Grand Piano V3',
  licence: 'CC-BY-3.0',
  layers: [{ name: 'mf', upTo: 1 }],
  samples: [
    { file: 'mf/A0.m4a', midi: 21, layer: 'mf', bytes: 3_000_000 },
    { file: 'mf/C4.m4a', midi: 60, layer: 'mf', bytes: 1_000_000 },
    { file: 'mf/C8.m4a', midi: 108, layer: 'mf', bytes: 2_000_000 },
  ],
}

/** A CacheStorage of one cache, by URL path. */
function fakeCaches(kept: string[] = []) {
  const entries = new Set(kept)
  const cache = {
    keys: async () => [...entries].map((path) => new Request(`https://piano.example${path}`)),
    put: vi.fn(async (request: string) => void entries.add(request)),
  }
  const storage = {
    open: vi.fn(async (name: string) => {
      expect(name).toBe(PIANO_CACHE)
      return cache
    }),
    delete: vi.fn(async () => {
      entries.clear()
      return true
    }),
  }
  return { storage: storage as unknown as CacheStorage, entries }
}

const fetchFiles = (failing: string[] = []) =>
  vi.fn(async (url: string) =>
    failing.includes(url) ? new Response(null, { status: 404 }) : new Response('aac'),
  )

describe('createPianoDownload', () => {
  it('says how much of the grand this device keeps, of all of it', async () => {
    const { storage } = fakeCaches(['/samples/piano/mf/A0.m4a'])
    const download = createPianoDownload({
      caches: storage,
      fetchJson: async () => MANIFEST,
      fetchFile: fetchFiles(),
    })
    expect(await download.measure()).toEqual({ kept: 3_000_000, total: 6_000_000 })
  })

  it('knows nothing where the browser keeps no caches or the manifest cannot be had', async () => {
    const none = createPianoDownload({ caches: undefined, fetchJson: async () => MANIFEST })
    expect(await none.measure()).toBeNull()
    const offline = createPianoDownload({
      caches: fakeCaches().storage,
      fetchJson: async () => null,
    })
    expect(await offline.measure()).toBeNull()
  })

  it('downloads every file not kept, one at a time, saying how far it has gone', async () => {
    const { storage, entries } = fakeCaches(['/samples/piano/mf/A0.m4a'])
    const fetchFile = fetchFiles()
    const download = createPianoDownload({
      caches: storage,
      fetchJson: async () => MANIFEST,
      fetchFile,
    })
    const progress: number[] = []
    expect(await download.download((done) => progress.push(done))).toBe(true)
    expect(fetchFile.mock.calls.map(([url]) => url)).toEqual([
      '/samples/piano/mf/C4.m4a',
      '/samples/piano/mf/C8.m4a',
    ])
    expect(progress).toEqual([0.5, 0.5 + 1 / 6, 1])
    expect(entries.size).toBe(3)
  })

  it('says a download failed where a file could not be had, keeping what came', async () => {
    const { storage, entries } = fakeCaches()
    const download = createPianoDownload({
      caches: storage,
      fetchJson: async () => MANIFEST,
      fetchFile: fetchFiles(['/samples/piano/mf/C4.m4a']),
    })
    expect(await download.download(() => undefined)).toBe(false)
    expect([...entries]).toEqual(['/samples/piano/mf/A0.m4a', '/samples/piano/mf/C8.m4a'])
  })

  it('removes the grand’s files from the device', async () => {
    const { storage, entries } = fakeCaches(['/samples/piano/mf/A0.m4a'])
    const download = createPianoDownload({ caches: storage, fetchJson: async () => MANIFEST })
    await download.remove()
    expect(storage.delete).toHaveBeenCalledWith(PIANO_CACHE)
    expect(entries.size).toBe(0)
  })
})
