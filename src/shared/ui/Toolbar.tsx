import { useRef, type ComponentProps } from 'react'
import { useRovingFocus } from '@/shared/lib'

/**
 * A row of controls that acts on one thing (a selection's acts, the Player's transport, a block's
 * tools), as WAI-ARIA's toolbar: one stop of the Tab key, ← → along its buttons, Home and End to its
 * ends (`vertical`: ↑ ↓ too). A radio group or a field inside it keeps its own stop and arrows.
 */
export function Toolbar({
  label,
  vertical = false,
  ...props
}: Omit<ComponentProps<'div'>, 'role' | 'aria-label' | 'onFocus' | 'onKeyDown'> & {
  label: string
  vertical?: boolean
}) {
  const row = useRef<HTMLDivElement>(null)
  const roving = useRovingFocus(row, vertical)
  return (
    <div
      {...props}
      ref={row}
      role="toolbar"
      aria-label={label}
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      onFocus={roving.onFocus}
      onKeyDown={roving.onKeyDown}
    />
  )
}
