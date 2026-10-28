import { describe, expect, it } from 'vitest'
import { isZip, MxlError, unzipMusicXml } from './mxl'

/** A ZIP archive of files, each deflated or stored (no CRC: the reader does not check one). */
async function zip(
  files: { name: string; text: string; deflate?: boolean }[],
): Promise<Uint8Array> {
  const parts: number[] = []
  const directory: number[] = []
  const u16 = (n: number) => [n & 0xff, (n >> 8) & 0xff]
  const u32 = (n: number) => [...u16(n & 0xffff), ...u16(n >>> 16)]
  for (const file of files) {
    const name = [...new TextEncoder().encode(file.name)]
    const raw = new TextEncoder().encode(file.text)
    const data = file.deflate
      ? new Uint8Array(
          await new Response(
            new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw')),
          ).arrayBuffer(),
        )
      : raw
    const method = file.deflate ? 8 : 0
    const local = parts.length
    parts.push(...u32(0x04034b50), ...u16(20), ...u16(0), ...u16(method), ...u32(0), ...u32(0))
    parts.push(...u32(data.length), ...u32(raw.length), ...u16(name.length), ...u16(0), ...name)
    parts.push(...data)
    directory.push(...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0), ...u16(method))
    directory.push(...u32(0), ...u32(0), ...u32(data.length), ...u32(raw.length))
    directory.push(...u16(name.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0))
    directory.push(...u32(local), ...name)
  }
  const offset = parts.length
  const end = [...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length)]
  end.push(...u32(directory.length), ...u32(offset), ...u16(0))
  return new Uint8Array([...parts, ...directory, ...end])
}

const CONTAINER = `<?xml version="1.0"?><container><rootfiles><rootfile full-path="score/song.musicxml"/></rootfiles></container>`

describe('unzipMusicXml', () => {
  it('reads the score the container names, deflated', async () => {
    const bytes = await zip([
      { name: 'META-INF/container.xml', text: CONTAINER, deflate: true },
      { name: 'other.xml', text: '<other/>' },
      { name: 'score/song.musicxml', text: '<score-partwise/>', deflate: true },
    ])
    expect(isZip(bytes)).toBe(true)
    await expect(unzipMusicXml(bytes)).resolves.toBe('<score-partwise/>')
  })

  it('reads the one score in an archive with no container', async () => {
    const bytes = await zip([{ name: 'song.xml', text: '<score-timewise/>' }])
    await expect(unzipMusicXml(bytes)).resolves.toBe('<score-timewise/>')
  })

  it('refuses an archive with no score, and bytes that are no archive', async () => {
    await expect(unzipMusicXml(await zip([{ name: 'a.txt', text: 'x' }]))).rejects.toThrow(MxlError)
    expect(isZip(new TextEncoder().encode('<xml/>'))).toBe(false)
    await expect(unzipMusicXml(new Uint8Array([1, 2, 3]))).rejects.toThrow(MxlError)
  })
})
