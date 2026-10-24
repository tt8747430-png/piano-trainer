import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import type { ScoreLayout } from '@/shared/ui/score'
import type { EditPrinted } from '../model/printed'

/** How far a name's target reaches past its letters, in CSS px. */
const REACH = 6

/**
 * A button over each staff's name printed at the first line's head (ADR 0094): the tune's, the
 * piano's, each opening what edits that staff (`edit`), as tall as the staves it names.
 */
export function StaffNames({ layout, edit }: { layout: ScoreLayout; edit: EditPrinted }) {
  const { t } = useTranslation('editor')
  return (layout.labels ?? []).map((label) => {
    const named =
      label.staves === 'melody'
        ? [layout.staves.melody]
        : [layout.staves.treble, layout.staves.bass]
    const tops = named.flatMap((staff) => (staff ? [staff.top] : []))
    const bottoms = named.flatMap((staff) => (staff ? [staff.bottom] : []))
    const top = Math.min(label.top, ...tops)
    const bottom = Math.max(label.bottom, ...bottoms)
    const name = t(`printed.staves.${label.staves}`)
    return (
      <Fragment key={label.staves}>
        {edit(
          { kind: 'staff', staves: label.staves },
          <button
            type="button"
            tabIndex={-1}
            aria-label={name}
            title={name}
            className="absolute z-30 cursor-pointer rounded-md transition-colors duration-200 ease-out hover:bg-foreground/5"
            style={{
              left: Math.max(0, label.left - REACH),
              width: label.right + REACH - Math.max(0, label.left - REACH),
              top: top - REACH,
              height: bottom - top + 2 * REACH,
            }}
          />,
        )}
      </Fragment>
    )
  })
}
