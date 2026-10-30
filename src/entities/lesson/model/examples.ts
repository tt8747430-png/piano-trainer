import { C_MAJOR, parseChordSymbol, parseNumerals } from '@/shared/lib/music'
import { noteLine } from '@/shared/lib/schedule'
import type { Lesson, LessonBlock } from './types'

/**
 * What an example's line of text writes: a row of chord symbols, a line of notes (the left hand's,
 * `bass`), numerals, or the chord a question asks to be played (`answer`).
 */
export type ExampleKind = 'chords' | 'notes' | 'bass' | 'numerals' | 'answer'

/** One example of a lesson an editor writes as a line of text: where it is (`key`), what it is, in which section. */
export interface LessonExample {
  readonly key: string
  readonly kind: ExampleKind
  readonly section: number
  readonly text: string
}

type Path = readonly (string | number)[]

/** A block's examples written as text, with where each is within it; the other examples have none here. */
function blockExamples(block: LessonBlock): (readonly [ExampleKind, string, string])[] {
  switch (block.kind) {
    case 'chords':
      return [['chords', 'symbols', block.symbols.join(' ')]]
    case 'notes':
      return [
        ['notes', 'notes', block.notes],
        ...(block.bass === undefined ? [] : [['bass', 'bass', block.bass] as const]),
      ]
    case 'progression':
      return [['numerals', 'numerals', block.numerals]]
    case 'question':
      return 'chord' in block.answer ? [['answer', 'answer', block.answer.chord]] : []
    default:
      return []
  }
}

/**
 * A lesson's examples written as a line of text, in its order (ADR 0116, round 11): a row of chords,
 * a line of notes and its left hand's, a progression's numerals, the chord a question asks for. The
 * rest stay as authored.
 */
export function lessonExamples(lesson: Lesson): LessonExample[] {
  return lesson.sections.flatMap((section, s) =>
    section.blocks.flatMap((block, b) =>
      blockExamples(block).map(([kind, field, text]) => ({
        key: ['sections', s, 'blocks', b, field].join('.'),
        kind,
        section: s,
        text,
      })),
    ),
  )
}

const pathOf = (key: string): Path =>
  key.split('.').map((step) => (/^\d+$/.test(step) ? Number(step) : step))

/** The block an example's key is in, and the field it writes. */
function blockAt(lesson: Lesson, key: string): { block: LessonBlock; field: string } | undefined {
  const [, s, , b, field] = pathOf(key)
  const block =
    typeof s === 'number' && typeof b === 'number' ? lesson.sections[s]?.blocks[b] : undefined
  return block && typeof field === 'string' ? { block, field } : undefined
}

/** The lesson with `text` written in the example at `key`; the lesson as it was where it has none there. */
export function withExample(lesson: Lesson, key: string, text: string): Lesson {
  const example = lessonExamples(lesson).find((each) => each.key === key)
  const at = blockAt(lesson, key)
  if (!example || !at) return lesson
  const value =
    example.kind === 'chords'
      ? text.split(/\s+/).filter(Boolean)
      : example.kind === 'answer'
        ? { chord: text.trim() }
        : text
  const [, s, , b] = pathOf(key) as [string, number, string, number]
  return {
    ...lesson,
    sections: lesson.sections.map((section, i) =>
      i !== s
        ? section
        : {
            ...section,
            blocks: section.blocks.map((block, j) =>
              j === b ? ({ ...block, [at.field]: value } as LessonBlock) : block,
            ),
          },
    ),
  }
}

/** The first word of `text` a reader refuses, or the whole of it where none is to blame. */
function firstUnread(words: readonly string[], reads: (word: string) => boolean): string | null {
  return words.find((word) => !reads(word)) ?? null
}

/**
 * What in an example does not read as the lesson would play it: the chord symbol, the note or the
 * numerals at fault (an empty example, ''); null where it all reads.
 */
export function exampleProblem(lesson: Lesson, example: LessonExample): string | null {
  const at = blockAt(lesson, example.key)
  const now = lessonExamples(lesson).find((each) => each.key === example.key)
  if (!at || !now) return ''
  if (now.text.trim() === '') return ''
  const { block } = at
  switch (now.kind) {
    case 'chords':
      return firstUnread(now.text.split(/\s+/).filter(Boolean), (symbol) => {
        try {
          parseChordSymbol(symbol)
          return true
        } catch {
          return false
        }
      })
    case 'notes':
    case 'bass': {
      if (block.kind !== 'notes') return ''
      const options = {
        hand: now.kind === 'bass' ? ('lh' as const) : ('rh' as const),
        meter: block.meter ?? '4/4',
        key: block.key ?? C_MAJOR,
      }
      try {
        noteLine(now.text, options)
        return null
      } catch {
        return (
          firstUnread(now.text.split(/\s+/).filter(Boolean), (token) => {
            try {
              noteLine(token, options)
              return true
            } catch {
              return false
            }
          }) ?? now.text
        )
      }
    }
    case 'numerals':
      return parseNumerals(now.text) ? null : now.text
    case 'answer':
      try {
        parseChordSymbol(now.text.trim())
        return null
      } catch {
        return now.text.trim()
      }
  }
}

/** Whether every example of the lesson written as text reads. */
export const examplesRead = (lesson: Lesson): boolean =>
  lessonExamples(lesson).every((example) => exampleProblem(lesson, example) === null)
