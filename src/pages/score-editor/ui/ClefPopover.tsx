import type { ReactElement } from 'react'
import { staffLayer } from '@/features/score-editor'
import type { StaffId } from '@/shared/lib/notation'
import { useClefAt, useClefSaid } from '../model/use-clef-at'
import { ClefPicker } from './ClefPicker'
import { SignPicker } from './SignPicker'

/**
 * A clef's picker (ADR 0114), opened where it is printed: that staff's clef from its bar on, a
 * single staff's whole (ADR 0097), said under its title.
 */
export function ClefPopover({
  bar,
  staff,
  trigger,
}: {
  bar: number
  staff: StaffId
  trigger: ReactElement
}) {
  const at = useClefAt({ staff: staffLayer(staff), bar })
  const { title, said } = useClefSaid(at)
  return (
    <SignPicker title={title} description={said} wide trigger={trigger}>
      {at.staff ? <ClefPicker staff={at.staff} bar={bar} current={at.current} /> : null}
    </SignPicker>
  )
}
