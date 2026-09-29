import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { InputGroup, InputGroupInput } from '@/shared/ui/primitives/input-group'

/** A chord typed by name, with a line under it while it cannot be read. */
export function ChordField({
  label,
  value,
  readable,
  onChange,
}: {
  label: string
  value: string
  readable: boolean
  onChange: (value: string) => void
}) {
  const { t } = useTranslation('learn')
  const errorId = useId()
  return (
    <label className="flex w-36 flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <InputGroup className="h-12 rounded-2xl bg-card">
        <InputGroupInput
          value={value}
          aria-invalid={!readable}
          aria-describedby={readable ? undefined : errorId}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => onChange(event.target.value)}
          className="font-display text-xl font-semibold md:text-xl"
        />
      </InputGroup>
      {readable ? null : (
        <span id={errorId} className="text-sm text-destructive">
          {t('passing.unread')}
        </span>
      )}
    </label>
  )
}
