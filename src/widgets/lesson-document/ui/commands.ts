import type { Editor } from '@tiptap/core'
import { closeHistory } from '@tiptap/pm/history'
import { NodeSelection, TextSelection } from '@tiptap/pm/state'
import { blankBlock, type InsertableBlock, type LessonBlock } from '@/entities/lesson'
import { PATTERN_IDS } from '@/entities/pattern'
import { piecesPlaying } from '@/entities/piece'
import type { Locale } from '@/shared/i18n'
import {
  blockStart,
  duplicateBlock,
  fixedBlocks,
  moveBlock,
  removeBlock,
  selectedBlock,
  turnBlockInto,
  type TurnInto,
} from '../model/doc-blocks'
import { blockNode, DOC, type DocNode } from '../model/lesson-doc'

/**
 * What the Insert menu and the slash menu put in: a lesson's block, or a pattern heard over a piece
 * that plays it. A section's heading and its In short are made from words, by Turn into.
 */
export type Insertable = InsertableBlock | 'pattern'

/** The Insert menu's kinds in the board's order (`r47_edit.py`'s INSERT): words, music, then ask and link. */
export const INSERTABLES: readonly Insertable[] = [
  'text',
  'steps',
  'note',
  'rule',
  'chords',
  'grid',
  'scale',
  'interval',
  'notes',
  'voicings',
  'pattern',
  'progression',
  'variants',
  'question',
  'link',
  'image',
]

/** What a page's About offers (R29 B9): the lesson's kinds but a question, which needs the lesson's keys. */
export const ABOUT_INSERTABLES: readonly Insertable[] = INSERTABLES.filter(
  (kind) => kind !== 'question',
)

/** A first pattern to write over: the first built-in one some piece plays, over that piece. */
export function firstPattern(): LessonBlock | null {
  for (const pattern of PATTERN_IDS) {
    const piece = piecesPlaying(pattern)[0]
    if (piece) return { kind: 'pattern', pattern, piece: piece.id }
  }
  return null
}

const nodeOf = (kind: Insertable, locale: Locale): DocNode | null => {
  const block = kind === 'pattern' ? firstPattern() : blankBlock(kind)
  return block ? blockNode(block, locale) : null
}

/**
 * Puts a new block after the one the caret is in (in place of an empty line of its own), the caret
 * in its first words, or the example selected.
 */
export function insertBlock(editor: Editor, kind: Insertable, locale: Locale): void {
  const made = nodeOf(kind, locale)
  if (!made) return
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
  const node = state.schema.nodeFromJSON(made)
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

/** What the block menu does to block `index`. */
type BlockAct = 'up' | 'down' | 'duplicate' | 'remove'

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
