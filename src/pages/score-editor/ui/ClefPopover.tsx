import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import type { StaffId } from '@/shared/lib/notation'
import { ClefKeys } from './ScoreKeys'
import { SignPopover } from './SignPopover'

/**
 * A clef's popover (ADR 0094), opened where it is printed: the palette's Clef, that staff's clef from
 * its bar on.
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
  const { t } = useTranslation('editor')
  return (
    <SignPopover label={t('palette.category.clef')} trigger={trigger}>
      <ClefKeys at={{ hand: staff === 'bass' ? 'lh' : 'rh', bar }} />
    </SignPopover>
  )
}
