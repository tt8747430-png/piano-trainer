import type { ReactNode } from 'react'

/**
 * The piano's two views drawn as the canvas's Piano sheet draws them (PIC3D, PIC2D): 48 by 28, a
 * 1.6 line in ink, the black keys filled.
 */
function Picture({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      width="48"
      height="28"
      viewBox="0 0 48 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

/** A piano seen from the seat, its keys running away from you. */
export function Piano3DPicture() {
  return (
    <Picture>
      <path d="M9 6h30l7 18H2z" />
      <path d="M14.5 6 11 24M20 6l-2 18M26 6v18M31.5 6l3 18M37 6l5 18" />
      <path
        d="M12.6 6h3l-1.2 9h-3.4zM18.3 6h3l-.7 9h-3.3zM27.6 6h3l1 9h-3.3zM33.3 6h3l1.9 9h-3.4z"
        fill="currentColor"
      />
    </Picture>
  )
}

/** The keys seen from above, flat. */
export function Piano2DPicture() {
  return (
    <Picture>
      <rect x="2" y="4" width="44" height="20" rx="2" />
      <path d="M8.3 4v20M14.6 4v20M20.9 4v20M27.1 4v20M33.4 4v20M39.7 4v20" />
      <path
        d="M6.5 4h3.6v11H6.5zM12.8 4h3.6v11h-3.6zM25.3 4h3.6v11h-3.6zM31.6 4h3.6v11h-3.6zM37.9 4h3.6v11h-3.6z"
        fill="currentColor"
      />
    </Picture>
  )
}
