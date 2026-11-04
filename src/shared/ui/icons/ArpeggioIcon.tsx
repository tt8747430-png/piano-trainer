import type { SVGProps } from 'react'

/**
 * An arpeggio, the chord's notes played one after another from the bottom up: three note heads
 * rising, each on its stem (R29-P4), drawn as lucide draws its icons (24 box, 2px line, round ends).
 */
export function ArpeggioIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={24}
      height={24}
      {...props}
    >
      <circle cx="5" cy="19" r="2" />
      <path d="M7 19V12" />
      <circle cx="12" cy="14" r="2" />
      <path d="M14 14V7" />
      <circle cx="19" cy="9" r="2" />
      <path d="M21 9V2" />
    </svg>
  )
}
