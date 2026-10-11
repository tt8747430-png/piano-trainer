import { describe, expect, it } from 'vitest'
import { entryTitles } from './titles'

const bz5 = { title: 'Мир, душа, храни', titleEn: 'Still, my soul, be still' }
const silent = { title: 'Silent Night', titleRu: 'Тихая ночь' }
const ode = { title: 'Ode to Joy' }

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

  it('shows Russian a hymn’s Russian title over the printed one, and English the printed', () => {
    expect(entryTitles(silent, 'ru')).toEqual({ primary: 'Тихая ночь', secondary: 'Silent Night' })
    expect(entryTitles(silent, 'en')).toEqual({ primary: 'Silent Night' })
  })

  it('shows a title with no translation as it is, in both languages', () => {
    expect(entryTitles(ode, 'en')).toEqual({ primary: 'Ode to Joy' })
    expect(entryTitles(ode, 'ru')).toEqual({ primary: 'Ode to Joy' })
  })
})
