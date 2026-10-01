import { Square } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'
import { Button } from './primitives/button'

/**
 * A chord or a note to tap: pressed while it sounds, with a square in its corner (tap again to
 * stop). What it holds, and its size, are its caller's.
 */
export function PlayToggle({
  playing,
  className,
  children,
  ...props
}: { playing: boolean } & Omit<ComponentProps<typeof Button>, 'variant' | 'aria-pressed'>) {
  return (
    <Button
      variant="outline"
      aria-pressed={playing}
      className={cn(
        'relative aria-pressed:bg-secondary aria-pressed:text-secondary-foreground',
        className,
      )}
      {...props}
    >
      {playing ? <Square aria-hidden className="absolute top-1.5 right-1.5 size-3" /> : null}
      {children}
    </Button>
  )
}
