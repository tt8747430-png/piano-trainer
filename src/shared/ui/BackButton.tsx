import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUp } from '@/shared/lib'
import { RoundButton } from './RoundButton'

/**
 * A screen's Back (R23's ‹): up to the screen's parent (`useUp`, rule 26), never back through the
 * history; or, where the screen says, its own way up (`onClick`: a folder to the folder it is in),
 * named for where it goes (`label`).
 */
export function BackButton({
  label,
  onClick,
  variant,
}: {
  label?: string
  onClick?: () => void
  /** Glass where the bar stands over a picture (Chords' stage); bare by default. */
  variant?: 'glass'
}) {
  const { t } = useTranslation('common')
  const up = useUp()
  return (
    <RoundButton
      label={label ?? t('back')}
      icon={ChevronLeft}
      onClick={onClick ?? up}
      {...(variant ? { variant } : {})}
    />
  )
}
