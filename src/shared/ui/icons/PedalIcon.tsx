import type { SVGProps } from 'react'

/**
 * The sustain pedal seen from above (R29 A26): its foot plate, wider at the toe, on its pivot rod,
 * drawn as lucide draws its icons (24 box, 2px line, round ends), in place of the 𝆮 text glyph.
 */
export function PedalIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M8 3h8l2 13a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3Z" />
      <path d="M12 19v3" />
      <path d="M9 8h6" />
    </svg>
  )
}
