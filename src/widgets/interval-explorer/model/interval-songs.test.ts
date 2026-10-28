import { describe, expect, it } from 'vitest'
import { LOCALES } from '@/shared/i18n'
import { INTERVAL_ROWS } from './interval-rows'
import { intervalSongs } from './interval-songs'

describe('the songs an interval is known by', () => {
  it('names a song rising and one falling for every interval within the octave, in both languages', () => {
    for (const name of INTERVAL_ROWS.simple) {
      const songs = intervalSongs(name)
      for (const locale of LOCALES) {
        expect(songs?.up[locale].length, `${name} up in ${locale}`).toBeGreaterThan(0)
        if (name !== 'r')
          expect(songs?.down?.[locale].length, `${name} down in ${locale}`).toBeGreaterThan(0)
      }
    }
  })

  it('hears the unison once: a note repeated neither rises nor falls', () => {
    expect(intervalSongs('r')?.down).toBeUndefined()
  })

  it('gives the tritone the same songs by either spelling', () => {
    expect(intervalSongs('A4')).toBe(intervalSongs('d5'))
  })

  it('names none past the octave', () => {
    for (const name of INTERVAL_ROWS.compound) expect(intervalSongs(name)).toBeUndefined()
  })
})
