import type { LocalText } from '@/shared/i18n'
import type { Lesson, LessonBlock } from './types'

/** What a text of a lesson is: its title and summary, a section's heading and takeaway, or a block's words. */
export type LessonTextKind =
  | 'title'
  | 'summary'
  | 'heading'
  | 'takeaway'
  | 'lead'
  | 'text'
  | 'step'
  | 'note'
  | 'rule'
  | 'ask'
  | 'linkTitle'

/** One text a lesson shows, in both languages: where it is (`key`), what it is, in which section. */
export interface LessonText {
  readonly key: string
  readonly kind: LessonTextKind
  /** Its section's index; null for the lesson's title and summary. */
  readonly section: number | null
  readonly text: LocalText
}

type Path = readonly (string | number)[]

/** A block's words with where each is within it: the examples it plays have none. */
function blockTexts(block: LessonBlock): (readonly [LessonTextKind, Path, LocalText])[] {
  switch (block.kind) {
    case 'text':
      return [
        ...(block.lead ? [['lead', ['lead'], block.lead] as const] : []),
        ['text', ['text'], block.text],
      ]
    case 'steps':
      return block.steps.map((step, i) => ['step', ['steps', i], step])
    case 'note':
      return [
        ['note', ['text'], block.text],
        ...(block.rule ? [['rule', ['rule'], block.rule] as const] : []),
      ]
    case 'question':
      return [['ask', ['ask'], block.ask]]
    case 'link':
      return [['linkTitle', ['title'], block.title]]
    default:
      return []
  }
}

const keyOf = (path: Path) => path.join('.')

/**
 * Every text a lesson shows, in its order (ADR 0116, round 6): its title, its summary, and each
 * section's heading, its blocks' words and its takeaway. An editor writes them; its examples stay.
 */
export function lessonTexts(lesson: Lesson): LessonText[] {
  const at = (path: Path, kind: LessonTextKind, section: number | null, text: LocalText) => ({
    key: keyOf(path),
    kind,
    section,
    text,
  })
  return [
    at(['title'], 'title', null, lesson.title),
    at(['summary'], 'summary', null, lesson.summary),
    ...lesson.sections.flatMap((section, s) => [
      at(['sections', s, 'heading'], 'heading', s, section.heading),
      ...section.blocks.flatMap((block, b) =>
        blockTexts(block).map(([kind, path, text]) =>
          at(['sections', s, 'blocks', b, ...path], kind, s, text),
        ),
      ),
      ...(section.takeaway
        ? [at(['sections', s, 'takeaway'], 'takeaway', s, section.takeaway)]
        : []),
    ]),
  ]
}
