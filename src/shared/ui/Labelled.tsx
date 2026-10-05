import type { ReactNode } from 'react'

/**
 * A choice under its name on screen, one field of a page's `grid-fields`. The control inside names
 * itself for a screen reader, so the printed name is for the eye only.
 */
export function Labelled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span aria-hidden className="text-sm text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}
