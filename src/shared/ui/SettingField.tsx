import type { ReactNode } from 'react'
import { InfoTip } from './InfoTip'

/**
 * Where a setting's control stands: under its name (a segmented choice, a grid of tiles), or at the
 * right of it (a pop-up button), as a settings list's row has it.
 */
const LAYOUT = {
  under: 'flex flex-col gap-2',
  beside: 'flex flex-wrap items-center justify-between gap-x-3 gap-y-2',
} as const satisfies Record<string, string>

/**
 * One choice in Settings: its name as a row's text (the group around it has the heading), what it
 * does in an `InfoTip` beside the name where its name alone does not say (ADR 0096), and its
 * control, under the name or at its right (`layout`).
 */
export function SettingField({
  label,
  info,
  layout = 'under',
  children,
}: {
  label: string
  /** What it does, opened from the ⓘ beside the name. */
  info?: ReactNode
  layout?: keyof typeof LAYOUT
  children: ReactNode
}) {
  return (
    <div data-slot="setting-field" className={LAYOUT[layout]}>
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="text-foreground">{label}</span>
        {info ? <InfoTip name={label}>{info}</InfoTip> : null}
      </span>
      {children}
    </div>
  )
}
