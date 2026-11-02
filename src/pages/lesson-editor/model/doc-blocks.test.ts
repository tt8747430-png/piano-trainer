import { getSchema } from '@tiptap/core'
import { Node } from '@tiptap/pm/model'
import { EditorState, NodeSelection, TextSelection } from '@tiptap/pm/state'
import { describe, expect, it } from 'vitest'
import { COURSES } from '@/entities/course'
import { LESSONS, type Lesson } from '@/entities/lesson'
import {
  blockTurn,
  duplicateBlock,
  lineAfter,
  moveBlock,
  moveBlockTo,
  removeBlock,
  turnBlockInto,
} from './doc-blocks'
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

describe('a block turned into another (round 28, its menu’s Turn into)', () => {
  const STEPS: Lesson = {
    ...LESSON,
    sections: [
      {
        heading: { en: 'H', ru: 'Х' },
        blocks: [
          {
            kind: 'steps',
            steps: [
              { en: 'a', ru: 'а' },
              { en: 'b', ru: 'б' },
            ],
          },
          { kind: 'chords', symbols: ['C'] },
        ],
        takeaway: { en: 'K', ru: 'К' },
      },
    ],
  }

  it('says what a block of words is, and nothing for an example or the title', () => {
    const state = stateOf(STEPS)
    expect([0, 1, 2, 3, 4, 5].map((at) => blockTurn(state.doc.child(at)))).toEqual([
      null,
      null,
      'section',
      'steps',
      null,
      'takeaway',
    ])
  })

  it('turns text into a section’s heading and back, its other language kept', () => {
    const state = stateOf(LESSON)
    const heading = state.apply(turnBlockInto(state, 3, 'section')!)
    expect(blockTurn(heading.doc.child(3))).toBe('section')
    expect(heading.selection.$from.parent.textContent).toBe('one')
    const lesson = docToLesson(heading.doc.toJSON() as DocNode, LESSON, 'en')
    expect(lesson.sections[1]?.heading).toEqual({ en: 'one', ru: 'один' })
    const text = heading.apply(turnBlockInto(heading, 3, 'text')!)
    expect(docToLesson(text.doc.toJSON() as DocNode, LESSON, 'en')).toEqual(LESSON)
  })

  it('makes each step a line of text, and lines a note or a takeaway of their words', () => {
    const state = stateOf(STEPS)
    const text = state.apply(turnBlockInto(state, 3, 'text')!)
    expect(texts(text)).toEqual(['T', 'S', 'H', 'a', 'b', 'lessonExample', 'K'])
    expect(docToLesson(text.doc.toJSON() as DocNode, STEPS, 'en').sections[0]?.blocks[1]).toEqual({
      kind: 'text',
      text: { en: 'b', ru: 'б' },
    })
    const note = state.apply(turnBlockInto(state, 3, 'note')!)
    expect(docToLesson(note.doc.toJSON() as DocNode, STEPS, 'en').sections[0]?.blocks[0]).toEqual({
      kind: 'note',
      text: { en: 'a b', ru: '' },
    })
    const takeaway = state.apply(turnBlockInto(state, 5, 'note')!)
    expect(
      docToLesson(takeaway.doc.toJSON() as DocNode, STEPS, 'en').sections[0]?.blocks[2],
    ).toEqual({ kind: 'note', text: { en: 'K', ru: 'К' } })
  })

  it('turns nothing into what it is, nor an example or the title', () => {
    const state = stateOf(STEPS)
    expect(turnBlockInto(state, 3, 'steps')).toBeNull()
    expect(turnBlockInto(state, 4, 'text')).toBeNull()
    expect(turnBlockInto(state, 0, 'text')).toBeNull()
  })
})

describe('a line added under a block (round 28, its gutter’s +)', () => {
  it('puts an empty line under it with / typed, the caret after it', () => {
    const state = stateOf(LESSON)
    const added = state.apply(lineAfter(state, 4)!)
    expect(texts(added)).toEqual(['T', 'S', 'H', 'one', 'lessonExample', '/', 'three'])
    expect(added.selection.$from.parent.textContent).toBe('/')
    expect(added.selection.$from.parentOffset).toBe(1)
    expect(lineAfter(state, 0)).toBeNull()
  })
})
