import type { Editor } from '@tiptap/core'
import { closeHistory } from '@tiptap/pm/history'
import { NodeSelection, TextSelection } from '@tiptap/pm/state'
import { blankBlock, type InsertableBlock } from '@/entities/lesson'
import type { Locale } from '@/shared/i18n'
import {
  blockStart,
  duplicateBlock,
  fixedBlocks,
  lineAfter,
  moveBlock,
  removeBlock,
  selectedBlock,
  turnBlockInto,
  type TurnInto,
} from '../model/doc-blocks'
import { blockNode, DOC, type DocNode } from '../model/lesson-doc'

/** What the Insert menu and the slash menu put in: a lesson's block, a section's heading or takeaway. */
export type Insertable = InsertableBlock | 'section' | 'takeaway'

export const INSERTABLES: readonly Insertable[] = [
  'section',
  'text',
  'steps',
  'note',
  'rule',
  'takeaway',
  'chords',
  'notes',
  'progression',
  'grid',
  'scale',
  'interval',
  'voicings',
  'question',
  'link',
  'image',
]

/** What a page's About offers (R29 B9): the lesson's kinds but a question, which needs the lesson's keys. */
export const ABOUT_INSERTABLES: readonly Insertable[] = INSERTABLES.filter(
  (kind) => kind !== 'question',
)

const nodeOf = (kind: Insertable, locale: Locale): DocNode =>
  kind === 'section'
    ? { type: DOC.heading, attrs: { level: 2 } }
    : kind === 'takeaway'
      ? { type: DOC.takeaway }
      : blockNode(blankBlock(kind), locale)

/**
 * Puts a new block after the one the caret is in (in place of an empty line of its own), the caret
 * in its first words, or the example selected.
 */
export function insertBlock(editor: Editor, kind: Insertable, locale: Locale): void {
  const { state } = editor
  const fixed = fixedBlocks(state.doc)
  const index = Math.max(selectedBlock(state), fixed - 1)
  const here = state.doc.maybeChild(index)
  const empty =
    index >= fixed &&
    here?.type.name === DOC.paragraph &&
    here.content.size === 0 &&
    !here.attrs['block']
  const at = blockStart(state.doc, empty ? index : index + 1)
  const node = state.schema.nodeFromJSON(nodeOf(kind, locale))
  const tr = empty
    ? state.tr.replaceWith(at, at + (here?.nodeSize ?? 0), node)
    : state.tr.insert(at, node)
  tr.setSelection(
    node.isAtom ? NodeSelection.create(tr.doc, at) : TextSelection.near(tr.doc.resolve(at + 1)),
  )
  editor.view.dispatch(tr.scrollIntoView())
  editor.view.focus()
}

/** Block `index` of words turned into `into` (its menu's Turn into), the caret in it. */
export function turnInto(editor: Editor, index: number, into: TurnInto): void {
  const tr = turnBlockInto(editor.state, index, into)
  if (!tr) return
  editor.view.dispatch(closeHistory(tr))
  editor.view.focus()
}

/** An empty line under block `index` with `/` typed: what can go there, in the `/` menu. */
export function addLineAfter(editor: Editor, index: number): void {
  const tr = lineAfter(editor.state, index)
  if (!tr) return
  editor.view.dispatch(closeHistory(tr))
  editor.view.focus()
}

/** What the block menu does to block `index`. */
export type BlockAct = 'up' | 'down' | 'duplicate' | 'remove'

/** Moves, copies or takes out block `index`; false where it cannot. */
export function actOnBlock(editor: Editor, index: number, act: BlockAct): boolean {
  const { state } = editor
  const tr =
    act === 'up' || act === 'down'
      ? moveBlock(state, act === 'up' ? -1 : 1, index)
      : act === 'duplicate'
        ? duplicateBlock(state, index)
        : removeBlock(state, index)
  if (!tr) return false
  // Each its own step to undo: Undo after a delete puts back the block, and only it.
  editor.view.dispatch(closeHistory(tr))
  return true
}
