import { describe, expect, it } from 'vitest'
import { sectionPaint } from './section-paint'

describe('sectionPaint', () => {
  it.each([
    ['Intro', 'sand'],
    ['Outro', 'sand'],
    ['Ending', 'sand'],
    ['Last ending', 'sand'],
    ['Coda', 'sand'],
    ['Вступление', 'sand'],
    ['Окончание', 'sand'],
    ['Последнее окончание', 'sand'],
    ['Концовка', 'sand'],
    ['Verse', 'sky'],
    ['Verse 2', 'sky'],
    ['2-й куплет', 'sky'],
    ['Куплет', 'sky'],
    ['Chorus', 'grass'],
    ['Last chorus', 'grass'],
    ['Refrain', 'grass'],
    ['Припев', 'grass'],
    ['Последний припев в ля миноре', 'grass'],
    ['Bridge', 'lilac'],
    ['Бридж', 'lilac'],
    ['Связка', 'lilac'],
    ['Instrumental', 'yellow'],
    ['Interlude', 'yellow'],
    ['Hymn', 'yellow'],
    ['Part A', 'yellow'],
    ['Часть B', 'yellow'],
    ['Progression', 'yellow'],
  ] as const)('paints %s %s', (name, paint) => {
    expect(sectionPaint(name)).toBe(paint)
  })

  it('reads the part a name says first, in either language', () => {
    expect(sectionPaint('Verse 4 and ending')).toBe('sky')
    expect(sectionPaint('4-й куплет и окончание')).toBe('sky')
    expect(sectionPaint('Ending, then the chorus')).toBe('sand')
  })

  it('reads a word from its start only', () => {
    expect(sectionPaint('Universe')).toBe('yellow')
    expect(sectionPaint('Codas and bridges')).toBe('sand')
  })
})
