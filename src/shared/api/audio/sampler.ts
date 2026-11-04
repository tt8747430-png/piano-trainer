import type { Midi } from '@/shared/lib/music'
import type { SampleLoader } from './sample-loader'
import { layerFor, type SampleFile, type SampleLayer, type SampleManifest } from './sample-manifest'

/** A key of a pitched instrument, or a kit's piece by its name. */
export type SamplerKey = Midi | string

/** A sound a sampler started: its source and the gain it leaves by. */
export interface SamplerVoice {
  readonly source: AudioBufferSourceNode
  readonly output: GainNode
  /** Its damper falls at `at`: it dies away over `seconds` (the instrument's own release if none). */
  release(at: number, seconds?: number): void
}

/**
 * A recorded instrument played from its set (R29 SND, A27; our own, ADR 0034): a pitched key from its
 * nearest root (at most a semitone off where roots are a minor third apart), a kit's piece by its
 * name, the velocity picking the layer and scaling the gain inside it.
 */
export interface Sampler {
  /** Resolves when the set's manifest is read: false where it cannot be had. */
  loaded(): Promise<boolean>
  /** Whether the layer a key and velocity strike is decoded. */
  ready(key: SamplerKey, velocity: number): boolean
  /** Loads the layer a key and velocity strike. */
  need(key: SamplerKey, velocity: number): Promise<void>
  /**
   * Starts a key at `at` into `destination`, `gain` loud: from the layer its velocity strikes, or a
   * loaded layer of the same root while that one loads; null while none is (it starts loading).
   */
  start(
    key: SamplerKey,
    velocity: number,
    at: number,
    gain: number,
    destination: AudioNode,
  ): SamplerVoice | null
}

/**
 * How long a piano's damper takes to silence a string (A27): 0.6 s at C3 and below, 0.25 s at C5
 * and above, in a line between.
 */
export function pianoRelease(key: Midi): number {
  const low = 48
  const high = 72
  if (key <= low) return 0.6
  if (key >= high) return 0.25
  return 0.6 - ((key - low) / (high - low)) * 0.35
}

/** How fast a choked or re-struck voice dies away. */
const CUT = 0.05
/** A voice's level at the bottom of its layer, against 1 at the top. */
const LAYER_FLOOR = 0.55

/** The level inside a layer: its softest velocity at `LAYER_FLOOR`, its loudest at 1. */
function levelIn(layers: readonly SampleLayer[], layer: SampleLayer, velocity: number): number {
  const below = layers[layers.indexOf(layer) - 1]?.upTo ?? 0
  const span = layer.upTo - below
  const place = span > 0 ? Math.min(1, Math.max(0, (velocity - below) / span)) : 1
  return LAYER_FLOOR + (1 - LAYER_FLOOR) * place
}

/** The file of `layer` that plays `key`: a kit's piece by name, else the nearest root. */
function fileFor(
  samples: readonly SampleFile[],
  layer: string,
  key: SamplerKey,
): SampleFile | undefined {
  const inLayer = samples.filter((sample) => sample.layer === layer)
  if (typeof key === 'string') return inLayer.find((sample) => sample.voice === key)
  let best: SampleFile | undefined
  for (const sample of inLayer) {
    if (sample.midi === undefined) continue
    if (!best || Math.abs(sample.midi - key) < Math.abs((best.midi ?? 0) - key)) best = sample
  }
  return best
}

/** The layers to try for a velocity: its own, then the others by how near they are to it. */
function layersFrom(layers: readonly SampleLayer[], own: SampleLayer): readonly SampleLayer[] {
  const at = layers.indexOf(own)
  return layers.toSorted(
    (a, b) => Math.abs(layers.indexOf(a) - at) - Math.abs(layers.indexOf(b) - at),
  )
}

export function createSampler(
  context: BaseAudioContext,
  loader: SampleLoader,
  instrument: string,
  {
    release = () => CUT,
    chokes = {},
    oneVoiceAKey = true,
  }: {
    /** How long a key's damper takes once released, in seconds. */
    release?: (key: Midi) => number
    /** The pieces each piece's stroke silences (a closed hat the open one). */
    chokes?: Readonly<Record<string, readonly string[]>>
    /** Whether a key struck again releases the voice still ringing on it (a string); a kit's do not. */
    oneVoiceAKey?: boolean
  } = {},
): Sampler {
  let manifest: SampleManifest | null = null
  const read = loader.manifest(instrument).then((found) => {
    manifest = found
    return found !== null
  })
  /** The voice last started on each key, and when it stops (Infinity until it is released). */
  const ringing = new Map<SamplerKey, { voice: SamplerVoice; stops: number }>()

  const urlOf = (sample: SampleFile) => loader.urlOf(instrument, sample.file)
  const wanted = (key: SamplerKey, velocity: number) =>
    manifest ? fileFor(manifest.samples, layerFor(manifest.layers, velocity).name, key) : undefined

  /** Releases the voice ringing on `key` at `at`, if it still rings then. */
  const cut = (key: SamplerKey, at: number) => {
    const held = ringing.get(key)
    if (held && held.stops > at) held.voice.release(at, CUT)
  }

  return {
    loaded: () => read,
    ready(key, velocity) {
      const sample = wanted(key, velocity)
      return sample !== undefined && loader.buffer(urlOf(sample)) !== null
    },
    async need(key, velocity) {
      if (!(await read)) return
      const sample = wanted(key, velocity)
      if (sample) await loader.load(urlOf(sample))
    },
    start(key, velocity, at, gain, destination) {
      if (!manifest) return null
      const own = layerFor(manifest.layers, velocity)
      const ownFile = fileFor(manifest.samples, own.name, key)
      if (ownFile && !loader.buffer(urlOf(ownFile))) void loader.load(urlOf(ownFile))
      let chosen: { sample: SampleFile; buffer: AudioBuffer } | undefined
      for (const layer of layersFrom(manifest.layers, own)) {
        const sample = fileFor(manifest.samples, layer.name, key)
        const buffer = sample ? loader.buffer(urlOf(sample)) : null
        if (sample && buffer) {
          chosen = { sample, buffer }
          break
        }
      }
      if (!chosen) return null
      if (oneVoiceAKey) cut(key, at)
      for (const choked of chokes[String(key)] ?? []) cut(choked, at)

      const source = context.createBufferSource()
      source.buffer = chosen.buffer
      const semitones =
        typeof key === 'number' && chosen.sample.midi !== undefined ? key - chosen.sample.midi : 0
      source.playbackRate.value = 2 ** (semitones / 12 + chosen.sample.tune / 1200)
      const output = context.createGain()
      output.gain.value = gain * levelIn(manifest.layers, own, velocity)
      source.connect(output).connect(destination)
      source.start(at)
      const held = {
        stops: Infinity,
        voice: {
          source,
          output,
          release(when: number, seconds = typeof key === 'number' ? release(key) : CUT) {
            if (when >= held.stops) return
            held.stops = when + seconds
            output.gain.cancelScheduledValues(when)
            // Five time constants: under 1 % of its level by the end.
            output.gain.setTargetAtTime(0, when, seconds / 5)
            source.stop(when + seconds)
          },
        },
      }
      ringing.set(key, held)
      return held.voice
    },
  }
}
