import { parseManifest, type SampleManifest } from './sample-manifest'

/** Fetches a file's bytes; null where it cannot be had (offline before the cache, a test). */
export type FetchBytes = (url: string) => Promise<ArrayBuffer | null>
/** Fetches a JSON file; null where it cannot be had. */
export type FetchJson = (url: string) => Promise<unknown>

const fetchArrayBuffer: FetchBytes = async (url) => {
  if (typeof fetch !== 'function') return null
  try {
    const response = await fetch(url)
    return response.ok ? await response.arrayBuffer() : null
  } catch {
    return null
  }
}

const fetchParsed: FetchJson = async (url) => {
  if (typeof fetch !== 'function') return null
  try {
    const response = await fetch(url)
    return response.ok ? await response.json() : null
  } catch {
    return null
  }
}

/** The recorded instruments' decoded audio may hold this much at most (A27): 80 MB. */
export const DECODED_BUDGET = 80 * 1024 * 1024

/** Where the sets are served from: `public/samples/<instrument>/`. */
export const SAMPLES_BASE = '/samples/'

/** What a decoded buffer holds in memory: 4 bytes a sample, each channel. */
export const decodedBytes = (buffer: AudioBuffer) => buffer.length * buffer.numberOfChannels * 4

/**
 * Every recorded instrument's files, for one audio context (R29 SND, A27): a set's manifest read once,
 * a file fetched and decoded when first needed, and the decoded buffers kept under one budget across
 * every instrument, the least recently struck freed first.
 */
export interface SampleLoader {
  /** A set's manifest (`<base><instrument>/manifest.json`); null where it cannot be had. */
  manifest(instrument: string): Promise<SampleManifest | null>
  /** A file's URL in its set's folder. */
  urlOf(instrument: string, file: string): string
  /** A file's decoded buffer, struck now; null while it is not loaded. */
  buffer(url: string): AudioBuffer | null
  /** Fetches and decodes a file, once; null where it cannot be had (asked again next time). */
  load(url: string): Promise<AudioBuffer | null>
  /** Fetches files one at a time into the browser's cache, decoding none (the grand's other layers). */
  prefetch(urls: readonly string[]): Promise<void>
  /** The bytes of decoded audio held now. */
  decoded(): number
}

export function createSampleLoader({
  context,
  fetchBytes = fetchArrayBuffer,
  fetchJson = fetchParsed,
  budget = DECODED_BUDGET,
  base = SAMPLES_BASE,
}: {
  context: BaseAudioContext
  fetchBytes?: FetchBytes
  fetchJson?: FetchJson
  budget?: number
  base?: string
}): SampleLoader {
  /** The decoded buffers, the least recently struck first. */
  const buffers = new Map<string, AudioBuffer>()
  const loading = new Map<string, Promise<AudioBuffer | null>>()
  const manifests = new Map<string, Promise<SampleManifest | null>>()
  let bytes = 0

  const strike = (url: string, buffer: AudioBuffer) => {
    buffers.delete(url)
    buffers.set(url, buffer)
  }

  /** Frees the least recently struck buffers, never `keep`, until the decoded audio fits. */
  const fit = (keep: string) => {
    for (const [url, buffer] of buffers) {
      if (bytes <= budget) return
      if (url === keep) continue
      buffers.delete(url)
      bytes -= decodedBytes(buffer)
    }
  }

  const decode = async (url: string): Promise<AudioBuffer | null> => {
    const file = await fetchBytes(url)
    if (!file) return null
    try {
      const buffer = await context.decodeAudioData(file)
      strike(url, buffer)
      bytes += decodedBytes(buffer)
      fit(url)
      return buffer
    } catch {
      return null
    }
  }

  return {
    manifest(instrument) {
      const kept = manifests.get(instrument)
      if (kept) return kept
      const read = fetchJson(`${base}${instrument}/manifest.json`).then((json) => {
        const manifest = parseManifest(json)
        // A manifest that cannot be had is asked for again next time.
        if (!manifest) manifests.delete(instrument)
        return manifest
      })
      manifests.set(instrument, read)
      return read
    },
    urlOf: (instrument, file) => `${base}${instrument}/${file}`,
    buffer(url) {
      const buffer = buffers.get(url)
      if (!buffer) return null
      strike(url, buffer)
      return buffer
    },
    load(url) {
      const buffer = buffers.get(url)
      if (buffer) return Promise.resolve(buffer)
      const pending = loading.get(url)
      if (pending) return pending
      const loaded = decode(url).finally(() => loading.delete(url))
      loading.set(url, loaded)
      return loaded
    },
    async prefetch(urls) {
      for (const url of urls) if (!buffers.has(url)) await fetchBytes(url)
    },
    decoded: () => bytes,
  }
}
