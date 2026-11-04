import { SAMPLE_SETS } from './instruments'
import { SAMPLES_BASE, type FetchJson } from './sample-loader'
import { parseManifest } from './sample-manifest'

/**
 * The cache the service worker keeps the grand piano's files in as they are first played (A27,
 * `vite.config.ts`): Storage and backup fills it all at once, and empties it.
 */
export const PIANO_CACHE = 'samples-piano'

/** How much of the grand this device keeps, in bytes, of all of it. */
export interface PianoKept {
  readonly kept: number
  readonly total: number
}

/** The grand piano's files on this device (Settings › Storage and backup, A27). */
export interface PianoDownload {
  /** How much is kept; null where the browser keeps no caches or the manifest cannot be had. */
  measure(): Promise<PianoKept | null>
  /**
   * Fetches every file not kept into the cache, one at a time, `progress` told the share kept (0 to
   * 1) at the start and after each; false where any could not be had (what came is kept).
   */
  download(progress: (kept: number) => void): Promise<boolean>
  /** Removes every file of the grand from the device. */
  remove(): Promise<void>
}

const browserCaches = (): CacheStorage | undefined =>
  typeof caches === 'undefined' ? undefined : caches

const fetchManifest: FetchJson = async (url) => {
  try {
    const response = await fetch(url)
    return response.ok ? await response.json() : null
  } catch {
    return null
  }
}

const fetchWhole = (url: string) => fetch(url)

export function createPianoDownload({
  caches = browserCaches(),
  fetchJson = fetchManifest,
  fetchFile = fetchWhole,
}: {
  caches?: CacheStorage | undefined
  fetchJson?: FetchJson
  fetchFile?: (url: string) => Promise<Response>
} = {}): PianoDownload {
  const folder = `${SAMPLES_BASE}${SAMPLE_SETS.piano}/`

  /** The grand's files by URL path with their sizes, and the paths the cache holds. */
  const read = async () => {
    if (!caches) return null
    const manifest = parseManifest(await fetchJson(`${folder}manifest.json`))
    if (!manifest) return null
    const cache = await caches.open(PIANO_CACHE)
    const held = new Set((await cache.keys()).map((request) => new URL(request.url).pathname))
    const files = manifest.samples.map((sample) => ({
      url: `${folder}${sample.file}`,
      bytes: sample.bytes,
    }))
    return { cache, held, files }
  }

  const keptOf = (files: readonly { url: string; bytes: number }[], held: ReadonlySet<string>) => ({
    kept: files.filter((file) => held.has(file.url)).reduce((sum, file) => sum + file.bytes, 0),
    total: files.reduce((sum, file) => sum + file.bytes, 0),
  })

  return {
    async measure() {
      const found = await read()
      return found && keptOf(found.files, found.held)
    },
    async download(progress) {
      const found = await read()
      if (!found) return false
      const { cache, held, files } = found
      const { total, kept: before } = keptOf(files, held)
      let kept = before
      progress(total > 0 ? kept / total : 1)
      let whole = true
      for (const file of files) {
        if (held.has(file.url)) continue
        try {
          const response = await fetchFile(file.url)
          if (!response.ok) throw new Error(file.url)
          await cache.put(file.url, response)
          kept += file.bytes
          progress(kept / total)
        } catch {
          whole = false
        }
      }
      return whole
    },
    async remove() {
      await caches?.delete(PIANO_CACHE)
    },
  }
}
