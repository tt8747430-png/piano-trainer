import { cloneElement, type ComponentProps, type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { ActionMenu } from '@/shared/ui'
import type { Printed, PrintedSign } from '@/widgets/score-sheet'
import { useOpenCategory } from '../model/use-open-category'
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
 * A line's head on a touch screen (R34, D1): one target over its clef, key and time signature, whose
 * menu names each; a choice does what a tap on that sign does.
 */
function SignsMenu({ signs, trigger }: { signs: readonly PrintedSign[]; trigger: Trigger }) {
  const { t } = useTranslation('editor')
  const open = useOpenCategory()
  return (
    <ActionMenu
      label={trigger.props['aria-label'] ?? ''}
      trigger={null}
      render={trigger}
      actions={signs.map((sign) => ({
        key: sign.kind,
        label:
          sign.kind === 'clef'
            ? t('printed.signs.clef')
            : sign.kind === 'key'
              ? t('printed.signs.key')
              : t('printed.signs.time'),
        onSelect: () => open(sign),
      }))}
    />
  )
}

/**
 * What a thing printed on the sheet opens where it is (ADR 0114, R32-B), over its button there
 * (`trigger`): the tempo mark its tempo, a section's name its menu (ADR 0097), a staff's name its
 * menu; a key signature, a time signature and a clef choose their bar and open the palette's
 * category, the one place each is set (Flat's); a line's head on a touch screen, a menu of its signs.
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
    case 'signs':
      return <SignsMenu signs={printed.signs} trigger={trigger} />
  }
}
