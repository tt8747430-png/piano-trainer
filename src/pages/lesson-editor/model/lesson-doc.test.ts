import { describe, expect, it } from 'vitest'
import { COURSES } from '@/entities/course'
import { LESSONS, type Lesson, type LessonBlock } from '@/entities/lesson'
import { DOC, docToLesson, lessonToDoc, textOf, type DocNode } from './lesson-doc'

const ALL = [...LESSONS, ...COURSES.flatMap((course) => course.lessons)]

const lesson = (blocks: LessonBlock[], takeaway = true): Lesson => ({
  id: 'a-lesson',
  title: { en: 'Title', ru: 'Заголовок' },
  summary: { en: 'Summary', ru: 'Кратко' },
  sections: [
    {
      heading: { en: 'One', ru: 'Один' },
      blocks,
      ...(takeaway ? { takeaway: { en: 'In short', ru: 'Коротко' } } : {}),
    },
  ],
})

/** The document with each node's words in it changed by `change`. */
function rewrite(node: DocNode, change: (text: string) => string): DocNode {
  return {
    ...node,
    ...(node.text === undefined ? {} : { text: change(node.text) }),
    ...(node.content ? { content: node.content.map((each) => rewrite(each, change)) } : {}),
  }
}

describe('a lesson as a document', () => {
  it.each(['en', 'ru'] as const)('comes back as it was from every lesson in %s', (locale) => {
    for (const each of ALL)
      expect(docToLesson(lessonToDoc(each, locale), each, locale)).toEqual(each)
  })

  it('writes the lesson’s title, summary, heading and takeaway as its own nodes', () => {
    const doc = lessonToDoc(lesson([]), 'ru')
    expect(doc.content?.map((node) => [node.type, textOf(node)])).toEqual([
      [DOC.title, 'Заголовок'],
      [DOC.summary, 'Кратко'],
      [DOC.heading, 'Один'],
      [DOC.takeaway, 'Коротко'],
    ])
  })

  it('writes a text’s lead in bold before its words', () => {
    const doc = lessonToDoc(
      lesson([{ kind: 'text', lead: { en: 'Lead.', ru: 'Л.' }, text: { en: 'Body', ru: 'Т' } }]),
      'en',
    )
    expect(doc.content?.[3]?.content).toEqual([
      { type: 'text', text: 'Lead.', marks: [{ type: 'bold' }] },
      { type: 'text', text: ' Body' },
    ])
  })

  it('changes one language and leaves the other as it was, for every kind of block', () => {
    for (const each of ALL) {
      const doc = rewrite(lessonToDoc(each, 'ru'), (text) => `${text}!`)
      const back = docToLesson(doc, each, 'ru')
      expect(back.title).toEqual({ en: each.title.en, ru: `${each.title.ru}!` })
      back.sections.forEach((section, s) => {
        expect(section.heading.en).toBe(each.sections[s]?.heading.en)
        expect(section.blocks.map((block) => block.kind)).toEqual(
          each.sections[s]?.blocks.map((block) => block.kind),
        )
      })
      expect(JSON.stringify(back)).toContain(JSON.stringify(each.sections[0]?.heading.en))
    }
  })

  it('keeps steps, a note and a rule with their other language', () => {
    const blocks: LessonBlock[] = [
      {
        kind: 'steps',
        steps: [
          { en: 'a', ru: 'а' },
          { en: 'b', ru: 'б' },
        ],
      },
      { kind: 'note', text: { en: 'n', ru: 'н' } },
      { kind: 'note', rule: { en: 'R', ru: 'П' }, text: { en: 't', ru: 'т' } },
    ]
    const doc = rewrite(lessonToDoc(lesson(blocks), 'en'), (text) => text.toUpperCase())
    expect(docToLesson(doc, lesson(blocks), 'en').sections[0]?.blocks).toEqual([
      {
        kind: 'steps',
        steps: [
          { en: 'A', ru: 'а' },
          { en: 'B', ru: 'б' },
        ],
      },
      { kind: 'note', text: { en: 'N', ru: 'н' } },
      { kind: 'note', rule: { en: 'R', ru: 'П' }, text: { en: 'T', ru: 'т' } },
    ])
  })

  it('carries an example whole, whatever it is', () => {
    const blocks: LessonBlock[] = [
      { kind: 'chords', symbols: ['C', 'G'] },
      { kind: 'question', ask: { en: 'Play C', ru: 'Сыграйте C' }, answer: { chord: 'C' } },
    ]
    const doc = lessonToDoc(lesson(blocks), 'en')
    expect(doc.content?.slice(3, 5)).toEqual(
      blocks.map((block) => ({ type: DOC.example, attrs: { block } })),
    )
    expect(docToLesson(doc, lesson(blocks), 'ru').sections[0]?.blocks).toEqual(blocks)
  })

  it('reads a line typed new as a text with no other language, and skips one left empty', () => {
    const base = lesson([], false)
    const doc: DocNode = {
      type: 'doc',
      content: [
        ...(lessonToDoc(base, 'en').content ?? []),
        { type: DOC.paragraph, content: [{ type: 'text', text: 'New words' }] },
        { type: DOC.paragraph },
        { type: DOC.heading, attrs: { level: 2 }, content: [{ type: 'text', text: 'Two' }] },
      ],
    }
    expect(docToLesson(doc, base, 'en').sections).toEqual([
      {
        heading: { en: 'One', ru: 'Один' },
        blocks: [{ kind: 'text', text: { en: 'New words', ru: '' } }],
      },
      { heading: { en: 'Two', ru: '' }, blocks: [] },
    ])
  })

  it('opens a section with no heading for what stands before the first', () => {
    const base = lesson([], false)
    const doc: DocNode = {
      type: 'doc',
      content: [
        { type: DOC.title },
        { type: DOC.summary },
        { type: DOC.paragraph, content: [{ type: 'text', text: 'x' }] },
      ],
    }
    expect(docToLesson(doc, base, 'ru')).toEqual({
      ...base,
      title: { en: 'Title', ru: '' },
      summary: { en: 'Summary', ru: '' },
      sections: [
        { heading: { en: '', ru: '' }, blocks: [{ kind: 'text', text: { en: '', ru: 'x' } }] },
      ],
    })
  })

  it('moves blocks with their words in both languages', () => {
    const blocks: LessonBlock[] = [
      { kind: 'text', text: { en: 'first', ru: 'первый' } },
      { kind: 'text', text: { en: 'second', ru: 'второй' } },
    ]
    const doc = lessonToDoc(lesson(blocks), 'en')
    const [title, summary, heading, a, b, takeaway] = doc.content ?? []
    const moved = { ...doc, content: [title!, summary!, heading!, b!, a!, takeaway!] }
    expect(docToLesson(moved, lesson(blocks), 'en').sections[0]?.blocks).toEqual(
      [...blocks].reverse(),
    )
  })
})
