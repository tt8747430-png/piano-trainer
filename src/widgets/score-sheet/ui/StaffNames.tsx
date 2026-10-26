import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { PIANO_STAVES } from '@/shared/lib/notation'
import type { ScoreLayout } from '@/shared/ui/score'
import type { EditPrinted } from '../model/printed'
import { useSheetLayerName } from '../model/use-layer-name'

/** How far a name's target reaches past its letters, in CSS px. */
const REACH = 6

/**
 * A button over each staff's name printed at the first line's head (ADR 0094, 0097): each single
 * staff's (its own name, or the editor's placeholder for a staff with none) and the piano's, each
 * opening what edits that staff (`edit`), as tall as the staves it names.
 */
export function StaffNames({ layout, edit }: { layout: ScoreLayout; edit: EditPrinted }) {
  const { t } = useTranslation('editor')
  const layerName = useSheetLayerName()
  return (layout.labels ?? []).map((label) => {
    const named =
      label.staves === 'piano'
        ? PIANO_STAVES.map((staff) => layout.staves[staff])
        : [layout.staves[label.staves]]
    const tops = named.flatMap((staff) => (staff ? [staff.top] : []))
    const bottoms = named.flatMap((staff) => (staff ? [staff.bottom] : []))
    const top = Math.min(label.top, ...tops)
    const bottom = Math.max(label.bottom, ...bottoms)
    const name = label.staves === 'piano' ? t('printed.pianoStaves') : layerName(label.staves)
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
