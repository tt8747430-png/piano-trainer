import { afterEach, describe, expect, it, vi } from 'vitest'
import { downloadFile } from './download-file'

describe('downloadFile', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('saves the bytes as a file of its name, and lets the address go once the save has begun', () => {
    vi.useFakeTimers()
    const files: Blob[] = []
    const revoked: string[] = []
    // jsdom has no object URLs.
    vi.stubGlobal(
      'URL',
      class extends URL {
        static override createObjectURL = (file: Blob) => {
          files.push(file)
          return 'blob:take'
        }
        static override revokeObjectURL = (url: string) => {
          revoked.push(url)
        }
      },
    )
    const clicked: HTMLAnchorElement[] = []
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      clicked.push(this)
    })
    downloadFile(Uint8Array.from([1, 2, 3]), 'Take.mid', 'audio/midi')
    expect(clicked).toHaveLength(1)
    expect(clicked[0]?.download).toBe('Take.mid')
    expect(clicked[0]?.getAttribute('href')).toBe('blob:take')
    expect(clicked[0]?.isConnected).toBe(false)
    expect(files[0]?.type).toBe('audio/midi')
    expect(files[0]?.size).toBe(3)
    expect(revoked).toEqual([])
    vi.runAllTimers()
    expect(revoked).toEqual(['blob:take'])
  })
})
