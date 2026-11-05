import { cn } from '@/shared/lib'

/**
 * A piano's pedal as a 20px line icon (R34): its plate on the shank, drawn in the text's colour, as
 * lucide draws its icons. The bar's pedal buttons wear it; the Pedals setting's pictures repeat it.
 */
export function PedalIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-5', className)}
    >
      <path d="M10.5 3h3v7h-3z" />
      <path d="M3 12h18l-1.2 6.2A3 3 0 0 1 16.9 21H7.1a3 3 0 0 1-2.9-2.8Z" />
      <path d="M6.5 15.5h11" />
    </svg>
  )
}
