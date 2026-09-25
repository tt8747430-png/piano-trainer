import { describe, expect, it } from 'vitest'
import { collectLocalTexts } from './local-texts'

describe('collectLocalTexts', () => {
  it('finds every { en, ru } at any depth, with its path', () => {
    const content = {
      name: { en: 'Hymns', ru: 'Гимны' },
      entries: [{ note: { en: 'Slowly.', ru: '' } }, { title: 'Ode to Joy' }],
    }
    expect(collectLocalTexts(content)).toEqual([
      { path: 'name', text: { en: 'Hymns', ru: 'Гимны' } },
      { path: 'entries.0.note', text: { en: 'Slowly.', ru: '' } },
    ])
  })

  it('ignores objects that are not a text in both languages', () => {
    expect(collectLocalTexts({ a: { en: 'only' }, b: { en: 1, ru: 2 }, c: null })).toEqual([])
  })

  it('names the root path it was given', () => {
    expect(collectLocalTexts({ en: 'a', ru: 'б' }, 'pattern')).toEqual([
      { path: 'pattern', text: { en: 'a', ru: 'б' } },
    ])
  })
})
