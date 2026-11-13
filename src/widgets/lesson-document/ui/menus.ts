import type { Editor } from '@tiptap/core'
import type { TFunction } from 'i18next'
import {
  BookMarked,
  CircleHelp,
  Copy,
  Grid3x3,
  Heading2,
  Image,
  KeyboardMusic,
  Link2,
  ListMusic,
  ListOrdered,
  MoveVertical,
  Paintbrush,
  Music,
  Music2,
  Pilcrow,
  Quote,
  StickyNote,
  Trash2,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import type { Locale } from '@/shared/i18n'
import { say, type MenuAction } from '@/shared/ui'
import { blockTurn, fixedBlocks, TURN_INTO, type TurnInto } from '../model/doc-blocks'
import { insertableName, nodeName } from './block-names'
import {
  ABOUT_INSERTABLES,
  actOnBlock,
  insertBlock,
  INSERTABLES,
  turnInto,
  type Insertable,
} from './commands'

export const INSERT_ICONS: Record<Insertable, LucideIcon> = {
  section: Heading2,
  text: Pilcrow,
  steps: ListOrdered,
  note: StickyNote,
  rule: BookMarked,
  takeaway: Quote,
  chords: Music,
  notes: Music2,
  progression: ListMusic,
  grid: Grid3x3,
  scale: TrendingUp,
  interval: MoveVertical,
  voicings: KeyboardMusic,
  question: CircleHelp,
  link: Link2,
  image: Image,
}

/** Which group of the Insert menu a kind is in: words, music, or what asks or leads on. */
const GROUP_OF: Record<Insertable, 'text' | 'music' | 'learner'> = {
  section: 'text',
  text: 'text',
  steps: 'text',
  note: 'text',
  rule: 'text',
  takeaway: 'text',
  chords: 'music',
  notes: 'music',
  progression: 'music',
  grid: 'music',
  scale: 'music',
  interval: 'music',
  voicings: 'music',
  question: 'learner',
  link: 'learner',
  image: 'text',
}

/** The Insert menu's and the slash menu's rows: every kind, its picture, its name and its group. */
export function insertActions(
  editor: Editor,
  locale: Locale,
  t: TFunction<'learn'>,
  before?: () => void,
): MenuAction[] {
  // A page's About has no title or summary of its own, and no question.
  const kinds = fixedBlocks(editor.state.doc) === 0 ? ABOUT_INSERTABLES : INSERTABLES
  return kinds.map((kind) => ({
    key: kind,
    group: t(`edit.doc.groups.${GROUP_OF[kind]}`),
    label: insertableName(kind, t),
    icon: INSERT_ICONS[kind],
    // Once the menu has closed and given the focus back to its button: the caret then goes into
    // the new block.
    onSelect: () =>
      void setTimeout(() => {
        before?.()
        insertBlock(editor, kind, locale)
      }),
  }))
}

/** Turn into's kinds, each its picture: the Insert menu's own. */
const TURN_ICONS: Record<TurnInto, LucideIcon> = {
  text: Pilcrow,
  section: Heading2,
  steps: ListOrdered,
  note: StickyNote,
  takeaway: Quote,
}

/**
 * Block `index`'s menu (round 28, Notion's): words turned into another kind (ticked as what they
 * are), copied, deleted (said, with Undo). It is moved by dragging its handle, or Alt+↑/↓: never Move
 * up/down in a menu (the owner's rule).
 */
export function blockActions(
  editor: Editor,
  index: number,
  t: TFunction<'learn'>,
  /** Opens the block's style (R29 B9): its Style…, where the document offers one. */
  onStyle?: ((index: number) => void) | null,
): MenuAction[] {
  const { doc } = editor.state
  const node = doc.maybeChild(index)
  const fixed = index < fixedBlocks(doc) || !node
  const is = node ? blockTurn(node) : null
  return [
    ...(is === null || fixed
      ? []
      : TURN_INTO.map((into) => ({
          key: `turn-${into}`,
          group: t('edit.doc.turnInto'),
          label: t(`edit.doc.turn.${into}`),
          icon: TURN_ICONS[into],
          checked: into === is,
          onSelect: () => turnInto(editor, index, into),
        }))),
    ...(onStyle && !fixed
      ? [
          {
            key: 'style',
            label: t('edit.doc.style'),
            icon: Paintbrush,
            onSelect: () => onStyle(index),
          },
        ]
      : []),
    {
      key: 'duplicate',
      label: t('edit.doc.duplicate'),
      icon: Copy,
      hidden: fixed,
      onSelect: () => actOnBlock(editor, index, 'duplicate'),
    },
    {
      key: 'remove',
      label: t('edit.doc.remove'),
      icon: Trash2,
      destructive: true,
      hidden: fixed,
      onSelect: () => {
        const name = node ? nodeName(node, t) : ''
        if (!actOnBlock(editor, index, 'remove')) return
        say(t('edit.doc.removed', { name }), {
          label: t('edit.order.undo'),
          onClick: () => editor.commands.undo(),
        })
      },
    },
  ]
}
