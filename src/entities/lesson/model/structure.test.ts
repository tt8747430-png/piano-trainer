import { describe, expect, it } from 'vitest'
import { blankBlock, INSERTABLE_BLOCKS, withAfter } from './structure'

describe('withAfter', () => {
  const lesson = { id: 'b', title: { en: 'B', ru: 'Б' }, summary: { en: '', ru: '' }, sections: [] }

  it('names the lessons to read first, and leaves the field out for none', () => {
    expect(withAfter(lesson, ['a']).after).toEqual(['a'])
    expect(withAfter({ ...lesson, after: ['a'] }, [])).toEqual(lesson)
  })
})

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
      'voicings',
      'question',
      'link',
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
