import type { ReactNode } from 'react'
import { InfoTip } from './InfoTip'

/**
 * A choice under its name on screen, one field of a page's `grid-fields`: the kit's LABELLED, the
 * caption in the soft caps 16 in and 8 over its control, so a sheet's 16 falls between fields. The control inside names
 * itself for a screen reader, so the printed name is for the eye only; what the choice does, where
 * its name alone does not say, is an `InfoTip` beside the name (ADR 0096).
 */
export function Labelled({
  label,
  info,
  children,
}: {
  label: string
  /** What it does, opened from the ⓘ beside the name. */
  info?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span className="mx-4 flex min-w-0 items-center gap-1.5">
        <span aria-hidden className="caps">
          {label}
        </span>
        {info ? <InfoTip name={label}>{info}</InfoTip> : null}
      </span>
      {children}
    </div>
  )
}
