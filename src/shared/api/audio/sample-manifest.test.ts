import { describe, expect, it } from 'vitest'
import { layerFor, parseManifest } from './sample-manifest'

const PIANO = {
  instrument: 'piano',
  set: 'Salamander Grand Piano V3',
  licence: 'CC-BY-3.0',
  layers: [
    { name: 'p', upTo: 0.35 },
    { name: 'mp', upTo: 0.6 },
    { name: 'mf', upTo: 0.85 },
    { name: 'f', upTo: 1 },
  ],
  samples: [
    { file: 'mf/C4.m4a', midi: 60, layer: 'mf', bytes: 1200, tune: -3 },
    { file: 'p/C4.m4a', midi: 60, layer: 'p', bytes: 900 },
  ],
}

describe('parseManifest', () => {
  it('reads a set’s manifest: its layers, and each file with its key or voice', () => {
    const manifest = parseManifest(PIANO)
    expect(manifest?.layers.map((layer) => layer.name)).toEqual(['p', 'mp', 'mf', 'f'])
    expect(manifest?.samples[0]).toEqual({
      file: 'mf/C4.m4a',
      midi: 60,
      layer: 'mf',
      bytes: 1200,
      tune: -3,
    })
    expect(manifest?.samples[1]?.tune).toBe(0)
  })

  it('refuses what is no manifest, or a file of no layer it names', () => {
    expect(parseManifest(null)).toBeNull()
    expect(parseManifest({ ...PIANO, samples: 'none' })).toBeNull()
    expect(
      parseManifest({ ...PIANO, samples: [{ file: 'x.m4a', midi: 60, layer: 'ff', bytes: 1 }] }),
    ).toBeNull()
    expect(
      parseManifest({ ...PIANO, samples: [{ file: 'x.m4a', layer: 'p', bytes: 1 }] }),
    ).toBeNull()
  })
})

describe('layerFor', () => {
  const layers = parseManifest(PIANO)?.layers ?? []
  it.each([
    [0.1, 'p'],
    [0.35, 'mp'],
    [0.59, 'mp'],
    [0.6, 'mf'],
    [0.85, 'f'],
    [1, 'f'],
  ])('a velocity of %s strikes the %s layer', (velocity, name) => {
    expect(layerFor(layers, velocity).name).toBe(name)
  })
})
