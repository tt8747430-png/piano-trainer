import { describe, expect, it } from 'vitest'
import { C_MAJOR } from '@/shared/lib/music'
import { exampleProblem, lessonExamples, withExample } from './examples'
import type { Lesson } from './types'

const t = (en: string) => ({ en, ru: en })

const LESSON: Lesson = {
  id: 'x',
  title: t('X'),
  summary: t('X'),
  sections: [
    {
      heading: t('One'),
      blocks: [
        { kind: 'text', text: t('Read') },
        { kind: 'chords', symbols: ['C', 'Am', 'F', 'G7'] },
        { kind: 'notes', clef: 'treble', notes: 'E4 G4/2 r', bass: 'C3/1' },
        { kind: 'progression', numerals: 'ii V I', key: C_MAJOR },
      ],
    },
  ],
}

describe('a lesson’s examples, as an editor writes them', () => {
  it('lists each example a line of text writes, in its order', () => {
    expect(lessonExamples(LESSON).map(({ kind, section, text }) => [kind, section, text])).toEqual([
      ['chords', 0, 'C Am F G7'],
      ['notes', 0, 'E4 G4/2 r'],
      ['bass', 0, 'C3/1'],
      ['numerals', 0, 'ii V I'],
    ])
  })

  it('writes one in its place: chords a symbol a word, a line of notes as typed', () => {
    const [chords, notes] = lessonExamples(LESSON)
    const written = withExample(withExample(LESSON, chords!.key, ' Dm7  G7 C '), notes!.key, 'C5')
    expect(written.sections[0]?.blocks[1]).toEqual({ kind: 'chords', symbols: ['Dm7', 'G7', 'C'] })
    expect(written.sections[0]?.blocks[2]).toMatchObject({ notes: 'C5', bass: 'C3/1' })
    expect(withExample(LESSON, 'sections.9.blocks.0.symbols', 'C')).toBe(LESSON)
  })

  it('says where one does not read, as the lesson would not play it', () => {
    const [chords, notes, bass, numerals] = lessonExamples(LESSON)
    expect(exampleProblem(LESSON, chords!)).toBeNull()
    expect(exampleProblem(withExample(LESSON, chords!.key, 'C Qx'), chords!)).toBe('Qx')
    expect(exampleProblem(withExample(LESSON, chords!.key, ''), chords!)).toBe('')
    expect(exampleProblem(withExample(LESSON, notes!.key, 'E4 Z9'), notes!)).toBe('Z9')
    expect(exampleProblem(LESSON, bass!)).toBeNull()
    expect(exampleProblem(withExample(LESSON, numerals!.key, 'ii xyz'), numerals!)).toBe('ii xyz')
  })
})

describe('the built-in lessons', () => {
  it('read, every example written as text, as this editor reads them', async () => {
    const { LESSONS } = await import('../content')
    const { COURSES } = await import('@/entities/course')
    const all = [...LESSONS, ...COURSES.flatMap((course) => course.lessons)]
    const unread = all.flatMap((lesson) =>
      lessonExamples(lesson)
        .filter((example) => exampleProblem(lesson, example) !== null)
        .map((example) => `${lesson.id} ${example.key}: ${example.text}`),
    )
    expect(unread).toEqual([])
  })
})
