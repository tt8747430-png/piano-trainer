import type { ReactNode } from 'react'

/** Keeps its content at the top of the screen, clear of the notch, while the page scrolls under it. */
export function Pinned({ children }: { children: ReactNode }) {
  return <div className="sticky top-0 z-20 -mx-4 bg-background px-4 pt-safe pb-3">{children}</div>
}
