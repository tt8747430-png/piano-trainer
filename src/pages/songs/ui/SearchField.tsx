import { Search, X } from 'lucide-react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useShortcuts } from '@/shared/lib/shortcuts'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/ui/primitives/input-group'

/** The Songs search: a search box with a clear button while it holds text; `/` puts the cursor in it. */
export function SearchField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const { t } = useTranslation('songs')
  const input = useRef<HTMLInputElement>(null)
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="text-base"
      />
      {value ? (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon"
            className="rounded-full"
            aria-label={t('clearSearch')}
            onClick={() => onChange('')}
          >
            <X aria-hidden />
          </InputGroupButton>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}
