import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/ui/primitives/input-group'

/** The Songs search: a search box with a clear button while it holds text. */
export function SearchField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const { t } = useTranslation('songs')
  return (
    <InputGroup className="h-12 rounded-2xl bg-card">
      <InputGroupAddon>
        <Search aria-hidden className="size-5" />
      </InputGroupAddon>
      <InputGroupInput
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
