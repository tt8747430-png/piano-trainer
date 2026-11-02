import type { Lesson, LessonBlock, LessonSection } from '@/entities/lesson'
import type { Locale, LocalText } from '@/shared/i18n'

/** A mark on a run of text: bold, a text block's lead. */
export interface DocMark {
  readonly type: string
}

/**
 * A node of the lesson's document, as the editor's JSON writes it (TipTap's `JSONContent`): its type,
 * what it carries of the lesson (its words in the other language, an example's fields), its children.
 */
export interface DocNode {
  readonly type: string
  readonly attrs?: Readonly<Record<string, unknown>>
  readonly content?: readonly DocNode[]
  readonly text?: string
  readonly marks?: readonly DocMark[]
}

/** The document's node types: the lesson's title and summary, a section's heading and takeaway, a block's. */
export const DOC = {
  title: 'lessonTitle',
  summary: 'lessonSummary',
  heading: 'heading',
  takeaway: 'takeaway',
  paragraph: 'paragraph',
  steps: 'orderedList',
  step: 'listItem',
  note: 'note',
  noteRule: 'noteRule',
  noteText: 'noteText',
  example: 'lessonExample',
} as const

const BLANK: LocalText = { en: '', ru: '' }

/** A run of text, or none where it is empty: a document has no empty runs. */
const run = (text: string, bold = false): DocNode[] =>
  text === '' ? [] : [{ type: 'text', text, ...(bold ? { marks: [{ type: 'bold' }] } : {}) }]

/** A block of the lesson as the document's node, in `locale`, carrying the whole block. */
export function blockNode(block: LessonBlock, locale: Locale): DocNode {
  switch (block.kind) {
    case 'text': {
      const lead = block.lead?.[locale] ?? ''
      const text = block.text[locale]
      return {
        type: DOC.paragraph,
        attrs: { block },
        content: [...run(lead, true), ...run(lead && text ? ` ${text}` : text)],
      }
    }
    case 'steps':
      return {
        type: DOC.steps,
        attrs: { block },
        content: block.steps.map((step) => ({
          type: DOC.step,
          attrs: { text: step },
          content: [{ type: DOC.paragraph, content: run(step[locale]) }],
        })),
      }
    case 'note':
      return {
        type: DOC.note,
        attrs: { block },
        content: [
          ...(block.rule ? [{ type: DOC.noteRule, content: run(block.rule[locale]) }] : []),
          { type: DOC.noteText, content: run(block.text[locale]) },
        ],
      }
    default:
      return { type: DOC.example, attrs: { block } }
  }
}

/**
 * The lesson as one document in `locale` (round 21): its title and summary, then each section's
 * heading, its blocks (prose a paragraph, steps a numbered list, a note a callout, an example an atom
 * carrying its fields) and its takeaway. Each node carries the lesson's text it shows, so the other
 * language comes back untouched.
 */
export function lessonToDoc(lesson: Lesson, locale: Locale): DocNode {
  return {
    type: 'doc',
    content: [
      { type: DOC.title, content: run(lesson.title[locale]) },
      { type: DOC.summary, content: run(lesson.summary[locale]) },
      ...lesson.sections.flatMap((section) => [
        {
          type: DOC.heading,
          attrs: { level: 2, text: section.heading },
          content: run(section.heading[locale]),
        },
        ...section.blocks.map((block) => blockNode(block, locale)),
        ...(section.takeaway
          ? [
              {
                type: DOC.takeaway,
                attrs: { text: section.takeaway },
                content: run(section.takeaway[locale]),
              },
            ]
          : []),
      ]),
    ],
  }
}

/** A node's words, its runs one after the other. */
export const textOf = (node: DocNode | undefined): string =>
  node?.text ?? (node?.content ?? []).map(textOf).join('')

/** `text` written in `locale` over what the node carried (blank where it carried none). */
const written = (carried: unknown, locale: Locale, text: string): LocalText => ({
  ...(isLocalText(carried) ? carried : BLANK),
  [locale]: text,
})

const isLocalText = (value: unknown): value is LocalText =>
  typeof value === 'object' && value !== null && 'en' in value && 'ru' in value

const carriedBlock = (node: DocNode): LessonBlock | null => {
  const block = node.attrs?.['block']
  return typeof block === 'object' && block !== null && 'kind' in block
    ? (block as LessonBlock)
    : null
}

/** A paragraph's words: its bold runs at the start its lead, the rest its text. */
function paragraphBlock(node: DocNode, locale: Locale): LessonBlock | null {
  const carried = carriedBlock(node)
  const runs = node.content ?? []
  const leadRuns = runs.findIndex((each) => !each.marks?.some((mark) => mark.type === 'bold'))
  const split = leadRuns === -1 ? runs.length : leadRuns
  const lead = runs.slice(0, split).map(textOf).join('')
  const rest = runs.slice(split).map(textOf).join('')
  const text = lead ? rest.replace(/^ /, '') : rest
  // A line typed and left empty is no block: a block carried keeps its other language.
  if (!carried && lead === '' && text === '') return null
  const was = carried?.kind === 'text' ? carried : undefined
  const leadText = written(was?.lead, locale, lead)
  return {
    kind: 'text',
    ...(leadText.en || leadText.ru ? { lead: leadText } : {}),
    text: written(was?.text, locale, text),
  }
}

function blockOf(node: DocNode, locale: Locale): LessonBlock | null {
  switch (node.type) {
    case DOC.paragraph:
      return paragraphBlock(node, locale)
    case DOC.steps:
      return {
        kind: 'steps',
        steps: (node.content ?? []).map((item) =>
          written(item.attrs?.['text'], locale, textOf(item)),
        ),
      }
    case DOC.note: {
      const was = carriedBlock(node)
      const note = was?.kind === 'note' ? was : undefined
      const rule = node.content?.find((each) => each.type === DOC.noteRule)
      const text = node.content?.find((each) => each.type === DOC.noteText)
      return {
        kind: 'note',
        text: written(note?.text, locale, textOf(text)),
        ...(rule ? { rule: written(note?.rule, locale, textOf(rule)) } : {}),
      }
    }
    case DOC.example:
      return carriedBlock(node)
    default:
      return null
  }
}

/**
 * The lesson the document writes, in `locale` (round 21): its words in that language over the
 * lesson's, the other language as each node carried it (blank for one written new). What stands
 * before the first heading opens a section with no heading yet.
 */
export function docToLesson(doc: DocNode, lesson: Lesson, locale: Locale): Lesson {
  const nodes = doc.content ?? []
  const title = nodes.find((node) => node.type === DOC.title)
  const summary = nodes.find((node) => node.type === DOC.summary)
  type Writing = { heading: LocalText; blocks: LessonBlock[]; takeaway?: LocalText }
  const sections: Writing[] = []
  const current = (): Writing => {
    const last = sections.at(-1)
    if (last) return last
    const opened: Writing = { heading: BLANK, blocks: [] }
    sections.push(opened)
    return opened
  }
  for (const node of nodes) {
    if (node.type === DOC.title || node.type === DOC.summary) continue
    if (node.type === DOC.heading) {
      sections.push({ heading: written(node.attrs?.['text'], locale, textOf(node)), blocks: [] })
      continue
    }
    if (node.type === DOC.takeaway) {
      current().takeaway = written(node.attrs?.['text'], locale, textOf(node))
      continue
    }
    const block = blockOf(node, locale)
    if (block) current().blocks.push(block)
  }
  return {
    ...lesson,
    title: written(lesson.title, locale, textOf(title)),
    summary: written(lesson.summary, locale, textOf(summary)),
    sections: sections.map((section): LessonSection =>
      section.takeaway
        ? { heading: section.heading, blocks: section.blocks, takeaway: section.takeaway }
        : { heading: section.heading, blocks: section.blocks },
    ),
  }
}
