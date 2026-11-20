import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'
import { InputGroup, InputGroupInput } from './primitives/input-group'

/**
 * A name the learner gives (a song's title, a pattern's or a take's name), the kit's NAMEFIELD: its
 * caption in the soft caps 16 in, 8 over a 52 field of 14 corners, its words 17 and 16 in; the phone's
 * keyboard capitalises each word and offers Done. `className` places the field. Music typed by name is
 * `TypedField`, in the book serif.
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
    <label className={cn('flex flex-col gap-2', className)}>
      <span className="caps mx-4">{label}</span>
      <InputGroup className="h-13 rounded-card bg-card">
        <InputGroupInput
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint="done"
          {...input}
          className="px-4 text-lg md:text-lg"
        />
      </InputGroup>
    </label>
  )
}
