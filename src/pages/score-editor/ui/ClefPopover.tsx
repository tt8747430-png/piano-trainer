import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { staffLayer } from '@/features/score-editor'
import type { StaffId } from '@/shared/lib/notation'
import { ClefKeys } from './ScoreKeys'
import { SignPopover } from './SignPopover'

/**
 * A clef's popover (ADR 0094), opened where it is printed: the palette's Clef, that staff's clef from
 * its bar on, a single staff's whole (ADR 0097).
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
      <ClefKeys at={{ staff: staffLayer(staff), bar }} />
    </SignPopover>
  )
}
