import type { ReactNode } from 'react'

/** A setting of the Metronome as a sentence's part: its words on the left, its control on the right. */
export function MetronomeRow({
  label,
  setting,
  children,
}: {
  label: string
  /** The preference it sets (`data-setting`): the one page drawing it is its home (R18). */
  setting?: string
  children: ReactNode
}) {
  return (
    <div
      data-setting={setting}
      className="flex min-h-12 items-center justify-between gap-3 text-lg"
    >
      <span className="min-w-0">{label}</span>
      <div className="flex shrink-0 items-center">{children}</div>
    </div>
  )
}
