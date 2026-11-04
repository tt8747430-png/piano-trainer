/**
 * A recorded instrument's manifest (R29 SND, A27): `public/samples/<instrument>/manifest.json`, made by
 * its script under `scripts/samples/`. It names the set and its licence, the velocity layers from the
 * softest, and every file: a pitched instrument's by the key it was recorded on (`midi`, with the
 * cents its tuning is off by, `tune`), a kit's by the piece it is (`voice`).
 */
export interface SampleLayer {
  readonly name: string
  /** The velocity (0 to 1) this layer plays below; the loudest layer's is 1. */
  readonly upTo: number
}

export interface SampleFile {
  /** The file's path inside the instrument's folder. */
  readonly file: string
  readonly midi?: number
  readonly voice?: string
  readonly layer: string
  readonly bytes: number
  /** Cents to tune it by, where the recorded string was off (Salamander's retuned map). */
  readonly tune: number
}

export interface SampleManifest {
  readonly instrument: string
  readonly set: string
  readonly licence: string
  readonly layers: readonly SampleLayer[]
  readonly samples: readonly SampleFile[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

function layerOf(value: unknown): SampleLayer | null {
  if (!isRecord(value) || typeof value.name !== 'string' || typeof value.upTo !== 'number')
    return null
  return { name: value.name, upTo: value.upTo }
}

function fileOf(value: unknown, layers: ReadonlySet<string>): SampleFile | null {
  if (!isRecord(value)) return null
  const { file, midi, voice, layer, bytes, tune } = value
  if (typeof file !== 'string' || typeof layer !== 'string' || !layers.has(layer)) return null
  if (typeof bytes !== 'number') return null
  if (typeof midi !== 'number' && typeof voice !== 'string') return null
  return {
    file,
    layer,
    bytes,
    tune: typeof tune === 'number' ? tune : 0,
    ...(typeof midi === 'number' ? { midi } : {}),
    ...(typeof voice === 'string' ? { voice } : {}),
  }
}

/** A manifest read from its JSON; null where it is not one, or one of its files is wrong. */
export function parseManifest(value: unknown): SampleManifest | null {
  if (!isRecord(value)) return null
  const { instrument, set, licence, layers, samples } = value
  if (typeof instrument !== 'string' || typeof set !== 'string' || typeof licence !== 'string')
    return null
  if (!Array.isArray(layers) || !Array.isArray(samples)) return null
  const read = layers.map(layerOf)
  if (read.length === 0 || read.some((layer) => layer === null)) return null
  const named = read as SampleLayer[]
  const names = new Set(named.map((layer) => layer.name))
  const files = samples.map((sample) => fileOf(sample, names))
  if (files.some((file) => file === null)) return null
  return { instrument, set, licence, layers: named, samples: files as SampleFile[] }
}

/** The layer a velocity (0 to 1) strikes: the first whose bound is above it, else the loudest. */
export function layerFor(layers: readonly SampleLayer[], velocity: number): SampleLayer {
  const found = layers.find((layer) => velocity < layer.upTo) ?? layers.at(-1)
  if (!found) throw new Error('A manifest has at least one layer')
  return found
}
