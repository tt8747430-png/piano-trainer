import { describe, expect, it } from 'vitest'
import { localText } from './local-text'

describe('localText', () => {
  it('reads the text in the learner’s language', () => {
    expect(localText({ en: 'Chorus', ru: 'Припев' }, 'ru')).toBe('Припев')
    expect(localText({ en: 'Chorus', ru: 'Припев' }, 'en')).toBe('Chorus')
  })
})
