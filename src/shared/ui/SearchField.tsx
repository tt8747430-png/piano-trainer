import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useShortcuts } from '@/shared/lib/shortcuts'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './primitives/input-group'

/**
 * A screen's search box, with a clear button while it holds text and, joined to its end, what sorts
 * what it finds (`end`); `/` puts the cursor in it (a
 * sheet's box, of no `screen`, leaves `/` to the screen's own). It holds what is typed itself: the URL it writes to catches up later, in a transition, and a box
 * that showed the URL would drop a key typed meanwhile and move the caret to the end. A value the
 * URL gets from elsewhere (Back, Show all) is shown.
 */
export function SearchField({
  value,
  onChange,
  label,
  screen,
  hint,
  end,
  autoFocus = false,
}: {
  value: string
  onChange: (value: string) => void
  /** What it searches, its name and its placeholder: "Search songs". */
  label: string
  /** The screen it is on, which the shortcuts' sheet lists its key under; none in a sheet. */
  screen?: string | undefined
  /** A shorter placeholder where the box is narrow (the label stays its name): "Search". */
  hint?: string
  /** What is joined to its end, after the clear button: the sort of what it searches. */
  end?: ReactNode
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
  useShortcuts(screen ?? '', [{ label, combo: { key: '/' }, run: () => input.current?.focus() }], {
    enabled: screen !== undefined,
  })
  return (
    <InputGroup className="h-12 rounded-2xl bg-card">
      <InputGroupAddon>
        <Search aria-hidden className="size-5" />
      </InputGroupAddon>
      <InputGroupInput
        ref={input}
        type="search"
        aria-label={label}
        placeholder={hint ?? label}
        autoFocus={autoFocus}
        value={text}
        onChange={(event) => type(event.target.value)}
        className="min-w-0 text-base text-ellipsis [&::-webkit-search-cancel-button]:appearance-none"
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
      {end ? (
        <InputGroupAddon
          align="inline-end"
          className="h-full self-stretch py-0 pr-0 has-[>button]:mr-0"
        >
          {end}
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}
