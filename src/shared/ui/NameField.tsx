import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'
import { InputGroup, InputGroupInput } from './primitives/input-group'

/**
 * A name the learner gives (a song's title, a pattern's or a take's name): its label over it, in the
 * controls' face; `className` places the field. Music typed by name is `TypedField`, in the book serif.
 */
export function NameField({
  label,
  className,
  ...input
}: { label: string; className?: string } & Omit<
  ComponentProps<typeof InputGroupInput>,
  'className'
>) {
  return (
    <label className={cn('flex flex-col gap-1', className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <InputGroup className="h-12 rounded-2xl bg-card">
        <InputGroupInput
          autoComplete="off"
          {...input}
          className="text-lg font-semibold md:text-lg"
        />
      </InputGroup>
    </label>
  )
}
