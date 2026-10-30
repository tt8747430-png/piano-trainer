import type { Editor } from '@tiptap/core'
import { closeHistory } from '@tiptap/pm/history'
import { NodeSelection } from '@tiptap/pm/state'
import { useEditorState } from '@tiptap/react'
import { GripVertical } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { useTranslation } from 'react-i18next'
import { ActionMenu } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { blockStart, FIXED_BLOCKS, moveBlockTo, selectedBlock } from '../../model/doc-blocks'
import { nodeName } from './block-names'
import { blockActions } from './menus'

/** The block of the document under the pointer's height, by its index; null over none of them. */
function blockAtY(editor: Editor, y: number): number | null {
  const { doc } = editor.state
  for (let index = FIXED_BLOCKS; index < doc.childCount; index++) {
    const dom = editor.view.nodeDOM(blockStart(doc, index))
    if (!(dom instanceof HTMLElement)) continue
    const box = dom.getBoundingClientRect()
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

/** How far a finger moves on the handle before it drags the block rather than taps its menu. */
const DRAG_SLOP_PX = 8

/**
 * A block's handle in the document's margin (round 21), beside the block under the pointer or the
 * one the caret is in: dragged, it moves the block where it is dropped (the drop cursor shows
 * where), by mouse or by finger (a line shows where it goes); tapped, its menu moves, copies or
 * deletes it. Beside the block the caret is in on a phone, at the text's right.
 */
export function BlockHandle({
  editor,
  frame,
}: {
  editor: Editor
  /** What the handle is placed in: the document's frame, its margin to the left of the text. */
  frame: RefObject<HTMLDivElement | null>
}) {
  const { t } = useTranslation('learn')
  const [hovered, setHovered] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const handle = useRef<HTMLDivElement>(null)
  // A finger's drag: where it started, whether it has moved off a tap, where the block would land.
  const touch = useRef<{ y: number; moving: boolean } | null>(null)
  const [dropAt, setDropAt] = useState<{ index: number; top: number } | null>(null)
  const dragged = useRef(false)
  const caret = useEditorState({
    editor,
    selector: ({ editor: each }) => ({
      index: selectedBlock(each.state),
      blocks: each.state.doc.childCount,
      focused: each.isFocused,
    }),
  })
  useEffect(() => {
    const element = frame.current
    if (!element) return
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setHovered(blockAtY(editor, event.clientY))
    }
    const leave = () => setHovered(null)
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', leave)
    return () => {
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', leave)
    }
  }, [editor, frame])
  const index = hovered ?? (caret.focused || menuOpen ? caret.index : null)
  const node =
    index === null || index < FIXED_BLOCKS ? null : (editor.state.doc.maybeChild(index) ?? null)
  // Beside its block, wherever the block now stands.
  useEffect(() => {
    const element = handle.current
    const box = frame.current
    if (!element || !box || index === null || !node) return
    const dom = editor.view.nodeDOM(blockStart(editor.state.doc, index))
    element.style.top = `${dom instanceof HTMLElement ? dom.getBoundingClientRect().top - box.getBoundingClientRect().top : 0}px`
  }, [editor, frame, index, node, caret.blocks])
  if (index === null || !node) return null
  const label = t('edit.doc.blockMenu', { name: nodeName(node, t) })
  const fingerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') return
    touch.current = { y: event.clientY, moving: false }
    dragged.current = false
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
    dragged.current = true
    const tr = dropAt ? moveBlockTo(editor.state, index, dropAt.index) : null
    if (tr) editor.view.dispatch(closeHistory(tr))
    setDropAt(null)
  }
  return (
    <>
      {dropAt ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-1 rounded-full bg-primary"
          style={{ top: dropAt.top }}
        />
      ) : null}
      <div ref={handle} className="absolute right-0 md:right-auto md:left-0">
        <ActionMenu
          label={label}
          trigger={<GripVertical aria-hidden />}
          render={
            <Button
              variant="ghost"
              size="icon"
              draggable
              aria-label={label}
              title={label}
              className="size-11 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
              // The block its menu acts on stays selected, the handle beside it, while the menu is open.
              onPointerDown={(event) => {
                selectBlock(editor, index)
                setMenuOpen(true)
                fingerDown(event)
              }}
              onPointerMove={fingerMove}
              onPointerUp={fingerUp}
              onPointerCancel={() => {
                touch.current = null
                setDropAt(null)
              }}
              // A finger's drag is no tap: its menu stays shut.
              onClickCapture={(event) => {
                if (!dragged.current) return
                dragged.current = false
                event.preventDefault()
                event.stopPropagation()
              }}
              onDragStart={(event) => startDrag(editor, index, event)}
              onDragEnd={() => endDrag(editor)}
            />
          }
          actions={blockActions(editor, index, t).map((action) => ({
            ...action,
            onSelect: () => {
              action.onSelect()
              setMenuOpen(false)
            },
          }))}
        />
      </div>
    </>
  )
}
