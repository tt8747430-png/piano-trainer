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
