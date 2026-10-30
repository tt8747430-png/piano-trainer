import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import {
  ArrowDown,
  ArrowUp,
  Bold,
  ChevronDown,
  Ellipsis,
  Heading2,
  ListOrdered,
  Pilcrow,
  Plus,
  Redo2,
  StickyNote,
  Undo2,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Locale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { ActionMenu } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { canMoveBlock, FIXED_BLOCKS, selectedBlock } from '../../model/doc-blocks'
import { DOC } from '../../model/lesson-doc'
import { actOnBlock, toggleNote } from './commands'
import { blockActions, insertActions } from './menus'

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
 * The document's toolbar (round 24): Insert first, its one accent (every block kind, grouped); then
 * text or a section's heading, numbered steps or a note, the lead in bold; Undo and Redo; the block
 * the caret is in moved up or down, and its menu (copy, delete). One floating capsule at the foot,
 * over the phone's keyboard while it is up.
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
    selector: ({ editor: each }) => {
      const index = selectedBlock(each.state)
      const top = each.state.doc.maybeChild(index)?.type.name
      return {
        index,
        blocks: each.state.doc.childCount,
        inLesson: index >= FIXED_BLOCKS,
        paragraph: top === DOC.paragraph,
        heading: top === DOC.heading,
        steps: top === DOC.steps,
        note: top === DOC.note,
        bold: each.isActive('bold'),
        canBold: top === DOC.paragraph || top === DOC.steps,
        canUp: canMoveBlock(each.state.doc, index, -1),
        canDown: canMoveBlock(each.state.doc, index, 1),
        canUndo: each.can().undo(),
        canRedo: each.can().redo(),
      }
    },
  })
  const chain = () => editor.chain().focus()
  const styles = [
    {
      key: 'text',
      label: t('edit.doc.text'),
      icon: Pilcrow,
      pressed: state.paragraph,
      run: () => (state.steps ? chain().toggleOrderedList().run() : chain().setParagraph().run()),
    },
    {
      key: 'heading',
      label: t('edit.doc.heading'),
      icon: Heading2,
      pressed: state.heading,
      run: () => chain().toggleHeading({ level: 2 }).run(),
    },
    {
      key: 'steps',
      label: t('edit.doc.steps'),
      icon: ListOrdered,
      pressed: state.steps,
      run: () => chain().toggleOrderedList().run(),
    },
    {
      key: 'note',
      label: t('edit.doc.note'),
      icon: StickyNote,
      pressed: state.note,
      run: () => toggleNote(editor),
    },
  ]
  const current = styles.find((style) => style.pressed) ?? styles[0]!
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
            className="h-11 shrink-0 rounded-xl px-3"
            onMouseDown={(event) => event.preventDefault()}
          />
        }
        actions={insertActions(editor, locale, t)}
      />
      <span aria-hidden className="mx-1 h-6 w-px shrink-0 bg-border max-sm:hidden" />
      {/* Text, a heading, steps or a note: a button each on a laptop, one menu on a phone. */}
      <div className="hidden md:contents">
        {styles.map((style) => (
          <ToolButton
            key={style.key}
            label={style.label}
            pressed={style.pressed}
            disabled={!state.inLesson}
            onClick={style.run}
          >
            <style.icon aria-hidden />
          </ToolButton>
        ))}
      </div>
      <div className="md:hidden">
        <ActionMenu
          label={t('edit.doc.style')}
          trigger={
            <>
              <current.icon data-icon="inline-start" aria-hidden />
              {current.label}
              <ChevronDown data-icon="inline-end" aria-hidden className="text-muted-foreground" />
            </>
          }
          render={
            <Button
              variant="tool"
              className="h-11 shrink-0 gap-1 px-2"
              aria-label={t('edit.doc.style')}
              title={t('edit.doc.style')}
              disabled={!state.inLesson}
              onMouseDown={(event) => event.preventDefault()}
            />
          }
          actions={styles.map(({ key, label, icon, run }) => ({ key, label, icon, onSelect: run }))}
        />
      </div>
      <ToolButton
        label={t('edit.doc.lead')}
        pressed={state.bold}
        disabled={!state.canBold}
        onClick={() => chain().toggleBold().run()}
      >
        <Bold aria-hidden />
      </ToolButton>
      <span aria-hidden className="mx-1 h-6 w-px shrink-0 bg-border max-sm:hidden" />
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
      <span aria-hidden className="mx-1 h-6 w-px shrink-0 bg-border max-sm:hidden" />
      {/* The block the caret is in, moved: what dragging its handle does. */}
      <span className="contents max-sm:hidden">
        <ToolButton
          label={t('edit.doc.moveUp')}
          disabled={!state.inLesson || !state.canUp}
          onClick={() => actOnBlock(editor, state.index, 'up')}
        >
          <ArrowUp aria-hidden />
        </ToolButton>
        <ToolButton
          label={t('edit.doc.moveDown')}
          disabled={!state.inLesson || !state.canDown}
          onClick={() => actOnBlock(editor, state.index, 'down')}
        >
          <ArrowDown aria-hidden />
        </ToolButton>
      </span>
      <div className="shrink-0">
        <ActionMenu
          label={t('edit.doc.block')}
          align="end"
          trigger={<Ellipsis aria-hidden />}
          render={
            <Button
              variant="tool"
              size="icon"
              className="size-11"
              aria-label={t('edit.doc.block')}
              title={t('edit.doc.block')}
              disabled={!state.inLesson}
            />
          }
          actions={blockActions(editor, state.index, t)}
        />
      </div>
    </div>
  )
}
