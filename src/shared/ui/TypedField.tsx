import { useId } from 'react'
import { cn } from '@/shared/lib'
import { InputGroup, InputGroupInput } from './primitives/input-group'

/**
 * Music typed by name (a chord, a progression) in the book serif, its label over it and, while it
 * cannot be read, `error` under it. An empty field is being typed again, never wrong.
 */
export function TypedField({
  label,
  value,
  error,
  onChange,
  className,
}: {
  label: string
  value: string
  error: string | null
  onChange: (value: string) => void
  className?: string
}) {
  const errorId = useId()
  const shown = value.trim() === '' ? null : error
  return (
    <label className={cn('flex flex-col gap-1', className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <InputGroup className="h-12 rounded-2xl bg-card">
        <InputGroupInput
          value={value}
          aria-invalid={shown !== null}
          aria-describedby={shown === null ? undefined : errorId}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => onChange(event.target.value)}
          className="font-display text-xl font-semibold md:text-xl"
        />
      </InputGroup>
      {shown === null ? null : (
        <span id={errorId} className="text-sm text-destructive">
          {shown}
        </span>
      )}
    </label>
  )
}
