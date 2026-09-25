import { describe, expect, it } from 'vitest'
import { foldText, matchesQuery } from './fold-text'

describe('foldText', () => {
  it('ignores case, accents and the dots on ё', () => {
    expect(foldText('Ёлочка')).toBe(foldText('елочка'))
    expect(foldText('Café')).toBe('cafe')
  })

  it('keeps й a letter of its own, not и with an accent', () => {
    expect(foldText('Мой')).toBe('мой')
    expect(foldText('Мой')).not.toBe(foldText('Мои'))
  })
})

describe('matchesQuery', () => {
  it('finds the query in any field', () => {
    expect(matchesQuery(['Мир, душа, храни', 'Still, my soul'], 'ДУША')).toBe(true)
    expect(matchesQuery(['Silent Night'], 'night')).toBe(true)
    expect(matchesQuery(['Silent Night'], 'grace')).toBe(false)
  })

  it('matches everything for an empty or blank query', () => {
    expect(matchesQuery(['Silent Night'], '   ')).toBe(true)
  })
})
