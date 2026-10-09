import type { ComponentProps } from 'react'

/** A piano's pedal seen from above, hung from its rail: drawn in Lucide's line. */
export function PedalIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M5 3h14" />
      <path d="M10 3v7c0 2-2.5 3.2-2.5 6.5a4.5 4.5 0 0 0 9 0C16.5 13.2 14 12 14 10V3" />
    </svg>
  )
}
