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

/** A file's bytes, inflated where they are compressed. */
async function contentOf(bytes: Uint8Array, entry: Entry): Promise<Uint8Array> {
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
