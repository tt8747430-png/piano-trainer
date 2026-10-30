import type { Editor } from '@tiptap/core'
import type { TFunction } from 'i18next'
import {
  ArrowDown,
  ArrowUp,
  BookMarked,
  CircleHelp,
  Copy,
  Grid3x3,
  Heading2,
  ListMusic,
  ListOrdered,
  MoveVertical,
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
import { canMoveBlock, FIXED_BLOCKS } from '../../model/doc-blocks'
import { insertableName, nodeName } from './block-names'
import { actOnBlock, insertBlock, INSERTABLES, type Insertable } from './commands'

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
  question: CircleHelp,
}

/** The Insert menu's and the slash menu's rows: every kind, its picture and its name. */
export function insertActions(
  editor: Editor,
  locale: Locale,
  t: TFunction<'learn'>,
  before?: () => void,
): MenuAction[] {
  return INSERTABLES.map((kind) => ({
    key: kind,
    label: insertableName(kind, t),
    icon: INSERT_ICONS[kind],
    onSelect: () => {
      before?.()
      insertBlock(editor, kind, locale)
    },
  }))
}

/**
 * Block `index`'s menu: moved up or down, copied, deleted (said, with Undo). Its moves are the
 * keyboard's and a screen reader's way to do what dragging its handle does.
 */
export function blockActions(editor: Editor, index: number, t: TFunction<'learn'>): MenuAction[] {
  const { doc } = editor.state
  const node = doc.maybeChild(index)
  const fixed = index < FIXED_BLOCKS || !node
  return [
    {
      key: 'up',
      label: t('edit.doc.moveUp'),
      icon: ArrowUp,
      disabled: !canMoveBlock(doc, index, -1),
      onSelect: () => actOnBlock(editor, index, 'up'),
    },
    {
      key: 'down',
      label: t('edit.doc.moveDown'),
      icon: ArrowDown,
      disabled: !canMoveBlock(doc, index, 1),
      onSelect: () => actOnBlock(editor, index, 'down'),
    },
    {
      key: 'duplicate',
      label: t('edit.doc.duplicate'),
      icon: Copy,
      disabled: fixed,
      onSelect: () => actOnBlock(editor, index, 'duplicate'),
    },
    {
      key: 'remove',
      label: t('edit.doc.remove'),
      icon: Trash2,
      destructive: true,
      disabled: fixed,
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
