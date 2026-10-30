import { C_MAJOR } from '@/shared/lib/music'
import type { Lesson, LessonBlock, LessonSection } from './types'

/** The blocks an editor adds to a section, by what the editor calls them (a rule is a note with a name). */
export const INSERTABLE_BLOCKS = [
  'text',
  'steps',
  'note',
  'rule',
  'chords',
  'notes',
  'progression',
] as const
export type InsertableBlock = (typeof INSERTABLE_BLOCKS)[number]

const blank = { en: '', ru: '' }

/** A new block of a kind: its words to write, its music a first example to write over. */
export function blankBlock(kind: InsertableBlock): LessonBlock {
  switch (kind) {
    case 'text':
      return { kind: 'text', text: blank }
    case 'steps':
      return { kind: 'steps', steps: [blank] }
    case 'note':
      return { kind: 'note', text: blank }
    case 'rule':
      return { kind: 'note', rule: blank, text: blank }
    case 'chords':
      return { kind: 'chords', symbols: ['C', 'F', 'G'] }
    case 'notes':
      return { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4' }
    case 'progression':
      return { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR }
  }
}

/** The list with the item at `at` moved by one place; the same list where it cannot move. */
function moved<T>(list: readonly T[], at: number, by: -1 | 1): readonly T[] | null {
  const to = at + by
  if (at < 0 || at >= list.length || to < 0 || to >= list.length) return null
  const next = [...list]
  const [item] = next.splice(at, 1)
  if (item !== undefined) next.splice(to, 0, item)
  return next
}

const withSections = (lesson: Lesson, sections: readonly LessonSection[]): Lesson => ({
  ...lesson,
  sections,
})

/** The lesson with a new section at its end, named in English, with no blocks yet. */
export const withSectionAdded = (lesson: Lesson, name: string): Lesson =>
  withSections(lesson, [...lesson.sections, { heading: { en: name.trim(), ru: '' }, blocks: [] }])

/** The lesson with a section moved up or down by one; the same lesson where it cannot move. */
export function withSectionMoved(lesson: Lesson, at: number, by: -1 | 1): Lesson {
  const sections = moved(lesson.sections, at, by)
  return sections ? withSections(lesson, sections) : lesson
}

export const withSectionRemoved = (lesson: Lesson, at: number): Lesson =>
  withSections(
    lesson,
    lesson.sections.filter((_, i) => i !== at),
  )

/** The lesson with section `s`'s blocks made anew by `change`. */
function withBlocks(
  lesson: Lesson,
  s: number,
  change: (blocks: readonly LessonBlock[]) => readonly LessonBlock[] | null,
): Lesson {
  const section = lesson.sections[s]
  const blocks = section ? change(section.blocks) : null
  if (!section || !blocks) return lesson
  return withSections(
    lesson,
    lesson.sections.map((each, i) => (i === s ? { ...section, blocks } : each)),
  )
}

/** The lesson with a block put in section `s` before its block `at` (at its end for its length). */
export const withBlockInserted = (
  lesson: Lesson,
  s: number,
  at: number,
  block: LessonBlock,
): Lesson => withBlocks(lesson, s, (blocks) => [...blocks.slice(0, at), block, ...blocks.slice(at)])

/** The lesson with a section's block moved up or down by one; the same lesson where it cannot move. */
export const withBlockMoved = (lesson: Lesson, s: number, b: number, by: -1 | 1): Lesson =>
  withBlocks(lesson, s, (blocks) => moved(blocks, b, by))

export const withBlockRemoved = (lesson: Lesson, s: number, b: number): Lesson =>
  withBlocks(lesson, s, (blocks) => blocks.filter((_, i) => i !== b))
