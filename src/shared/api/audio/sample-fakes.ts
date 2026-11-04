import { createSampleLoader, type SampleLoader } from './sample-loader'
import type { SampleManifest } from './sample-manifest'

/**
 * Test doubles for the recorded instruments: an audio context with just enough to see what a sampler
 * builds, and a loader whose every file decodes to a buffer named by its URL.
 */
export class SamplerContext {
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

  async decodeAudioData(bytes: ArrayBuffer): Promise<AudioBuffer> {
    const name = new TextDecoder().decode(bytes)
    return { length: 44_100, numberOfChannels: 1, duration: 1, name } as unknown as AudioBuffer
  }

  createBufferSource() {
    const source = {
      buffer: null as AudioBuffer | null,
      playbackRate: { value: 1 },
      started: -1,
      stopped: -1,
      onended: null as (() => void) | null,
      connect: (next: unknown) => next,
      disconnect: () => undefined,
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
        setValueAtTime: () => undefined,
        cancelScheduledValues: () => undefined,
        setTargetAtTime: (value: number, at: number, constant: number) =>
          void record.targets.push({ value, at, constant }),
      },
      connect: (next: unknown) => next,
      disconnect: () => undefined,
    }
  }
}

/** The URL a fake buffer was decoded from. */
export const sampleNameOf = (buffer: AudioBuffer | null | undefined) =>
  (buffer as unknown as { name: string } | null | undefined)?.name

const ROOTS = Array.from({ length: 30 }, (_, index) => 21 + index * 3)

/** A pitched set of 30 roots every minor third from A0, in `layers` (bounded as the grand's). */
export function pitchedSet(instrument: string, layers: readonly string[]): SampleManifest {
  return {
    instrument,
    set: instrument,
    licence: 'CC0-1.0',
    layers: layers.map((name, index) => ({
      name,
      upTo: index === layers.length - 1 ? 1 : ([0.35, 0.6, 0.85][index] ?? 1),
    })),
    samples: layers.flatMap((layer) =>
      ROOTS.map((root) => ({ file: `${layer}/${root}.m4a`, midi: root, layer, bytes: 1, tune: 0 })),
    ),
  }
}

/** A kit with every piece named, in a normal and an accented layer. */
export function kitSet(pieces: readonly string[]): SampleManifest {
  return {
    instrument: 'drums',
    set: 'drums',
    licence: 'CC0-1.0',
    layers: [
      { name: 'normal', upTo: 0.8 },
      { name: 'accent', upTo: 1 },
    ],
    samples: pieces.flatMap((voice) =>
      ['normal', 'accent'].map((layer) => ({
        file: `${layer}/${voice}.m4a`,
        voice,
        layer,
        bytes: 1,
        tune: 0,
      })),
    ),
  }
}

/** A loader over `manifests` by folder; every file it lists decodes, any other cannot be had. */
export function loaderOver(
  context: SamplerContext,
  manifests: Readonly<Record<string, SampleManifest>>,
): SampleLoader {
  return createSampleLoader({
    context: context as unknown as BaseAudioContext,
    fetchJson: async (url) => manifests[url.split('/')[2] ?? ''] ?? null,
    fetchBytes: async (url) => new TextEncoder().encode(url).buffer,
  })
}
