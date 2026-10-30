import { getSchema } from '@tiptap/core'
import { Node } from '@tiptap/pm/model'
import { EditorState, NodeSelection, TextSelection } from '@tiptap/pm/state'
import { describe, expect, it } from 'vitest'
import { COURSES } from '@/entities/course'
import { LESSONS, type Lesson } from '@/entities/lesson'
import { duplicateBlock, moveBlock, moveBlockTo, removeBlock } from './doc-blocks'
import { docExtensions } from './doc-schema'
import { docToLesson, lessonToDoc, textOf, type DocNode } from './lesson-doc'

const schema = getSchema(docExtensions())

const LESSON: Lesson = {
  id: 'l',
  title: { en: 'T', ru: 'Т' },
  summary: { en: 'S', ru: 'С' },
  sections: [
    {
      heading: { en: 'H', ru: 'Х' },
      blocks: [
        { kind: 'text', text: { en: 'one', ru: 'один' } },
        { kind: 'chords', symbols: ['C'] },
        { kind: 'text', text: { en: 'three', ru: 'три' } },
      ],
    },
  ],
}

const stateOf = (lesson: Lesson) =>
  EditorState.create({ schema, doc: Node.fromJSON(schema, lessonToDoc(lesson, 'en')) })

const texts = (state: EditorState) =>
  (state.doc.toJSON() as DocNode).content?.map((node) => textOf(node) || node.type)

describe('the lesson document’s schema', () => {
  it('holds every lesson', () => {
    for (const lesson of [...LESSONS, ...COURSES.flatMap((course) => course.lessons)])
      expect(() => Node.fromJSON(schema, lessonToDoc(lesson, 'ru')).check()).not.toThrow()
  })

  it('gives back the lesson it was made from', () => {
    expect(docToLesson(stateOf(LESSON).doc.toJSON() as DocNode, LESSON, 'en')).toEqual(LESSON)
  })
})

describe('a block moved, copied and taken out', () => {
  it('moves the block the caret is in, the caret with it', () => {
    const state = stateOf(LESSON)
    const inThree = state.doc.content.size - 3
    const at = state.apply(state.tr.setSelection(TextSelection.create(state.doc, inThree)))
    const tr = moveBlock(at, -1)!
    const moved = at.apply(tr)
    expect(texts(moved)).toEqual(['T', 'S', 'H', 'one', 'three', 'lessonExample'])
    expect(moved.selection.$from.parent.textContent).toBe('three')
  })

  it('moves an example selected, kept selected', () => {
    const state = stateOf(LESSON)
    let pos = 0
    state.doc.forEach((node, offset) => {
      if (node.type.name === 'lessonExample') pos = offset
    })
    const at = state.apply(state.tr.setSelection(NodeSelection.create(state.doc, pos)))
    const moved = at.apply(moveBlock(at, 1)!)
    expect(texts(moved)).toEqual(['T', 'S', 'H', 'one', 'three', 'lessonExample'])
    expect((moved.selection as NodeSelection).node.type.name).toBe('lessonExample')
  })

  it('moves a block dragged to where it is dropped, selected there', () => {
    const state = stateOf(LESSON)
    const up = state.apply(moveBlockTo(state, 5, 3)!)
    expect(texts(up)).toEqual(['T', 'S', 'H', 'three', 'one', 'lessonExample'])
    expect((up.selection as NodeSelection).node.textContent).toBe('three')
    const down = state.apply(moveBlockTo(state, 3, 5)!)
    expect(texts(down)).toEqual(['T', 'S', 'H', 'lessonExample', 'three', 'one'])
  })

  it('drops nothing above the title and summary, nor in its own place', () => {
    const state = stateOf(LESSON)
    expect(texts(state.apply(moveBlockTo(state, 4, 0)!))).toEqual([
      'T',
      'S',
      'lessonExample',
      'H',
      'one',
      'three',
    ])
    expect(moveBlockTo(state, 4, 4)).toBeNull()
    expect(moveBlockTo(state, 1, 4)).toBeNull()
  })

  it('never moves the title or summary, nor a block above them', () => {
    const state = stateOf(LESSON)
    expect(moveBlock(state, -1, 0)).toBeNull()
    expect(moveBlock(state, -1, 2)).toBeNull()
    expect(moveBlock(state, 1, 5)).toBeNull()
  })

  it('copies a block after it and takes one out', () => {
    const state = stateOf(LESSON)
    const copied = state.apply(duplicateBlock(state, 3)!)
    expect(texts(copied)).toEqual(['T', 'S', 'H', 'one', 'one', 'lessonExample', 'three'])
    expect(texts(copied.apply(removeBlock(copied, 5)!))).toEqual([
      'T',
      'S',
      'H',
      'one',
      'one',
      'three',
    ])
    expect(removeBlock(state, 1)).toBeNull()
    expect(duplicateBlock(state, 0)).toBeNull()
  })
})
