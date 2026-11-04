import { describe, expect, it, vi } from 'vitest'
import { midi } from '@/shared/lib/music'
import { createSampleLoader } from './sample-loader'
import type { SampleManifest } from './sample-manifest'
import { createSampler, pianoRelease } from './sampler'

/** Just enough of an AudioContext to see what a sampler builds. */
class SamplerContext {
  currentTime = 0
  readonly destination = {}
  readonly sources: {
    buffer: AudioBuffer | null
    playbackRate: { value: number }
    started: number
    stopped: number
    onended: (() => void) | null
  }[] = []
  readonly gains: { value: number; targets: { value: number; at: number; constant: number }[] }[] =
    []

  decodeAudioData = vi.fn(async (bytes: ArrayBuffer) => {
    const [name = ''] = new TextDecoder().decode(bytes).split('\n')
    return { length: 44_100, numberOfChannels: 1, duration: 1, name } as unknown as AudioBuffer
  })

  createBufferSource() {
    const source = {
      buffer: null as AudioBuffer | null,
      playbackRate: { value: 1 },
      started: -1,
      stopped: -1,
      onended: null as (() => void) | null,
      connect: (next: unknown) => next,
      disconnect: vi.fn(),
      start(at: number) {
        source.started = at
      },
      stop(at: number) {
        source.stopped = at
      },
    }
    this.sources.push(source)
    return source
  }

  createGain() {
    const record = {
      value: 1,
      targets: [] as { value: number; at: number; constant: number }[],
    }
    this.gains.push(record)
    return {
      gain: {
        get value() {
          return record.value
        },
        set value(level: number) {
          record.value = level
        },
        setValueAtTime: vi.fn(),
        cancelScheduledValues: vi.fn(),
        setTargetAtTime: (value: number, at: number, constant: number) =>
          void record.targets.push({ value, at, constant }),
      },
      connect: (next: unknown) => next,
      disconnect: vi.fn(),
    }
  }
}

const ROOTS = Array.from({ length: 30 }, (_, index) => 21 + index * 3)
const LAYERS = ['p', 'mp', 'mf', 'f'] as const

const GRAND: SampleManifest = {
  instrument: 'piano',
  set: 'Salamander Grand Piano V3',
  licence: 'CC-BY-3.0',
  layers: [
    { name: 'p', upTo: 0.35 },
    { name: 'mp', upTo: 0.6 },
    { name: 'mf', upTo: 0.85 },
    { name: 'f', upTo: 1 },
  ],
  samples: LAYERS.flatMap((layer) =>
    ROOTS.map((root) => ({ file: `${layer}/${root}.m4a`, midi: root, layer, bytes: 1, tune: 0 })),
  ),
}

/** A loader over a set whose every file decodes to a buffer named by its URL. */
function loaderOver(context: SamplerContext, manifests: Record<string, SampleManifest>) {
  return createSampleLoader({
    context: context as unknown as BaseAudioContext,
    fetchJson: async (url) => manifests[url.split('/')[2] ?? ''] ?? null,
    fetchBytes: async (url) => new TextEncoder().encode(url).buffer,
  })
}

async function grand() {
  const context = new SamplerContext()
  const loader = loaderOver(context, { piano: GRAND })
  const sampler = createSampler(context as unknown as BaseAudioContext, loader, 'piano', {
    release: pianoRelease,
  })
  await sampler.loaded()
  return { context, loader, sampler }
}

const nameOf = (buffer: AudioBuffer | null) => (buffer as unknown as { name: string } | null)?.name

describe('createSampler', () => {
  it('picks the nearest root, at most a semitone away, for every key A0–C8', async () => {
    const { context, sampler } = await grand()
    for (let key = 21; key <= 108; key++) {
      await sampler.need(midi(key), 0.7)
      const voice = sampler.start(midi(key), 0.7, 0, 1, context.destination as AudioNode)
      expect(voice, `key ${key}`).not.toBeNull()
      const source = context.sources.at(-1)
      const root = Number(/(\d+)\.m4a$/.exec(nameOf(source?.buffer ?? null) ?? '')?.[1])
      expect(Math.abs(key - root), `key ${key}`).toBeLessThanOrEqual(1)
      expect(source?.playbackRate.value).toBeCloseTo(2 ** ((key - root) / 12))
    }
  })

  it('tunes a root by its cents, as the set’s map says', async () => {
    const context = new SamplerContext()
    const tuned = {
      ...GRAND,
      samples: GRAND.samples.map((sample) => ({ ...sample, tune: 10 })),
    }
    const sampler = createSampler(
      context as unknown as BaseAudioContext,
      loaderOver(context, { piano: tuned }),
      'piano',
    )
    await sampler.need(midi(60), 0.7)
    sampler.start(midi(60), 0.7, 0, 1, context.destination as AudioNode)
    expect(context.sources.at(-1)?.playbackRate.value).toBeCloseTo(2 ** (10 / 1200))
  })

  it.each([
    [0.2, 'p'],
    [0.5, 'mp'],
    [0.7, 'mf'],
    [0.95, 'f'],
  ])('picks the layer by velocity: %s strikes %s', async (velocity, layer) => {
    const { context, sampler } = await grand()
    expect(sampler.ready(midi(60), velocity)).toBe(false)
    await sampler.need(midi(60), velocity)
    expect(sampler.ready(midi(60), velocity)).toBe(true)
    sampler.start(midi(60), velocity, 0, 1, context.destination as AudioNode)
    expect(nameOf(context.sources.at(-1)?.buffer ?? null)).toBe(`/samples/piano/${layer}/60.m4a`)
  })

  it('plays nothing for a key not loaded, and starts loading it', async () => {
    const { context, sampler, loader } = await grand()
    expect(sampler.start(midi(60), 0.7, 0, 1, context.destination as AudioNode)).toBeNull()
    await vi.waitFor(() => expect(loader.buffer('/samples/piano/mf/60.m4a')).not.toBeNull())
  })

  it('plays a loaded layer of the same root where the one asked for is not in yet', async () => {
    const { context, sampler } = await grand()
    await sampler.need(midi(60), 0.5)
    expect(sampler.start(midi(60), 0.95, 0, 1, context.destination as AudioNode)).not.toBeNull()
    expect(nameOf(context.sources.at(-1)?.buffer ?? null)).toBe('/samples/piano/mp/60.m4a')
  })

  it('keeps one voice a key: struck again, the voice ringing on it is released there', async () => {
    const { context, sampler } = await grand()
    await sampler.need(midi(60), 0.7)
    sampler.start(midi(60), 0.7, 0, 1, context.destination as AudioNode)
    sampler.start(midi(60), 0.7, 1.5, 1, context.destination as AudioNode)
    expect(context.sources[0]?.stopped).toBeGreaterThan(1.5)
    expect(context.sources[0]?.stopped).toBeLessThan(1.7)
    expect(context.gains[0]?.targets.at(-1)).toMatchObject({ value: 0, at: 1.5 })
    expect(context.sources[1]?.stopped).toBe(-1)
  })

  it('releases a voice at its note-off, the bass longer than the treble', async () => {
    const { context, sampler } = await grand()
    await sampler.need(midi(36), 0.7)
    sampler.start(midi(36), 0.7, 0, 1, context.destination as AudioNode)?.release(2)
    expect(context.gains[0]?.targets.at(-1)).toMatchObject({ value: 0, at: 2 })
    expect(context.sources[0]?.stopped).toBeCloseTo(2 + pianoRelease(midi(36)))
    expect(pianoRelease(midi(36))).toBeCloseTo(0.6)
    expect(pianoRelease(midi(60))).toBeCloseTo(0.425)
    expect(pianoRelease(midi(84))).toBeCloseTo(0.25)
  })

  it('scales the gain inside a layer by the velocity', async () => {
    const { context, sampler } = await grand()
    await sampler.need(midi(60), 0.7)
    sampler.start(midi(60), 0.61, 0, 1, context.destination as AudioNode)
    sampler.start(midi(61), 0.84, 0, 1, context.destination as AudioNode)
    const [soft, hard] = context.gains.map((gain) => gain.value)
    expect(soft).toBeLessThan(hard ?? 0)
  })

  it('strikes a kit’s piece by its name, and lets a closed hat choke an open one', async () => {
    const context = new SamplerContext()
    const kit: SampleManifest = {
      instrument: 'drums',
      set: 'Virtuosity Drums',
      licence: 'CC0-1.0',
      layers: [
        { name: 'normal', upTo: 0.8 },
        { name: 'accent', upTo: 1 },
      ],
      samples: ['hatOpen', 'hatClosed'].flatMap((voice) =>
        ['normal', 'accent'].map((layer) => ({
          file: `${layer}/${voice}.m4a`,
          voice,
          layer,
          bytes: 1,
          tune: 0,
        })),
      ),
    }
    const sampler = createSampler(
      context as unknown as BaseAudioContext,
      loaderOver(context, { drums: kit }),
      'drums',
      { chokes: { hatClosed: ['hatOpen'] }, oneVoiceAKey: false },
    )
    await sampler.need('hatOpen', 0.9)
    await sampler.need('hatClosed', 0.5)
    sampler.start('hatOpen', 0.9, 0, 1, context.destination as AudioNode)
    sampler.start('hatClosed', 0.5, 1, 1, context.destination as AudioNode)
    expect(nameOf(context.sources[0]?.buffer ?? null)).toBe('/samples/drums/accent/hatOpen.m4a')
    expect(nameOf(context.sources[1]?.buffer ?? null)).toBe('/samples/drums/normal/hatClosed.m4a')
    expect(context.sources[0]?.stopped).toBeGreaterThan(1)
    expect(context.sources[0]?.stopped).toBeLessThan(1.2)
  })
})
