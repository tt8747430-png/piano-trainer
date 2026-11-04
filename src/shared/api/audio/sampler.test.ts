import { describe, expect, it, vi } from 'vitest'
import { midi } from '@/shared/lib/music'
import {
  kitSet,
  loaderOver,
  pitchedSet,
  sampleNameOf as nameOf,
  SamplerContext,
} from './sample-fakes'
import { createSampler, pianoRelease } from './sampler'

const GRAND = pitchedSet('piano', ['p', 'mp', 'mf', 'f'])

async function grand() {
  const context = new SamplerContext()
  const loader = loaderOver(context, { piano: GRAND })
  const sampler = createSampler(context as unknown as BaseAudioContext, loader, 'piano', {
    release: pianoRelease,
  })
  await sampler.loaded()
  return { context, loader, sampler }
}

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
    const kit = kitSet(['hatOpen', 'hatClosed'])
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
