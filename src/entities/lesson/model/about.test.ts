import { describe, expect, it } from 'vitest'
import { DEFAULT_STYLE } from '@/shared/lib/style'
import { hasAbout, imageSource, readAbout } from './about'

const text = (en: string) => ({ en, ru: en })

describe('an About document', () => {
  it('reads sections of headings and blocks, each style sanitised', () => {
    const about = readAbout([
      {
        heading: text('Why'),
        style: { radius: 9, surface: 'url(x)', extra: 1 },
        blocks: [{ kind: 'text', text: text('Because'), style: { radius: 4, border: 2 } }],
      },
    ])
    expect(about).toEqual([
      {
        heading: text('Why'),
        style: DEFAULT_STYLE,
        blocks: [
          {
            kind: 'text',
            text: text('Because'),
            style: { ...DEFAULT_STYLE, radius: 4, border: 2 },
          },
        ],
      },
    ])
  })

  it('reads nothing that is not a list of sections', () => {
    expect(readAbout(undefined)).toBeUndefined()
    expect(readAbout({ heading: text('x') })).toBeUndefined()
    expect(readAbout([{ heading: 'x', blocks: [] }])).toBeUndefined()
    expect(readAbout([{ heading: text('x'), blocks: [{ text: 'no kind' }] }])).toBeUndefined()
  })

  it('keeps a picture only by an https address', () => {
    expect(imageSource('https://example.com/a.webp')).toBe('https://example.com/a.webp')
    expect(imageSource('http://example.com/a.webp')).toBeNull()
    expect(imageSource('javascript:alert(1)')).toBeNull()
    expect(imageSource('https://exa mple.com')).toBeNull()
  })

  it('is there once a section has a heading or a block', () => {
    expect(hasAbout(undefined)).toBe(false)
    expect(hasAbout([{ heading: text(''), blocks: [] }])).toBe(false)
    expect(hasAbout([{ heading: text('Why'), blocks: [] }])).toBe(true)
  })
})
