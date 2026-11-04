import {
  exampleProblem,
  lessonExamples,
  withExample,
  type Lesson,
  type LessonBlock,
  type LessonExample,
} from '@/entities/lesson'

/** One block as a lesson of its own: what the lesson's examples are read on. */
const alone = (block: LessonBlock): Lesson => ({
  id: 'block',
  title: { en: '', ru: '' },
  summary: { en: '', ru: '' },
  sections: [{ heading: { en: '', ru: '' }, blocks: [block] }],
})

/** A block's examples written as a line of text: a row of chords, a line of notes, numerals, an answer. */
export const blockExamples = (block: LessonBlock): LessonExample[] => lessonExamples(alone(block))

/** The block with `text` written in its example `example` (one of `blockExamples`). */
export function withBlockExample(
  block: LessonBlock,
  example: LessonExample,
  text: string,
): LessonBlock {
  return withExample(alone(block), example.key, text).sections[0]?.blocks[0] ?? block
}

/** What in a block's example does not read ('' for an empty one); null where it reads. */
export const blockExampleProblem = (block: LessonBlock, example: LessonExample): string | null =>
  exampleProblem(alone(block), example)

/** Whether every example the block writes as text reads, so it can be drawn as the lesson shows it. */
export const blockReads = (block: LessonBlock): boolean =>
  blockExamples(block).every((example) => blockExampleProblem(block, example) === null)
