import { Play, Square, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { Button } from './primitives/button'

/**
 * An example's Play as a round icon (or the picture of what it plays), named by what it plays, and
 * Stop behind its square while that sounds: beside a staff or a row, it says no more than its picture.
 */
export function PlayButton({
  label,
  icon: Icon = Play,
  playing,
  onClick,
  className,
}: {
  label: string
  /** What it plays, drawn: Play by default, an interval's way. */
  icon?: LucideIcon
  playing: boolean
  onClick: () => void
  className?: string
}) {
  const { t } = useTranslation('common')
  const name = playing ? t('stop') : label
  return (
    <Button
      variant="soft"
      size="icon"
      aria-label={name}
      title={name}
      onClick={onClick}
      className={cn('shrink-0 rounded-full', className)}
    >
      {playing ? (
        <Square aria-hidden className="size-4 fill-current" />
      ) : (
        <Icon aria-hidden className={Icon === Play ? 'fill-current' : undefined} />
      )}
    </Button>
  )
}
