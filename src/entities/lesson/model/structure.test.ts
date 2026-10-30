import { describe, expect, it } from 'vitest'
import {
  blankBlock,
  INSERTABLE_BLOCKS,
  withBlockInserted,
  withBlockMoved,
  withBlockRemoved,
  withSectionAdded,
  withSectionMoved,
  withSectionRemoved,
} from './structure'
import { blankLesson, type Lesson } from './types'

const words = (en: string) => ({ en, ru: en })
const lesson: Lesson = {
  ...blankLesson('l', 'L'),
  sections: [
    { heading: words('One'), blocks: [{ kind: 'text', text: words('a') }, blankBlock('chords')] },
    { heading: words('Two'), blocks: [] },
  ],
}

describe('a lesson’s structure, edited', () => {
  it('adds a section at the end, named, with no blocks', () => {
    expect(withSectionAdded(lesson, 'Three').sections.at(-1)).toEqual({
      heading: { en: 'Three', ru: '' },
      blocks: [],
    })
  })

  it('moves a section, and removes one', () => {
    expect(withSectionMoved(lesson, 1, -1).sections.map((s) => s.heading.en)).toEqual([
      'Two',
      'One',
    ])
    expect(withSectionMoved(lesson, 0, -1)).toBe(lesson)
    expect(withSectionRemoved(lesson, 0).sections.map((s) => s.heading.en)).toEqual(['Two'])
  })

  it('inserts a block where asked, moves it, and removes it', () => {
    const inserted = withBlockInserted(lesson, 0, 1, blankBlock('note'))
    expect(inserted.sections[0]?.blocks.map((b) => b.kind)).toEqual(['text', 'note', 'chords'])
    const moved = withBlockMoved(inserted, 0, 1, 1)
    expect(moved.sections[0]?.blocks.map((b) => b.kind)).toEqual(['text', 'chords', 'note'])
    expect(withBlockMoved(moved, 0, 2, 1)).toBe(moved)
    expect(withBlockRemoved(moved, 0, 0).sections[0]?.blocks.map((b) => b.kind)).toEqual([
      'chords',
      'note',
    ])
  })

  it('starts each kind it offers blank, its words to write, its music a first example', () => {
    expect(INSERTABLE_BLOCKS).toEqual([
      'text',
      'steps',
      'note',
      'rule',
      'chords',
      'notes',
      'progression',
      'question',
    ])
    expect(blankBlock('rule')).toEqual({
      kind: 'note',
      rule: { en: '', ru: '' },
      text: { en: '', ru: '' },
    })
    expect(blankBlock('progression')).toMatchObject({ kind: 'progression', numerals: 'I IV V I' })
  })
})
