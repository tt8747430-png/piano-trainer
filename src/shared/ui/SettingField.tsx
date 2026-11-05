import type { ReactNode } from 'react'
import { InfoTip } from './InfoTip'
import { lastWord } from './last-word'

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
 * does in one line under it (`description`, R32) or in an `InfoTip` beside it (ADR 0096), and its
 * control, under the name or at its right (`layout`).
 */
export function SettingField({
  label,
  description,
  info,
  layout = 'under',
  setting,
  children,
}: {
  label: string
  /** What it does, in one line under its name (R32): every option in Settings says what it does. */
  description?: string | undefined
  /** What it does, opened from the ⓘ beside the name. */
  info?: ReactNode
  layout?: keyof typeof LAYOUT
  /** The preference it sets (`data-setting`): the one page drawing it is its home (R18). */
  setting?: string
  children: ReactNode
}) {
  const { head, last } = lastWord(label)
  return (
    <div data-slot="setting-field" data-setting={setting} className={LAYOUT[layout]}>
      {/* The ⓘ goes with the name's last word, never alone at a line's start. */}
      <span className="flex min-w-0 flex-col">
        <span className="text-foreground">
          {head ? `${head} ` : null}
          <span className="whitespace-nowrap">
            {last}
            {info ? (
              <InfoTip name={label} className="ms-1.5 align-middle">
                {info}
              </InfoTip>
            ) : null}
          </span>
        </span>
        {description ? <span className="text-sm text-muted-foreground">{description}</span> : null}
      </span>
      {children}
    </div>
  )
}
