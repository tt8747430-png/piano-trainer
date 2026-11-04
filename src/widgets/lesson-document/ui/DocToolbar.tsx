import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import { TextSelection } from '@tiptap/pm/state'
import { BubbleMenu } from '@tiptap/react/menus'
import { Bold, Plus, Redo2, Undo2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Locale } from '@/shared/i18n'
import { cn, useMediaQuery } from '@/shared/lib'
import { ActionMenu } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { selectedBlock } from '../model/doc-blocks'
import { DOC } from '../model/lesson-doc'
import { insertActions } from './menus'

function ToolButton({
  label,
  pressed,
  disabled,
  onClick,
  children,
}: {
  label: string
  pressed?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Button
      variant="tool"
      size="icon"
      className="size-11 shrink-0"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      // The caret stays in the document: a tap on the toolbar never takes focus from it.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

/**
 * The document's toolbar (round 24, round 28): Insert, its one accent (every kind of block, grouped),
 * then Undo and Redo. What a block is turned into is its gutter menu's (Turn into), the lead in bold
 * the selected text's bubble: one way to each. One floating capsule at the foot, over the phone's
 * keyboard while it is up.
 */
export function DocToolbar({
  editor,
  locale,
  className,
}: {
  editor: Editor
  locale: Locale
  className?: string
}) {
  const { t } = useTranslation('learn')
  const state = useEditorState({
    editor,
    selector: ({ editor: each }) => ({
      canUndo: each.can().undo(),
      canRedo: each.can().redo(),
    }),
  })
  const chain = () => editor.chain().focus()
  return (
    <div
      role="toolbar"
      aria-label={t('edit.doc.toolbar')}
      className={cn('flex items-center gap-0.5 overflow-x-auto overscroll-x-contain', className)}
    >
      {/* Insert, the toolbar's one accent: every kind of block, grouped. */}
      <ActionMenu
        label={t('edit.doc.insert')}
        trigger={
          <>
            <Plus data-icon="inline-start" aria-hidden />
            {t('edit.doc.insert')}
          </>
        }
        render={
          <Button
            className="h-11 shrink-0 rounded-control px-3"
            onMouseDown={(event) => event.preventDefault()}
          />
        }
        actions={insertActions(editor, locale, t)}
      />
      <span aria-hidden className="mx-1 h-6 w-px shrink-0 bg-border" />
      <ToolButton
        label={t('edit.doc.undo')}
        disabled={!state.canUndo}
        onClick={() => chain().undo().run()}
      >
        <Undo2 aria-hidden />
      </ToolButton>
      <ToolButton
        label={t('edit.doc.redo')}
        disabled={!state.canRedo}
        onClick={() => chain().redo().run()}
      >
        <Redo2 aria-hidden />
      </ToolButton>
    </div>
  )
}

/**
 * The bubble over selected words (round 28, Notion's and Craft's): the lead in bold, the one mark a
 * lesson's text has, where the words can carry it (text and steps). Under the selection on a phone,
 * clear of its own selection menu.
 */
export function TextBubble({ editor }: { editor: Editor }) {
  const { t } = useTranslation('learn')
  const touch = useMediaQuery('(pointer: coarse)')
  const bold = useEditorState({ editor, selector: ({ editor: each }) => each.isActive('bold') })
  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: touch ? 'bottom' : 'top', offset: 8 }}
      shouldShow={({ editor: each, state, from, to }) => {
        if (from === to || !each.isFocused || !(state.selection instanceof TextSelection))
          return false
        const top = state.doc.maybeChild(selectedBlock(state))?.type.name
        return top === DOC.paragraph || top === DOC.steps
      }}
      className="z-40 flex items-center rounded-control border border-border bg-raised p-1 elevation-2"
    >
      <ToolButton
        label={t('edit.doc.lead')}
        pressed={bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold aria-hidden />
      </ToolButton>
    </BubbleMenu>
  )
}
