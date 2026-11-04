import { describe, expect, it, vi } from 'vitest'
import { createSampleLoader, decodedBytes, type FetchBytes } from './sample-loader'

/** A decoded buffer of `seconds` of mono at 44.1 kHz: 176 400 bytes a second. */
const bufferOf = (seconds: number) =>
  ({ length: seconds * 44_100, numberOfChannels: 1, duration: seconds }) as AudioBuffer

/** Files by URL, each its seconds; a context that decodes them. */
function setUp(files: Record<string, number>, budget = 80_000_000) {
  const fetched: string[] = []
  const fetchBytes: FetchBytes = vi.fn(async (url: string) => {
    fetched.push(url)
    const seconds = files[url]
    if (seconds === undefined) return null
    return new Float64Array([seconds]).buffer
  })
  const context = {
    decodeAudioData: vi.fn(async (bytes: ArrayBuffer) => bufferOf(new Float64Array(bytes)[0] ?? 0)),
  } as unknown as BaseAudioContext
  const loader = createSampleLoader({ context, fetchBytes, budget })
  return { loader, fetched, context }
}

describe('createSampleLoader', () => {
  it('counts a decoded buffer’s bytes: 4 a sample a channel', () => {
    expect(decodedBytes(bufferOf(1))).toBe(176_400)
  })

  it('fetches and decodes a file once, when first asked, however often it is asked', async () => {
    const { loader, fetched, context } = setUp({ '/samples/piano/mf/C4.m4a': 6 })
    expect(loader.buffer('/samples/piano/mf/C4.m4a')).toBeNull()
    const [first, second] = await Promise.all([
      loader.load('/samples/piano/mf/C4.m4a'),
      loader.load('/samples/piano/mf/C4.m4a'),
    ])
    expect(first).toBe(second)
    expect(loader.buffer('/samples/piano/mf/C4.m4a')).toBe(first)
    expect(fetched).toEqual(['/samples/piano/mf/C4.m4a'])
    expect(context.decodeAudioData).toHaveBeenCalledTimes(1)
    expect(loader.decoded()).toBe(6 * 176_400)
  })

  it('has no buffer for a file it cannot get, and asks again later (offline, then online)', async () => {
    const { loader, fetched } = setUp({})
    expect(await loader.load('/samples/piano/mf/C4.m4a')).toBeNull()
    expect(await loader.load('/samples/piano/mf/C4.m4a')).toBeNull()
    expect(fetched).toHaveLength(2)
  })

  it('frees the least recently struck buffers once the decoded audio passes its budget', async () => {
    // Room for two seconds' buffers, not three.
    const { loader } = setUp({ '/a': 1, '/b': 1, '/c': 1 }, 2.5 * 176_400)
    await loader.load('/a')
    await loader.load('/b')
    // Striking `a` again makes `b` the least recent.
    loader.buffer('/a')
    await loader.load('/c')
    expect(loader.buffer('/a')).not.toBeNull()
    expect(loader.buffer('/b')).toBeNull()
    expect(loader.buffer('/c')).not.toBeNull()
    expect(loader.decoded()).toBe(2 * 176_400)
  })

  it('reads a set’s manifest once, from its folder', async () => {
    const manifest = {
      instrument: 'drums',
      set: 'Virtuosity Drums',
      licence: 'CC0-1.0',
      layers: [{ name: 'normal', upTo: 1 }],
      samples: [{ file: 'normal/kick.m4a', voice: 'kick', layer: 'normal', bytes: 10 }],
    }
    const fetchJson = vi.fn(async () => manifest)
    const loader = createSampleLoader({
      context: {} as BaseAudioContext,
      fetchBytes: async () => null,
      fetchJson,
    })
    const [first] = await Promise.all([loader.manifest('drums'), loader.manifest('drums')])
    expect(first?.set).toBe('Virtuosity Drums')
    expect(fetchJson).toHaveBeenCalledTimes(1)
    expect(fetchJson).toHaveBeenCalledWith('/samples/drums/manifest.json')
    expect(loader.urlOf('drums', 'normal/kick.m4a')).toBe('/samples/drums/normal/kick.m4a')
  })

  it('fetches files into the cache in the background one at a time, decoding none', async () => {
    const { loader, fetched, context } = setUp({ '/a': 1, '/b': 1 })
    await loader.prefetch(['/a', '/b'])
    expect(fetched).toEqual(['/a', '/b'])
    expect(context.decodeAudioData).not.toHaveBeenCalled()
    expect(loader.decoded()).toBe(0)
  })
})
