import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShortcuts } from '@/shared/lib/shortcuts'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/ui/primitives/input-group'

/**
 * The Songs search: a search box with a clear button while it holds text; `/` puts the cursor in it.
 * It holds what is typed itself: the URL it writes to catches up later, in a transition, and a box
 * that showed the URL would drop a key typed meanwhile and move the caret to the end. A value the
 * URL gets from elsewhere (Back, Show all) is shown.
 */
export function SearchField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const { t } = useTranslation('songs')
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
  useShortcuts(t('title'), [
    { label: t('search'), combo: { key: '/' }, run: () => input.current?.focus() },
  ])
  return (
    <InputGroup className="h-12 rounded-2xl bg-card">
      <InputGroupAddon>
        <Search aria-hidden className="size-5" />
      </InputGroupAddon>
      <InputGroupInput
        ref={input}
        type="search"
        aria-label={t('search')}
        placeholder={t('search')}
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
