import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { staffLayer } from '@/features/score-editor'
import { hasFinePointer } from '@/shared/lib'
import type { ScoreLayout } from '@/shared/ui/score'
import { headTargets, signTargets, type EditPrinted, type Printed } from '../model/printed'
import { useSheetLayerName } from '../model/use-layer-name'

/**
 * A button over each clef, key and time signature printed on a line (ADR 0114), as Flat's: a tap on
 * one opens what changes it there (`edit`); a key printing no sharps or flats has its place after
 * the line's clefs. A pointer's target, as a bar's: the keyboard has the palette's Clef, Key
 * signature and Time signature. On a touch screen a staff's head signs too narrow to tap are one
 * target whose menu names each (R34, D1).
 */
export function PrintedSigns({
  layout,
  bars,
  keyless,
  edit,
}: {
  layout: ScoreLayout
  /** The piece's bar each of the line's measures is. */
  bars: readonly number[]
  /** Whether the line starts in a key printing no sharps or flats: its place is a target too. */
  keyless: boolean
  edit: EditPrinted
}) {
  const { t } = useTranslation('editor')
  const layerName = useSheetLayerName()
  const [touch] = useState(() => !hasFinePointer())
  const name = (printed: Printed) => {
    const bar = 'bar' in printed ? printed.bar + 1 : 1
    if (printed.kind === 'clef')
      return t('printed.clefAt', { staff: layerName(staffLayer(printed.staff)), bar })
    if (printed.kind === 'signs')
      return t('printed.signsAt', { staff: layerName(staffLayer(printed.staff)), bar })
    return printed.kind === 'time' ? t('printed.timeAt', { bar }) : t('printed.keyAt', { bar })
  }
  const signs = signTargets(layout, bars, keyless)
  const targets = touch && bars[0] !== undefined ? headTargets(signs, bars[0]) : signs
  return targets.map(({ printed, box, staff }) => (
    <Fragment key={`${printed.kind} ${staff} ${'bar' in printed ? printed.bar : ''}`}>
      {edit(
        printed,
        <button
          type="button"
          tabIndex={-1}
          aria-label={name(printed)}
          title={name(printed)}
          className="absolute z-30 cursor-pointer rounded-control transition-colors duration-200 ease-out hover:bg-foreground/5"
          style={{
            left: box.left,
            top: box.top,
            width: box.right - box.left,
            height: box.bottom - box.top,
          }}
        />,
      )}
    </Fragment>
  ))
}
