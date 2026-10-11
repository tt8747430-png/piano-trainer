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

const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '')

const fromBase64Url = (text: string) =>
  Uint8Array.from(atob(text.replaceAll('-', '+').replaceAll('_', '/')), (char) =>
    char.charCodeAt(0),
  )

/** A song as a link's text: its title and music in JSON, deflated, in base64url. */
export async function songLinkData(song: SharedSong): Promise<string> {
  const json = JSON.stringify({ v: FORMAT, t: song.title, m: song.music })
  const deflated = streamOf(new TextEncoder().encode(json)).pipeThrough(
    new CompressionStream('deflate-raw'),
  )
  return toBase64Url(new Uint8Array(await new Response(deflated).arrayBuffer()))
}

/**
 * A link's text read back as a song, or null where it holds none: cut short, changed, or of another
 * format. What it holds is read as the pieces store reads a save (`readSharedSong`).
 */
export async function readSongLink(data: string): Promise<SharedSong | null> {
  try {
    const inflated = streamOf(fromBase64Url(data)).pipeThrough(
      new DecompressionStream('deflate-raw'),
    )
    const file: unknown = JSON.parse(await new Response(inflated).text())
    if (typeof file !== 'object' || file === null || !('v' in file) || file.v !== FORMAT)
      return null
    const { t, m } = file as { t?: unknown; m?: unknown }
    return readSharedSong(typeof m === 'object' && m !== null ? { ...m, title: t } : null)
  } catch {
    return null
  }
}
