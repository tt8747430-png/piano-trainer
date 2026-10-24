import type { ReactElement } from 'react'
import type { Printed } from '@/widgets/score-sheet'
import { ClefPopover } from './ClefPopover'
import { KeyPopover } from './KeyPopover'
import { TempoPopover } from './TempoPopover'
import { TimePopover } from './TimePopover'

/**
 * What a thing printed on the sheet opens where it is (ADR 0094), over its button there (`trigger`):
 * the tempo mark its tempo, a key signature its key, the time signature the meter, a clef its staff's
 * clef.
 */
export function PrintedEdit({ printed, trigger }: { printed: Printed; trigger: ReactElement }) {
  switch (printed.kind) {
    case 'tempo':
      return <TempoPopover trigger={trigger} />
    case 'key':
      return <KeyPopover bar={printed.bar} trigger={trigger} />
    case 'time':
      return <TimePopover trigger={trigger} />
    case 'clef':
      return <ClefPopover bar={printed.bar} staff={printed.staff} trigger={trigger} />
  }
}
