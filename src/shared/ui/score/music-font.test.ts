import { describe, expect, it, vi } from 'vitest'
import { stubFonts } from '@/shared/test/fonts'
import { CHORD_SYMBOL_FONT } from './chord-symbols'
import { loadMusicFonts } from './music-font'

describe('loadMusicFonts', () => {
  it('waits for the music font, the fingering face and the chord symbols’ face', async () => {
    const load = vi.spyOn(document.fonts, 'load')
    await loadMusicFonts()
    expect(load.mock.calls.map(([font]) => font)).toEqual([
      '30px Bravura',
      '12px "Onest Variable"',
      CHORD_SYMBOL_FONT,
    ])
  })

  it('fails when the music font does not load', async () => {
    stubFonts({ loads: false })
    await expect(loadMusicFonts()).rejects.toThrow()
  })
})
