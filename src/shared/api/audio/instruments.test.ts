import { describe, expect, it, vi } from 'vitest'
import { midi } from '@/shared/lib/music'
import { KIT_PIECES, type Sound } from '@/shared/lib/schedule'
import { createInstruments } from './instruments'
import { kitSet, loaderOver, pitchedSet, SamplerContext, sampleNameOf } from './sample-fakes'
import type { SampleManifest } from './sample-manifest'

const SETS: Record<string, SampleManifest> = {
  piano: pitchedSet('piano', ['p', 'mp', 'mf', 'f']),
  'piano-light': pitchedSet('piano', ['mf']),
  'bass-electric': pitchedSet('bassElectric', ['p', 'f']),
  'bass-upright': pitchedSet('bassUpright', ['p', 'f']),
  drums: kitSet(KIT_PIECES),
}

function setUp(sets: Record<string, SampleManifest> = SETS) {
  const context = new SamplerContext()
  const loader = loaderOver(context, sets)
  const instruments = createInstruments(
    context as unknown as BaseAudioContext,
    loader,
    context.destination as AudioNode,
  )
  return { context, loader, instruments }
}

describe('createInstruments', () => {
  it('plays the chord player’s bass and drums from their sets at the scheduled time', async () => {
    const { context, loader, instruments } = setUp()
    const band: Sound[] = [
      {
        kind: 'note',
        midi: midi(40),
        at: 0,
        duration: 1,
        velocity: 0.9,
        instrument: 'bassUpright',
      },
      { kind: 'drum', at: 0, piece: 'rim', velocity: 0.5 },
    ]
    instruments.need(band)
    await vi.waitFor(() => {
      expect(loader.buffer('/samples/bass-upright/f/39.m4a')).not.toBeNull()
      expect(loader.buffer('/samples/drums/normal/rim.m4a')).not.toBeNull()
    })
    expect(instruments.bass('bassUpright', midi(40), 0.9, 2.5, 1)).not.toBeNull()
    expect(instruments.drum('rim', 0.5, 2.75, 1)).not.toBeNull()
    expect(context.sources.map((source) => [sampleNameOf(source.buffer), source.started])).toEqual([
      ['/samples/bass-upright/f/39.m4a', 2.5],
      ['/samples/drums/normal/rim.m4a', 2.75],
    ])
  })

  it('plays a note asked for before the grand’s buffer is ready from the light piano', async () => {
    const { context, loader, instruments } = setUp()
    await loader.load('/samples/piano-light/mf/60.m4a')
    await loader.manifest('piano')
    expect(instruments.piano(midi(60), 0.7, 1, 1)).not.toBeNull()
    expect(sampleNameOf(context.sources[0]?.buffer)).toBe('/samples/piano-light/mf/60.m4a')
    // The grand's file was asked for as the note was: the next strike is the grand's.
    await vi.waitFor(() => expect(loader.buffer('/samples/piano/mf/60.m4a')).not.toBeNull())
    instruments.piano(midi(60), 0.7, 2, 1)
    expect(sampleNameOf(context.sources[1]?.buffer)).toBe('/samples/piano/mf/60.m4a')
  })

  it('plays nothing where no set has the note yet: its caller plays the stand-in', () => {
    const { instruments } = setUp({})
    expect(instruments.piano(midi(60), 0.7, 0, 1)).toBeNull()
    expect(instruments.bass('bassElectric', midi(40), 0.7, 0, 1)).toBeNull()
    expect(instruments.drum('kick', 0.7, 0, 1)).toBeNull()
  })

  it('warms the light piano whole and the grand’s mp layer, decoding no other layer', async () => {
    const { loader, instruments } = setUp()
    await instruments.warm()
    expect(loader.buffer('/samples/piano-light/mf/21.m4a')).not.toBeNull()
    expect(loader.buffer('/samples/piano/mp/60.m4a')).not.toBeNull()
    expect(loader.buffer('/samples/piano/mf/60.m4a')).toBeNull()
    expect(loader.buffer('/samples/piano/mp/21.m4a')).toBeNull()
  })
})
