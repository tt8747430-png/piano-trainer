import type { SVGProps } from 'react'

/**
 * A metronome (R31-P): its pyramid case, its pendulum swung, the weight on it, drawn as lucide draws
 * its icons (24 box, 2px line, round ends), in place of a stopwatch nobody reads as one.
 */
export function MetronomeIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M9 3h6l4 18H5Z" />
      <path d="m12 16 5-10" />
      <path d="M13.5 11h2" />
      <path d="M7 17h10" />
    </svg>
  )
}
