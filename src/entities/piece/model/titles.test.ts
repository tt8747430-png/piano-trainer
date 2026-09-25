import { describe, expect, it } from 'vitest'
import { entryTitles } from './titles'

const bz5 = { title: 'Мир, душа, храни', titleEn: 'Still, my soul, be still' }
const silent = { title: 'Silent Night' }

describe('entryTitles', () => {
  it('shows English the English title over the printed one', () => {
    expect(entryTitles(bz5, 'en')).toEqual({
      primary: 'Still, my soul, be still',
      secondary: 'Мир, душа, храни',
    })
  })

  it('shows Russian the printed title alone', () => {
    expect(entryTitles(bz5, 'ru')).toEqual({ primary: 'Мир, душа, храни' })
  })

  it('shows a title printed in English as it is, in both languages', () => {
    expect(entryTitles(silent, 'en')).toEqual({ primary: 'Silent Night' })
    expect(entryTitles(silent, 'ru')).toEqual({ primary: 'Silent Night' })
  })
})
