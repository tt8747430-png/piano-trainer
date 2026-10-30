import { describe, expect, it } from 'vitest'
import { blankBlock, INSERTABLE_BLOCKS } from './structure'

describe('the blocks an editor inserts', () => {
  it('starts each kind it offers blank, its words to write, its music a first example', () => {
    expect(INSERTABLE_BLOCKS).toEqual([
      'text',
      'steps',
      'note',
      'rule',
      'chords',
      'notes',
      'progression',
      'grid',
      'scale',
      'interval',
      'question',
    ])
    expect(blankBlock('rule')).toEqual({
      kind: 'note',
      rule: { en: '', ru: '' },
      text: { en: '', ru: '' },
    })
    expect(blankBlock('progression')).toMatchObject({ kind: 'progression', numerals: 'I IV V I' })
    expect(blankBlock('interval')).toMatchObject({ kind: 'interval', interval: 'P5' })
  })
})
