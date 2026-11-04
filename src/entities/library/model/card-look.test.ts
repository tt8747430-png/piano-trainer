import { describe, expect, it } from 'vitest'
import { DEFAULT_STYLE } from '@/shared/lib/style'
import { DEFAULT_CARD_LOOK, sanitiseCardLook, sanitiseCardLooks } from './card-look'

describe('a folder’s card look (R29 B9)', () => {
  it('reads what is valid and the default for the rest', () => {
    expect(
      sanitiseCardLook({
        style: { radius: 4, border: 9, surface: 'url(evil)' },
        show: { key: false, chords: 'yes' },
        density: 'large',
      }),
    ).toEqual({
      style: { ...DEFAULT_STYLE, radius: 4 },
      show: { key: false, chords: true, progress: true },
      density: 'large',
    })
  })

  it('a save that is not an object reads as the default', () => {
    expect(sanitiseCardLook('pink')).toEqual(DEFAULT_CARD_LOOK)
  })

  it('keeps the looks of places that can be named, and drops the rest', () => {
    const looks = sanitiseCardLooks(
      { home: { density: 'compact' }, 'folder-2': {}, 'nowhere!': {}, hymns: null },
      (place): place is string => place === 'home' || place === 'folder-2' || place === 'hymns',
    )
    expect(Object.keys(looks).sort()).toEqual(['folder-2', 'home', 'hymns'])
    expect(looks.home?.density).toBe('compact')
    expect(looks.hymns).toEqual(DEFAULT_CARD_LOOK)
  })
})
