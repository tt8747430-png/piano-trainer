// A compressed MusicXML file (.mxl): a ZIP archive whose META-INF/container.xml names the score in
// it. Read with the platform's own inflater (DecompressionStream), no package.

import { childAt, childrenOf, parseXml, XmlError } from './xml'

/** A ZIP archive that is no compressed MusicXML, or is broken. */
export class MxlError extends Error {
  override readonly name = 'MxlError'
}

const LOCAL_FILE = 0x04034b50
const CENTRAL_FILE = 0x02014b50
const END_OF_DIRECTORY = 0x06054b50
const STORED = 0
const DEFLATED = 8

/** Whether bytes begin as a ZIP archive does. */
export const isZip = (bytes: Uint8Array): boolean =>
  bytes.length >= 4 &&
  new DataView(bytes.buffer, bytes.byteOffset).getUint32(0, true) === LOCAL_FILE

interface Entry {
  readonly name: string
  readonly method: number
  readonly size: number
  readonly local: number
}

/** The archive's files, from its central directory. */
function entriesOf(bytes: Uint8Array): Entry[] {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let end = -1
  for (let at = bytes.length - 22; at >= Math.max(0, bytes.length - 22 - 0xffff); at -= 1) {
    if (view.getUint32(at, true) === END_OF_DIRECTORY) {
      end = at
      break
    }
  }
  if (end < 0) throw new MxlError('No ZIP directory')
  const count = view.getUint16(end + 10, true)
  let at = view.getUint32(end + 16, true)
  const decoder = new TextDecoder()
  const entries: Entry[] = []
  for (let i = 0; i < count; i += 1) {
    if (at + 46 > bytes.length || view.getUint32(at, true) !== CENTRAL_FILE)
      throw new MxlError('Broken ZIP directory')
    const nameLength = view.getUint16(at + 28, true)
    const extra = view.getUint16(at + 30, true)
    const comment = view.getUint16(at + 32, true)
    entries.push({
      method: view.getUint16(at + 10, true),
      size: view.getUint32(at + 20, true),
      local: view.getUint32(at + 42, true),
      name: decoder.decode(bytes.subarray(at + 46, at + 46 + nameLength)),
    })
    at += 46 + nameLength + extra + comment
  }
  return entries
}

/** A file's bytes, inflated where they are compressed: an MxlError where they are cut short or garbled. */
async function contentOf(bytes: Uint8Array, entry: Entry): Promise<Uint8Array> {
  try {
    return await inflatedOf(bytes, entry)
  } catch (error) {
    if (error instanceof MxlError) throw error
    // A header past the archive's end (RangeError), or data that does not inflate (TypeError).
    throw new MxlError('Broken ZIP data', { cause: error })
  }
}

async function inflatedOf(bytes: Uint8Array, entry: Entry): Promise<Uint8Array> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  if (view.getUint32(entry.local, true) !== LOCAL_FILE) throw new MxlError('Broken ZIP entry')
  const start =
    entry.local +
    30 +
    view.getUint16(entry.local + 26, true) +
    view.getUint16(entry.local + 28, true)
  const data = bytes.slice(start, start + entry.size)
  if (entry.method === STORED) return data
  if (entry.method !== DEFLATED) throw new MxlError(`ZIP method ${entry.method}`)
  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

/**
 * The MusicXML a compressed file holds: the score its container names (its first rootfile), else the
 * one .musicxml or .xml file outside META-INF.
 */
export async function unzipMusicXml(bytes: Uint8Array): Promise<string> {
  const entries = entriesOf(bytes)
  const decoder = new TextDecoder()
  const byName = new Map(entries.map((entry) => [entry.name, entry]))
  const container = byName.get('META-INF/container.xml')
  let path: string | undefined
  if (container) {
    try {
      const root = parseXml(decoder.decode(await contentOf(bytes, container)))
      const rootfiles = childAt(root, 'rootfiles')
      path = (rootfiles ? childrenOf(rootfiles, 'rootfile') : [])[0]?.attrs['full-path']
    } catch (error) {
      if (!(error instanceof XmlError)) throw error
    }
  }
  const score =
    (path === undefined ? undefined : byName.get(path)) ??
    entries.find(
      (entry) => !entry.name.startsWith('META-INF/') && /\.(musicxml|xml)$/i.test(entry.name),
    )
  if (!score) throw new MxlError('No score in the archive')
  return decoder.decode(await contentOf(bytes, score))
}

/** CRC-32 (IEEE), the checksum a ZIP entry carries. */
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff
  for (const byte of bytes) crc = (CRC_TABLE[(crc ^ byte) & 0xff] ?? 0) ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

const SCORE_PATH = 'score.musicxml'
const CONTAINER = `<?xml version="1.0" encoding="UTF-8"?>
<container><rootfiles><rootfile full-path="${SCORE_PATH}" media-type="application/vnd.recordare.musicxml+xml"/></rootfiles></container>
`

/**
 * A compressed MusicXML file (.mxl) of a score's text (R29 A29): a ZIP of `mimetype`,
 * `META-INF/container.xml` naming the score, and the score, each stored as it is (a song's text is
 * small; every reader takes stored entries).
 */
export function writeMxl(xml: string): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder()
  const files = [
    { name: 'mimetype', data: encoder.encode('application/vnd.recordare.musicxml') },
    { name: 'META-INF/container.xml', data: encoder.encode(CONTAINER) },
    { name: SCORE_PATH, data: encoder.encode(xml) },
  ].map((file) => ({ ...file, path: encoder.encode(file.name), crc: crc32(file.data) }))
  const local = files.reduce((sum, file) => sum + 30 + file.path.length + file.data.length, 0)
  const central = files.reduce((sum, file) => sum + 46 + file.path.length, 0)
  const out = new Uint8Array(local + central + 22)
  const view = new DataView(out.buffer)
  let at = 0
  const offsets: number[] = []
  for (const file of files) {
    offsets.push(at)
    view.setUint32(at, LOCAL_FILE, true)
    view.setUint16(at + 4, 20, true)
    view.setUint16(at + 8, STORED, true)
    view.setUint32(at + 14, file.crc, true)
    view.setUint32(at + 18, file.data.length, true)
    view.setUint32(at + 22, file.data.length, true)
    view.setUint16(at + 26, file.path.length, true)
    out.set(file.path, at + 30)
    out.set(file.data, at + 30 + file.path.length)
    at += 30 + file.path.length + file.data.length
  }
  const directory = at
  files.forEach((file, index) => {
    view.setUint32(at, CENTRAL_FILE, true)
    view.setUint16(at + 4, 20, true)
    view.setUint16(at + 6, 20, true)
    view.setUint16(at + 10, STORED, true)
    view.setUint32(at + 16, file.crc, true)
    view.setUint32(at + 20, file.data.length, true)
    view.setUint32(at + 24, file.data.length, true)
    view.setUint16(at + 28, file.path.length, true)
    view.setUint32(at + 42, offsets[index] ?? 0, true)
    out.set(file.path, at + 46)
    at += 46 + file.path.length
  })
  view.setUint32(at, END_OF_DIRECTORY, true)
  view.setUint16(at + 8, files.length, true)
  view.setUint16(at + 10, files.length, true)
  view.setUint32(at + 12, at - directory, true)
  view.setUint32(at + 16, directory, true)
  return out
}
