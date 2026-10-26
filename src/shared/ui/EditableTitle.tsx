import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

/** Two taps this close together edit the name. */
const DOUBLE_TAP_MS = 300

/**
 * A name renamed where it is printed (Mindscape's): a double tap, or Enter or Space on it, turns it
 * into a field holding it, chosen; Enter or leaving the field saves what it holds (trimmed, and only
 * when it says something new), Escape keeps the old name, and the name takes the focus back. Its
 * page holds whether it is open (`editing`), so a menu's Rename can open it too. In a heading, it is
 * the heading's text.
 */
export function EditableTitle({
  value,
  label,
  hint,
  maxLength,
  editing,
  onEditingChange,
  onRename,
}: {
  value: string
  /** The field's name: "Setlist name". */
  label: string
  /** What the name does, said by its tooltip and to a screen reader: "Rename". */
  hint: string
  maxLength?: number
  editing: boolean
  onEditingChange: (editing: boolean) => void
  onRename: (name: string) => void
}) {
  const [draft, setDraft] = useState(value)
  const field = useRef<HTMLInputElement>(null)
  const name = useRef<HTMLButtonElement>(null)
  const lastTap = useRef(0)
  // Closed by Enter or Escape: the name takes the focus back, and the field's blur saves nothing.
  const settled = useRef(false)
  useEffect(() => {
    if (editing) {
      field.current?.focus()
      field.current?.select()
    } else if (settled.current) {
      settled.current = false
      name.current?.focus()
    }
  }, [editing])

  const open = () => {
    settled.current = false
    setDraft(value)
    onEditingChange(true)
  }
  const close = (save: boolean) => {
    const next = draft.trim()
    if (save && next !== '' && next !== value) onRename(next)
    onEditingChange(false)
  }
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' && event.key !== 'Escape') return
    event.preventDefault()
    settled.current = true
    close(event.key === 'Enter')
  }

  if (editing)
    return (
      <input
        ref={field}
        aria-label={label}
        value={draft}
        maxLength={maxLength}
        autoComplete="off"
        enterKeyHint="done"
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          if (!settled.current) close(true)
        }}
        className="w-full min-w-0 rounded-xl border border-input bg-card px-2"
      />
    )
  return (
    <button
      ref={name}
      type="button"
      title={hint}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        open()
      }}
      onClick={(event) => {
        // A click the keyboard made (Enter on a button clicks it) opened it already.
        if (event.detail === 0) return
        const now = Date.now()
        if (now - lastTap.current < DOUBLE_TAP_MS) {
          lastTap.current = 0
          open()
        } else lastTap.current = now
      }}
      className="max-w-full cursor-text rounded-xl text-start text-balance wrap-break-word transition-colors duration-200 ease-out hover:bg-foreground/5"
    >
      {value}
    </button>
  )
}
