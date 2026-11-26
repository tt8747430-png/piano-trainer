import { cn } from '@/shared/lib'

/**
 * The outline of something being read: the sunken fill in its shape (a line round-ended, a card in
 * the card corner), pulsing where motion is allowed, hidden from a screen reader, which hears the
 * loading's one status instead. Its size and corner come from `className`.
 */
export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden className={cn('block bg-muted motion-safe:animate-pulse', className)} />
}
