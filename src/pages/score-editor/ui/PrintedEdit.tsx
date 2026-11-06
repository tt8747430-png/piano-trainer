import { cloneElement, type ComponentProps, type ReactElement } from 'react'
import type { Printed } from '@/widgets/score-sheet'
import { useOpenCategory, type PrintedSign } from '../model/use-open-category'
import { SectionMenu } from './SectionMenu'
import { StaffMenu } from './StaffMenu'
import { TempoPopover } from './TempoPopover'

type Trigger = ReactElement<ComponentProps<'button'>>

/** A key or time signature or a clef printed: its tap opens the palette there (`useOpenCategory`). */
function SignButton({ sign, trigger }: { sign: PrintedSign; trigger: Trigger }) {
  const open = useOpenCategory()
  return cloneElement(trigger, { onClick: () => open(sign) })
}

/**
 * What a thing printed on the sheet opens where it is (ADR 0114, R32-B), over its button there
 * (`trigger`): the tempo mark its tempo, a section's name its menu (ADR 0097), a staff's name its
 * menu; a key signature, a time signature and a clef choose their bar and open the palette's
 * category, the one place each is set (Flat's).
 */
export function PrintedEdit({ printed, trigger }: { printed: Printed; trigger: Trigger }) {
  switch (printed.kind) {
    case 'tempo':
      return <TempoPopover trigger={trigger} />
    case 'section':
      return <SectionMenu section={printed.section} trigger={trigger} />
    case 'key':
    case 'time':
    case 'clef':
      return <SignButton sign={printed} trigger={trigger} />
    case 'staff':
      return <StaffMenu staves={printed.staves} trigger={trigger} />
  }
}
