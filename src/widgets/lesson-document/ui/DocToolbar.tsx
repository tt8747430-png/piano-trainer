import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import { Bold, Redo2, Undo2 } from 'lucide-react'
import type { ReactNode, RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import type { Locale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import { selectedBlock } from '../model/doc-blocks'
import { DOC } from '../model/lesson-doc'
import { BlockTools } from './BlockTools'
import { InsertSheet } from './InsertSheet'
import { Toolbar } from '@/shared/ui'

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
      className="shrink-0"
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
 * The document's toolbar, the board's dock (loop 63): Bold (the lead, the one mark a lesson's text has,
 * where the words can carry it), Undo and Redo; the caret's block's Move and ···; then Insert, every
 * kind of block, grouped. One way to each: nothing beside the text, no bubble over it. One floating
 * capsule at the foot, over the phone's keyboard while it is up.
 */
export function DocToolbar({
  editor,
  locale,
  frame,
  className,
}: {
  editor: Editor
  locale: Locale
  /** The document's frame, where a block's drop is shown. */
  frame: RefObject<HTMLDivElement | null>
  className?: string
}) {
  const { t } = useTranslation('learn')
  const state = useEditorState({
    editor,
    selector: ({ editor: each }) => {
      const block = each.state.doc.maybeChild(selectedBlock(each.state))?.type.name
      return {
        canUndo: each.can().undo(),
        canRedo: each.can().redo(),
        bold: each.isActive('bold'),
        canBold: block === DOC.paragraph || block === DOC.steps,
      }
    },
  })
  const chain = () => editor.chain().focus()
  return (
    <Toolbar
      label={t('edit.doc.toolbar')}
      className={cn('flex items-center gap-0.5 overflow-x-auto overscroll-x-contain', className)}
    >
      <ToolButton
        label={t('edit.doc.lead')}
        pressed={state.bold}
        disabled={!state.canBold}
        onClick={() => chain().toggleBold().run()}
      >
        <Bold aria-hidden />
      </ToolButton>
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
      <span aria-hidden className="mx-1 h-6 w-px shrink-0 bg-hairline" />
      <BlockTools editor={editor} frame={frame} />
      <span aria-hidden className="mx-1 h-6 w-px shrink-0 bg-hairline" />
      <InsertSheet editor={editor} locale={locale} />
    </Toolbar>
  )
}
