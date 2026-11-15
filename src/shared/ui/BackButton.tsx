import { ChevronLeft, X } from 'lucide-react'
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
  close = false,
}: {
  label?: string
  onClick?: () => void
  /** Glass where the bar stands over a picture (Chords' stage); bare by default. */
  variant?: 'glass'
  /** An X named Close, for a page that is a step aside rather than a level down (Sign in). */
  close?: boolean
}) {
  const { t } = useTranslation('common')
  const up = useUp()
  return (
    <RoundButton
      label={label ?? t(close ? 'close' : 'back')}
      icon={close ? X : ChevronLeft}
      onClick={onClick ?? up}
      {...(variant ? { variant } : {})}
    />
  )
}
