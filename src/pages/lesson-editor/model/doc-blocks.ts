import type { Node } from '@tiptap/pm/model'
import { NodeSelection, TextSelection, type EditorState, type Transaction } from '@tiptap/pm/state'

/** The document's own first nodes, the lesson's title and summary: never moved, copied or taken out. */
export const FIXED_BLOCKS = 2

/** Where the document's block `index` starts. */
export function blockStart(doc: Node, index: number): number {
  let pos = 0
  for (let i = 0; i < index && i < doc.childCount; i++) pos += doc.child(i).nodeSize
  return pos
}

/** The block the selection is in (its index among the document's own nodes). */
export const selectedBlock = (state: EditorState): number => state.selection.$from.index(0)

/** Whether block `index` may move by `by`: a block of the lesson's, onto another of them. */
export function canMoveBlock(doc: Node, index: number, by: -1 | 1): boolean {
  const to = index + by
  return index >= FIXED_BLOCKS && to >= FIXED_BLOCKS && to < doc.childCount
}

/**
 * The transaction moving block `index` up or down by one, past its neighbour, the selection inside
 * it kept where it was in it; null where it cannot move.
 */
export function moveBlock(
  state: EditorState,
  by: -1 | 1,
  index = selectedBlock(state),
): Transaction | null {
  const { doc, selection } = state
  if (!canMoveBlock(doc, index, by)) return null
  const node = doc.child(index)
  const other = doc.child(index + by)
  const start = blockStart(doc, index)
  const first = by < 0 ? blockStart(doc, index - 1) : start
  const end = first + node.nodeSize + other.nodeSize
  const tr = state.tr.replaceWith(first, end, by < 0 ? [node, other] : [other, node])
  const moved = by < 0 ? first : first + other.nodeSize
  const inside = selection.from >= start && selection.to <= start + node.nodeSize
  if (selection instanceof NodeSelection && selection.from === start)
    tr.setSelection(NodeSelection.create(tr.doc, moved))
  else if (inside)
    tr.setSelection(
      TextSelection.create(tr.doc, moved + selection.from - start, moved + selection.to - start),
    )
  return tr.scrollIntoView()
}

/**
 * The transaction moving block `from` to stand at index `to` (a block dragged and dropped), selected
 * there whole; never above the title and summary, null where it would not move.
 */
export function moveBlockTo(state: EditorState, from: number, to: number): Transaction | null {
  const { doc } = state
  const last = doc.childCount - 1
  const at = Math.min(Math.max(to, FIXED_BLOCKS), last)
  if (from < FIXED_BLOCKS || from > last || at === from) return null
  const node = doc.child(from)
  const start = blockStart(doc, from)
  const tr = state.tr.delete(start, start + node.nodeSize)
  const into = blockStart(tr.doc, at)
  tr.insert(into, node)
  tr.setSelection(NodeSelection.create(tr.doc, into))
  return tr.scrollIntoView()
}

/** The transaction putting a copy of block `index` after it; null for the title and summary. */
export function duplicateBlock(state: EditorState, index: number): Transaction | null {
  if (index < FIXED_BLOCKS || index >= state.doc.childCount) return null
  const node = state.doc.child(index)
  return state.tr.insert(blockStart(state.doc, index) + node.nodeSize, node)
}

/** The transaction taking block `index` out; null for the title and summary. */
export function removeBlock(state: EditorState, index: number): Transaction | null {
  if (index < FIXED_BLOCKS || index >= state.doc.childCount) return null
  const start = blockStart(state.doc, index)
  return state.tr.delete(start, start + state.doc.child(index).nodeSize)
}

/** What a block of words can be turned into (its menu's Turn into, round 28). */
export const TURN_INTO = ['text', 'section', 'steps', 'note', 'takeaway'] as const
export type TurnInto = (typeof TURN_INTO)[number]

const TURN_OF: Record<string, TurnInto> = {
  paragraph: 'text',
  heading: 'section',
  orderedList: 'steps',
  note: 'note',
  takeaway: 'takeaway',
}

/** What a block of words is, among what it can be turned into; null for an example, title or summary. */
export const blockTurn = (node: Node): TurnInto | null => TURN_OF[node.type.name] ?? null

type Both = { en: string; ru: string }

/** A line of a block's words, with both languages where the block carried them. */
interface Line {
  readonly text: string
  readonly both: Both | null
}

const isBoth = (value: unknown): value is Both =>
  typeof value === 'object' && value !== null && 'en' in value && 'ru' in value

/** The lines a block of words holds: a step each, a rule and its note, else its words. */
function linesOf(node: Node): Line[] {
  const block = node.attrs['block'] as Record<string, unknown> | null | undefined
  const lines: Line[] = []
  switch (node.type.name) {
    case 'orderedList':
      node.forEach((step) => {
        const text = step.attrs['text'] as unknown
        lines.push({ text: step.textContent, both: isBoth(text) ? text : null })
      })
      return lines
    case 'note':
      node.forEach((part) => {
        const carried = part.type.name === 'noteRule' ? block?.['rule'] : block?.['text']
        if (part.textContent || node.childCount === 1)
          lines.push({ text: part.textContent, both: isBoth(carried) ? carried : null })
      })
      return lines
    case 'paragraph': {
      // A lead in bold reads into the words after it: carried whole only where it has none.
      const both = block?.['kind'] === 'text' && !block['lead'] ? block['text'] : null
      return [{ text: node.textContent, both: isBoth(both) ? both : null }]
    }
    default: {
      const text = node.attrs['text'] as unknown
      return [{ text: node.textContent, both: isBoth(text) ? text : null }]
    }
  }
}

const words = (text: string) => (text === '' ? [] : [{ type: 'text', text }])

/** The nodes `lines` make as `into`: a line each as text or steps, joined as one otherwise. */
function turned(lines: readonly Line[], into: TurnInto): Record<string, unknown>[] {
  const one: Line =
    lines.length === 1 ? lines[0]! : { text: lines.map((each) => each.text).join(' '), both: null }
  switch (into) {
    case 'text':
      return lines.map((each) => ({
        type: 'paragraph',
        attrs: { block: each.both ? { kind: 'text', text: each.both } : null },
        content: words(each.text),
      }))
    case 'steps':
      return [
        {
          type: 'orderedList',
          content: lines.map((each) => ({
            type: 'listItem',
            attrs: { text: each.both },
            content: [{ type: 'paragraph', content: words(each.text) }],
          })),
        },
      ]
    case 'note':
      return [
        {
          type: 'note',
          attrs: { block: one.both ? { kind: 'note', text: one.both } : null },
          content: [{ type: 'noteText', content: words(one.text) }],
        },
      ]
    case 'section':
      return [{ type: 'heading', attrs: { level: 2, text: one.both }, content: words(one.text) }]
    case 'takeaway':
      return [{ type: 'takeaway', attrs: { text: one.both }, content: words(one.text) }]
  }
}

/**
 * The transaction turning block `index` of words into `into` (Notion's Turn into): its lines kept, a
 * step each into steps, a line each into text, joined into one for a heading, a note or a takeaway;
 * a line's other language kept where it stays one line. The caret at the end of its words. Null for
 * an example, the title or summary, or a block already that.
 */
export function turnBlockInto(
  state: EditorState,
  index: number,
  into: TurnInto,
): Transaction | null {
  if (index < FIXED_BLOCKS || index >= state.doc.childCount) return null
  const node = state.doc.child(index)
  const was = blockTurn(node)
  if (!was || was === into) return null
  const nodes = turned(linesOf(node), into).map((each) => state.schema.nodeFromJSON(each))
  const start = blockStart(state.doc, index)
  const tr = state.tr.replaceWith(start, start + node.nodeSize, nodes)
  const end = start + nodes.reduce((size, each) => size + each.nodeSize, 0)
  tr.setSelection(TextSelection.near(tr.doc.resolve(end - 1), -1))
  return tr.scrollIntoView()
}

/**
 * The transaction putting an empty line under block `index` with `/` typed in it, the caret after
 * it: the gutter's + opens the menu of what can go there (Notion's). Null above the lesson's blocks.
 */
export function lineAfter(state: EditorState, index: number): Transaction | null {
  if (index < FIXED_BLOCKS || index >= state.doc.childCount) return null
  const at = blockStart(state.doc, index) + state.doc.child(index).nodeSize
  const line = state.schema.nodes['paragraph']!.create(null, state.schema.text('/'))
  const tr = state.tr.insert(at, line)
  tr.setSelection(TextSelection.create(tr.doc, at + 2))
  return tr.scrollIntoView()
}
