import type { ReactNode } from 'react'

/** A setting of the Metronome as a sentence's part: its words on the left, its control on the right. */
export function MetronomeRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-12 items-center justify-between gap-3 text-lg">
      <span className="min-w-0">{label}</span>
      <div className="flex shrink-0 items-center">{children}</div>
    </div>
  )
}
