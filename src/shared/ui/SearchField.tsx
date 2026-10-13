import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShortcuts } from '@/shared/lib/shortcuts'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './primitives/input-group'

/**
 * A screen's search box, with a clear button while it holds text; `/` puts the cursor in it.
 * It holds what is typed itself: the URL it writes to catches up later, in a transition, and a box
 * that showed the URL would drop a key typed meanwhile and move the caret to the end. A value the
 * URL gets from elsewhere (Back, Show all) is shown.
 */
export function SearchField({
  value,
  onChange,
  label,
  screen,
  autoFocus = false,
}: {
  value: string
  onChange: (value: string) => void
  /** What it searches, its name and its placeholder: "Search songs". */
  label: string
  /** The screen it is on, which the shortcuts' sheet lists its key under. */
  screen: string
  /** The cursor starts in it, on a screen that is for searching. */
  autoFocus?: boolean
}) {
  const { t } = useTranslation('common')
  const input = useRef<HTMLInputElement>(null)
  const [text, setText] = useState(value)
  // What was typed and not yet seen back from the URL, oldest first.
  const pending = useRef<string[]>([])
  useEffect(() => {
    const seen = pending.current.indexOf(value)
    if (seen >= 0) pending.current.splice(0, seen + 1)
    else {
      pending.current = []
      setText(value)
    }
  }, [value])
  const type = (next: string) => {
    pending.current.push(next)
    setText(next)
    onChange(next)
  }
  useShortcuts(screen, [{ label, combo: { key: '/' }, run: () => input.current?.focus() }])
  return (
    <InputGroup className="h-12 rounded-2xl bg-card">
      <InputGroupAddon>
        <Search aria-hidden className="size-5" />
      </InputGroupAddon>
      <InputGroupInput
        ref={input}
        type="search"
        aria-label={label}
        placeholder={label}
        autoFocus={autoFocus}
        value={text}
        onChange={(event) => type(event.target.value)}
        className="text-base"
      />
      {text ? (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon"
            className="rounded-full"
            aria-label={t('clearSearch')}
            onClick={() => {
              type('')
              input.current?.focus()
            }}
          >
            <X aria-hidden />
          </InputGroupButton>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}
