import { Extension, Node, type AnyExtension, type NodeViewRenderer } from '@tiptap/core'
import { StarterKit } from '@tiptap/starter-kit'
import type { LessonBlock } from '@/entities/lesson'
import { moveBlock } from './doc-blocks'
import { DOC } from './lesson-doc'

/** An attribute a node carries of the lesson and never prints, nor copies onto a line split from it. */
const carried = { default: null, keepOnSplit: false, rendered: false }

/** The document: the lesson's title, its summary, then its sections' headings and blocks. */
const LessonDoc = Node.create({
  name: 'doc',
  topNode: true,
  content: `${DOC.title} ${DOC.summary} block*`,
})

/** A line of words alone, no bold (a title, a summary, a takeaway, a note's parts). */
const plainLine = (name: string, tag: string, data: string, group?: string) =>
  Node.create({
    name,
    ...(group ? { group } : {}),
    content: 'text*',
    marks: '',
    defining: true,
    parseHTML: () => [{ tag: `${tag}[data-${data}]` }],
    renderHTML: () => [tag, { [`data-${data}`]: '' }, 0],
  })

const LessonTitle = plainLine(DOC.title, 'p', 'lesson-title')
const LessonSummary = plainLine(DOC.summary, 'p', 'lesson-summary')
const NoteRule = plainLine(DOC.noteRule, 'p', 'note-rule')
const NoteText = plainLine(DOC.noteText, 'p', 'note-text')

/** A section's takeaway: its one sentence on a card at its end. */
const Takeaway = plainLine(DOC.takeaway, 'aside', 'takeaway', 'block').extend({
  addAttributes: () => ({ text: carried }),
})

/** A note on sand, or (with its rule's name first) a rule's card. */
const Note = Node.create({
  name: DOC.note,
  group: 'block',
  content: `${DOC.noteRule}? ${DOC.noteText}`,
  defining: true,
  addAttributes: () => ({ block: carried }),
  parseHTML: () => [{ tag: 'div[data-note]' }],
  renderHTML: () => ['div', { 'data-note': '' }, 0],
})

/** An example the lesson plays, a question or a link: one atom carrying its fields, shown as it reads. */
const LessonExample = Node.create<{ view: NodeViewRenderer | null }>({
  name: DOC.example,
  group: 'block',
  atom: true,
  selectable: true,
  draggable: false,
  addOptions: () => ({ view: null }),
  addAttributes: () => ({
    block: {
      default: null,
      // Copied and pasted, it keeps its fields.
      parseHTML: (element: HTMLElement) => {
        try {
          return JSON.parse(element.getAttribute('data-lesson-example') ?? '') as LessonBlock
        } catch {
          return null
        }
      },
      renderHTML: (attributes: Record<string, unknown>) => ({
        'data-lesson-example': JSON.stringify(attributes['block']),
      }),
    },
  }),
  parseHTML: () => [{ tag: 'div[data-lesson-example]' }],
  renderHTML: ({ HTMLAttributes }) => ['div', HTMLAttributes],
  addNodeView() {
    return this.options.view
  },
})

/** What a text, a heading or a step carries of the lesson: its whole block, its words in both languages. */
const Carried = Extension.create({
  name: 'carried',
  addGlobalAttributes: () => [
    { types: [DOC.paragraph, DOC.steps], attributes: { block: carried } },
    { types: [DOC.heading, DOC.step], attributes: { text: carried } },
  ],
})

/** Alt+↑ and Alt+↓ move the block the caret is in past its neighbour. */
const MoveBlocks = Extension.create({
  name: 'moveBlocks',
  addKeyboardShortcuts() {
    const move = (by: -1 | 1) => () => {
      const tr = moveBlock(this.editor.state, by)
      if (tr) this.editor.view.dispatch(tr)
      return true
    }
    return { 'Alt-ArrowUp': move(-1), 'Alt-ArrowDown': move(1) }
  },
})

/**
 * The lesson document's schema (round 21): its title and summary, sections' headings (h2 only),
 * paragraphs with a bold lead, numbered steps, notes, takeaways and examples as atoms (drawn by
 * `exampleView` where given); Alt+↑/↓ moving blocks; TipTap's own undo, drop cursor and trailing line.
 */
export function docExtensions({
  exampleView = null,
  more = [],
}: {
  exampleView?: NodeViewRenderer | null
  more?: readonly AnyExtension[]
} = {}): AnyExtension[] {
  return [
    StarterKit.configure({
      document: false,
      blockquote: false,
      bulletList: false,
      code: false,
      codeBlock: false,
      hardBreak: false,
      horizontalRule: false,
      italic: false,
      link: false,
      strike: false,
      underline: false,
      heading: { levels: [2] },
      dropcursor: { width: 3, class: 'doc-drop-cursor' },
    }),
    LessonDoc,
    LessonTitle,
    LessonSummary,
    Takeaway,
    Note,
    NoteRule,
    NoteText,
    LessonExample.configure({ view: exampleView }),
    Carried,
    MoveBlocks,
    ...more,
  ]
}
