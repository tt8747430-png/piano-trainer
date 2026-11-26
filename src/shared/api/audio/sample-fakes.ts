import { createSampleLoader, type SampleLoader } from './sample-loader'
import type { SampleManifest } from './sample-manifest'

/**
 * Test doubles for the recorded instruments: an audio context with just enough to see what a sampler
 * builds, and a loader whose every file decodes to a buffer named by its URL.
 */
/** A decoded second of silence that knows the URL it was decoded from. */
class NamedBuffer implements AudioBuffer {
  readonly length = 44_100
  readonly numberOfChannels = 1
  readonly duration = 1
  readonly sampleRate = 44_100

  constructor(readonly name: string) {}

  getChannelData(): Float32Array<ArrayBuffer> {
    return new Float32Array(this.length)
  }

  copyFromChannel(): void {}

  copyToChannel(): void {}
}

/** A buffer source as the fake context records it. */
interface FakeSource {
  buffer: AudioBuffer | null
  playbackRate: { value: number }
  started: number
  stopped: number
  onended: (() => void) | null
}

/** A gain as the fake context records it: its level and each target set on it. */
interface FakeGain {
  value: number
  targets: { value: number; at: number; constant: number }[]
}

export class SamplerContext {
  currentTime = 0
  readonly destination = {}
  readonly sources: FakeSource[] = []
  readonly gains: FakeGain[] = []

  async decodeAudioData(bytes: ArrayBuffer): Promise<AudioBuffer> {
    return new NamedBuffer(new TextDecoder().decode(bytes))
  }

  createBufferSource() {
    const played: FakeSource = {
      buffer: null,
      playbackRate: { value: 1 },
      started: -1,
      stopped: -1,
      onended: null,
    }
    const source = Object.assign(played, {
      connect: (next: unknown) => next,
      disconnect: () => undefined,
      start(at: number) {
        played.started = at
      },
      stop(at: number) {
        played.stopped = at
      },
    })
    this.sources.push(source)
    return source
  }

  createGain() {
    const record: FakeGain = { value: 1, targets: [] }
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
  buffer instanceof NamedBuffer ? buffer.name : undefined

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
    context,
    fetchJson: async (url) => manifests[url.split('/')[2] ?? ''] ?? null,
    fetchBytes: async (url) => new TextEncoder().encode(url).buffer,
  })
}
