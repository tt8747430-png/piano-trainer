import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Button } from './primitives/button'

/** A 44px round icon button, named by its label, which it says when pointed at. A round link is `RoundLink`. */
export function RoundButton({
  label,
  icon: Icon,
  ...props
}: { label: string; icon: LucideIcon } & Omit<
  ComponentProps<typeof Button>,
  'children' | 'render' | 'nativeButton'
>) {
  return (
    <Button variant="bar" size="icon" aria-label={label} title={label} {...props}>
      <Icon aria-hidden />
    </Button>
  )
}
