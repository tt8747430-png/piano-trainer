import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import { useEffect, useId, useState, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import type { Locale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { DOC } from '../../model/lesson-doc'
import { insertActions } from './menus'

/** A key the document hands the slash menu first: true where the menu took it. */
export type SlashKeys = (event: KeyboardEvent) => boolean

/** What is typed after a `/` alone on an empty line of text, the caret at its end; null otherwise. */
function slashQuery(editor: Editor): { query: string; from: number } | null {
  const { selection } = editor.state
  const { $from, empty } = selection
  if (!empty || $from.depth !== 1 || $from.parent.type.name !== DOC.paragraph) return null
  const typed = $from.parent.textContent
  const match = /^\/([^\s/]*)$/.exec(typed)
  if (!match || $from.parentOffset !== typed.length) return null
  return { query: match[1] ?? '', from: $from.start() }
}

/** Where the caret is on screen; none where the page is not laid out. */
function caretBox(editor: Editor, at: number): { bottom: number; left: number } | null {
  try {
    return editor.view.coordsAtPos(at)
  } catch {
    return null
  }
}

/**
 * The `/` menu (round 21): at an empty line, a `/` opens every block kind the Insert menu has,
 * filtered by what is typed after it; ↑ ↓ choose, Enter puts it in place of the line, Escape closes.
 */
export function SlashMenu({
  editor,
  locale,
  frame,
  keysRef,
}: {
  editor: Editor
  locale: Locale
  frame: RefObject<HTMLDivElement | null>
  /** Where the document finds the menu's handling of its keys. */
  keysRef: RefObject<SlashKeys | null>
}) {
  const { t } = useTranslation('learn')
  const id = useId()
  const open = useEditorState({ editor, selector: ({ editor: each }) => slashQuery(each) })
  // The row chosen, for what is typed now: a new letter chooses the first again.
  const [active, setActive] = useState({ query: '', at: 0 })
  const [closedAt, setClosedAt] = useState<number | null>(null)
  const query = open?.query.toLowerCase() ?? ''
  const shown = open !== null && closedAt !== open.from
  const clear = () => {
    const at = slashQuery(editor)
    if (at) editor.view.dispatch(editor.state.tr.delete(at.from, at.from + at.query.length + 1))
  }
  const actions = insertActions(editor, locale, t, clear).filter((action) =>
    action.label.toLowerCase().includes(query),
  )
  const chosen = Math.min(active.query === query ? active.at : 0, Math.max(actions.length - 1, 0))
  useEffect(() => {
    keysRef.current = (event) => {
      if (!shown) return false
      if (event.key === 'Escape') {
        setClosedAt(open.from)
        return true
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const by = event.key === 'ArrowDown' ? 1 : -1
        setActive({ query, at: (chosen + by + actions.length) % Math.max(actions.length, 1) })
        return true
      }
      if (event.key === 'Enter' && actions[chosen]) {
        actions[chosen].onSelect()
        return true
      }
      return false
    }
    return () => {
      keysRef.current = null
    }
  })
  if (!shown || !frame.current) return null
  const box = frame.current.getBoundingClientRect()
  const caret = caretBox(editor, open.from) ?? { bottom: box.top, left: box.left }
  return (
    <div
      role="listbox"
      id={id}
      aria-label={t('edit.doc.slash')}
      className="absolute z-40 flex max-h-80 w-72 flex-col gap-0.5 overflow-y-auto overscroll-contain rounded-2xl border border-hairline bg-popover p-1.5 text-popover-foreground shadow-lg"
      style={{ top: caret.bottom - box.top + 6, left: Math.max(0, caret.left - box.left) }}
    >
      {actions.length === 0 ? (
        <p className="px-3 py-2.5 text-sm text-muted-foreground">{t('edit.doc.noMatch')}</p>
      ) : (
        actions.map((action, at) => {
          const Icon = action.icon
          return (
            <button
              key={action.key}
              type="button"
              role="option"
              aria-selected={at === chosen}
              className={cn(
                'flex min-h-11 items-center gap-3 rounded-xl px-3 text-left text-sm transition-colors duration-150 ease-out hover:bg-muted',
                at === chosen && 'bg-muted',
              )}
              onMouseDown={(event) => event.preventDefault()}
              onClick={action.onSelect}
            >
              {Icon ? <Icon aria-hidden className="size-4 text-muted-foreground" /> : null}
              {action.label}
            </button>
          )
        })
      )}
    </div>
  )
}
