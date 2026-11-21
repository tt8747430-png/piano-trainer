import { Search, X } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { useShortcuts } from '@/shared/lib/shortcuts'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './primitives/input-group'

/**
 * Where the box stands: on a page, in the muted fill; on a sheet of the paper's colour (the Player's
 * Pattern sheet), the card's, 40 tall; at the head of a sidebar's list (the Settings window's), 40
 * tall in the sidebar row's corner and size.
 */
const SURFACES = {
  page: 'h-11 bg-muted dark:bg-muted',
  sheet: 'h-10 bg-card dark:bg-card',
  sidebar: 'h-10 rounded-thumb bg-muted dark:bg-muted [&_input]:text-subhead [&_svg]:size-4.5',
} as const

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
  surface = 'page',
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
  surface?: keyof typeof SURFACES
}) {
  const { t } = useTranslation('common')
  const input = useRef<HTMLInputElement>(null)
  const [text, setText] = useState(value)
  // The value last seen from the URL, and what was typed and not yet seen back from it, oldest first:
  // a value coming back from typing leaves the box as it is; any other value replaces its text.
  const [synced, setSynced] = useState<{ value: string; pending: readonly string[] }>({
    value,
    pending: [],
  })
  if (synced.value !== value) {
    const seen = synced.pending.indexOf(value)
    setSynced({ value, pending: seen >= 0 ? synced.pending.slice(seen + 1) : [] })
    if (seen < 0) setText(value)
  }
  const type = (next: string) => {
    setSynced((current) => ({ ...current, pending: [...current.pending, next] }))
    setText(next)
    onChange(next)
  }
  useShortcuts(screen ?? '', [{ label, combo: { key: '/' }, run: () => input.current?.focus() }], {
    enabled: screen !== undefined,
  })
  return (
    <InputGroup className={cn('rounded-control border-transparent', SURFACES[surface])}>
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
            className="rounded-pill"
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
