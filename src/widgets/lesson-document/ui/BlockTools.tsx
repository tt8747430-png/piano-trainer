import type { Editor } from '@tiptap/core'
import { closeHistory } from '@tiptap/pm/history'
import { NodeSelection } from '@tiptap/pm/state'
import { useEditorState } from '@tiptap/react'
import { Ellipsis, GripVertical } from 'lucide-react'
import {
  use,
  useRef,
  useState,
  type DragEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { ActionMenu } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { blockStart, fixedBlocks, moveBlockTo, selectedBlock } from '../model/doc-blocks'
import { nodeName } from './block-names'
import { blockActions } from './menus'
import { StyleBlock } from './style-block'

/** The block of the document under the pointer's height, by its index; null over none of them. */
function blockAtY(editor: Editor, y: number): number | null {
  const { doc } = editor.state
  for (let index = fixedBlocks(doc); index < doc.childCount; index++) {
    const dom = editor.view.nodeDOM(blockStart(doc, index))
    if (!(dom instanceof HTMLElement)) continue
    const box = dom.getBoundingClientRect()
    // A block not laid out (hidden, or a page not drawn) is under no pointer.
    if (box.height === 0) continue
    if (y >= box.top - 8 && y <= box.bottom + 8) return index
  }
  return null
}

/** Selects block `index` whole: what its menu acts on, and what a drag carries. */
function selectBlock(editor: Editor, index: number): void {
  const { view } = editor
  const at = blockStart(view.state.doc, index)
  view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, at)))
}

/** Starts dragging block `index`: the document drops it where its drop cursor shows, moved. */
function startDrag(editor: Editor, index: number, event: DragEvent): void {
  selectBlock(editor, index)
  const { view } = editor
  const at = blockStart(view.state.doc, index)
  view.dragging = { slice: view.state.selection.content(), move: true }
  const dom = view.nodeDOM(at)
  if (dom instanceof HTMLElement) event.dataTransfer.setDragImage(dom, 0, 0)
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', view.state.doc.child(index).textContent)
}

function endDrag(editor: Editor): void {
  editor.view.dragging = null
}

/** Where a block dropped at index `index` would stand: the top of the block there, in the frame. */
function dropTop(editor: Editor, frame: HTMLElement, index: number): number {
  const dom = editor.view.nodeDOM(blockStart(editor.state.doc, index))
  const top = frame.getBoundingClientRect().top
  return dom instanceof HTMLElement ? dom.getBoundingClientRect().top - top - 4 : 0
}

/** How far a finger moves on Move before it drags the block rather than nothing. */
const DRAG_SLOP_PX = 8

/**
 * The selected block's tools in the document's toolbar (the board's dock, loop 63: "the drag handle
 * reserves space"; Craft and Notion on iOS): Move, dragged by mouse or finger, puts the caret's block
 * where it is dropped (a line in the document shows where); ··· opens its menu (Turn into, Style,
 * Duplicate, Delete). Nothing waits in a margin beside the text: both act on the block the caret is in,
 * and stand dimmed while it is the title or the summary, which keep their place.
 */
export function BlockTools({
  editor,
  frame,
}: {
  editor: Editor
  /** The document's frame: where the line showing a finger's drop is drawn. */
  frame: RefObject<HTMLDivElement | null>
}) {
  const { t } = useTranslation('learn')
  const styleBlock = use(StyleBlock)
  // A finger's drag: where it started, whether it has moved off a tap, where the block would land.
  const touch = useRef<{ y: number; moving: boolean } | null>(null)
  const [dropAt, setDropAt] = useState<{ index: number; top: number } | null>(null)
  const caret = useEditorState({
    editor,
    selector: ({ editor: each }) => ({
      index: selectedBlock(each.state),
      blocks: each.state.doc.childCount,
    }),
  })
  const { index } = caret
  const node =
    index < fixedBlocks(editor.state.doc) ? null : (editor.state.doc.maybeChild(index) ?? null)
  const name = node ? nodeName(node, t) : ''
  const fingerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') return
    touch.current = { y: event.clientY, moving: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const fingerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const start = touch.current
    const box = frame.current
    if (!start || !box) return
    if (!start.moving && Math.abs(event.clientY - start.y) < DRAG_SLOP_PX) return
    start.moving = true
    const over = blockAtY(editor, event.clientY)
    if (over !== null) setDropAt({ index: over, top: dropTop(editor, box, over) })
  }
  const fingerUp = () => {
    const start = touch.current
    touch.current = null
    if (!start?.moving) return
    const tr = dropAt ? moveBlockTo(editor.state, index, dropAt.index) : null
    if (tr) editor.view.dispatch(closeHistory(tr))
    setDropAt(null)
  }
  return (
    <>
      {dropAt && frame.current
        ? createPortal(
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 h-1 rounded-pill bg-primary"
              style={{ top: dropAt.top }}
            />,
            frame.current,
          )
        : null}
      <Button
        variant="tool"
        size="icon"
        draggable={node !== null}
        disabled={node === null}
        aria-label={t('edit.doc.move')}
        title={t('edit.doc.move')}
        className="shrink-0 cursor-grab touch-none active:cursor-grabbing"
        // No preventDefault on its press: that would cancel the mouse's drag before it starts.
        onPointerDown={fingerDown}
        onPointerMove={fingerMove}
        onPointerUp={fingerUp}
        onPointerCancel={() => {
          touch.current = null
          setDropAt(null)
        }}
        onDragStart={(event) => startDrag(editor, index, event)}
        onDragEnd={() => endDrag(editor)}
      >
        <GripVertical aria-hidden />
      </Button>
      {node ? (
        <ActionMenu
          label={t('edit.doc.blockMenu', { name })}
          trigger={<Ellipsis aria-hidden />}
          render={
            <Button
              variant="tool"
              size="icon"
              aria-label={t('edit.doc.blockMenu', { name })}
              title={t('edit.doc.block')}
              className="shrink-0"
              onMouseDown={(event) => event.preventDefault()}
              // Its menu acts on the block chosen whole as it opens.
              onPointerDown={() => selectBlock(editor, index)}
            />
          }
          actions={blockActions(editor, index, t, styleBlock)}
        />
      ) : (
        <Button
          variant="tool"
          size="icon"
          disabled
          aria-label={t('edit.doc.block')}
          title={t('edit.doc.block')}
          className="shrink-0"
        >
          <Ellipsis aria-hidden />
        </Button>
      )}
    </>
  )
}
