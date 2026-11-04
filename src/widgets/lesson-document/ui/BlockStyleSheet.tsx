import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_STYLE, sanitiseStyle, type BlockStyle } from '@/shared/lib/style'
import { Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { StyledBlock } from '@/widgets/lesson-view'
import { StyleEditor } from '@/widgets/style-editor'
import { blockStart } from '../model/doc-blocks'
import { nodeName } from './block-names'

/** Sets block `index`'s style in the document (none puts back the page's own look): one step to undo. */
function setBlockStyle(editor: Editor, index: number, style: BlockStyle | null): void {
  const { state } = editor
  if (index >= state.doc.childCount) return
  editor.view.dispatch(state.tr.setNodeAttribute(blockStart(state.doc, index), 'style', style))
}

/**
 * A block's Style (R29 B9), from its ⋯: the style editor in a sheet, its preview the block's own
 * words in the style as it changes; each change set on the block at once (the document saves it);
 * Reset gives it back the page's own look.
 */
export function BlockStyleSheet({
  editor,
  index,
  onClose,
}: {
  editor: Editor
  /** The block styled; null, the sheet shut. */
  index: number | null
  onClose: () => void
}) {
  const { t } = useTranslation(['learn', 'common'])
  const node = useEditorState({
    editor,
    selector: ({ editor: each }) =>
      index === null ? null : (each.state.doc.maybeChild(index) ?? null),
  })
  const saved = node?.attrs['style'] as unknown
  const style = saved ? sanitiseStyle(saved) : DEFAULT_STYLE
  const name = node ? nodeName(node, t) : ''
  const words = node?.textContent.trim() || name
  return (
    <Sheet
      open={index !== null && node !== null}
      onOpenChange={(open) => (open ? undefined : onClose())}
    >
      <SheetContent
        title={t('learn:edit.doc.styleOf', { name })}
        footer={
          <Button
            variant="outline"
            disabled={!saved}
            onClick={() => (index === null ? undefined : setBlockStyle(editor, index, null))}
          >
            {t('common:style.reset')}
          </Button>
        }
      >
        <StyleEditor
          value={style}
          layouts={false}
          onChange={(next) => (index === null ? undefined : setBlockStyle(editor, index, next))}
          preview={
            <StyledBlock style={style}>
              <p className="line-clamp-3 text-lg">{words}</p>
            </StyledBlock>
          }
        />
      </SheetContent>
    </Sheet>
  )
}
