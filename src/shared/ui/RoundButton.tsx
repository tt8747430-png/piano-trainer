import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Button } from './primitives/button'

/** A 44px round icon button, named by its label. A round link is `RoundLink`. */
export function RoundButton({
  label,
  icon: Icon,
  ...props
}: { label: string; icon: LucideIcon } & Omit<
  ComponentProps<typeof Button>,
  'children' | 'render' | 'nativeButton'
>) {
  return (
    <Button variant="surface" size="icon" aria-label={label} {...props}>
      <Icon aria-hidden />
    </Button>
  )
}
