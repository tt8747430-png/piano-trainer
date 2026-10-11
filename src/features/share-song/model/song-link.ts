import { readSharedSong, type SharedSong } from '@/entities/piece'

/** The link's format: a later one is a later app's, read as no song. */
const FORMAT = 1

/** Where a shared song opens. */
export const SHARED_SONG_PATH = '/songs/shared'

const streamOf = (bytes: Uint8Array<ArrayBuffer>) =>
  new ReadableStream<BufferSource>({
    start(controller) {
      controller.enqueue(bytes)
      controller.close()
    },
  })

/** The most a link's text may hold, and the most its song may inflate to: far more than any song. */
const LINK_LIMIT = 64 * 1024
const SONG_LIMIT = 1024 * 1024

/** Bytes as base64url, a chunk at a time: spread whole, a long song's bytes overflow the stack. */
function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (let at = 0; at < bytes.length; at += 0x8000)
    binary += String.fromCharCode(...bytes.subarray(at, at + 0x8000))
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

const fromBase64Url = (text: string) =>
  Uint8Array.from(atob(text.replaceAll('-', '+').replaceAll('_', '/')), (char) =>
    char.charCodeAt(0),
  )

/**
 * A song as a link's text: its title and music in JSON, deflated, in base64url; null for a song too
 * long for a link, which `readSongLink` would read as none.
 */
export async function songLinkData(song: SharedSong): Promise<string | null> {
  const json = JSON.stringify({ v: FORMAT, t: song.title, m: song.music })
  const deflated = streamOf(new TextEncoder().encode(json)).pipeThrough(
    new CompressionStream('deflate-raw'),
  )
  const data = toBase64Url(new Uint8Array(await new Response(deflated).arrayBuffer()))
  return data.length > LINK_LIMIT ? null : data
}

/** A stream's text, or null once it passes `limit` bytes: a crafted link cannot inflate without end. */
async function textUpTo(stream: ReadableStream<Uint8Array>, limit: number): Promise<string | null> {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > limit) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  const whole = new Uint8Array(size)
  let at = 0
  for (const chunk of chunks) {
    whole.set(chunk, at)
    at += chunk.byteLength
  }
  return new TextDecoder().decode(whole)
}

/**
 * A link's text read back as a song, or null where it holds none: cut short, changed, or of another
 * format. What it holds is read as the pieces store reads a save (`readSharedSong`).
 */
export async function readSongLink(data: string): Promise<SharedSong | null> {
  if (data.length > LINK_LIMIT) return null
  try {
    const inflated = streamOf(fromBase64Url(data)).pipeThrough(
      new DecompressionStream('deflate-raw'),
    )
    const text = await textUpTo(inflated, SONG_LIMIT)
    if (text === null) return null
    const file: unknown = JSON.parse(text)
    if (typeof file !== 'object' || file === null || !('v' in file) || file.v !== FORMAT)
      return null
    const { t, m } = file as { t?: unknown; m?: unknown }
    return readSharedSong(typeof m === 'object' && m !== null ? { ...m, title: t } : null)
  } catch {
    return null
  }
}
