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
 * does in an `InfoTip` beside it (`info`, or `description` as plain words; ADR 0096, never a line
 * under it, canvas 131), and its control, under the name or at its right (`layout`).
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
  /** What it does in plain words, opened from the ⓘ beside the name where `info` is not given. */
  description?: string | undefined
  /** What it does, opened from the ⓘ beside the name. */
  info?: ReactNode
  layout?: keyof typeof LAYOUT
  /** The preference it sets (`data-setting`): the one page drawing it is its home (R18). */
  setting?: string
  children: ReactNode
}) {
  const { head, last } = lastWord(label)
  // Both given: the plain words, then the longer help, in the one ⓘ.
  const tip =
    info && description ? (
      <>
        <p>{description}</p>
        <p className="mt-2">{info}</p>
      </>
    ) : (
      (info ?? description)
    )
  return (
    <div data-slot="setting-field" data-setting={setting} className={LAYOUT[layout]}>
      {/* The ⓘ goes with the name's last word, never alone at a line's start. */}
      <span className="flex min-w-0 flex-col">
        <span className="text-foreground">
          {head ? `${head} ` : null}
          <span className="whitespace-nowrap">
            {last}
            {tip ? (
              <InfoTip name={label} className="ms-1.5 align-middle">
                {tip}
              </InfoTip>
            ) : null}
          </span>
        </span>
      </span>
      {children}
    </div>
  )
}
