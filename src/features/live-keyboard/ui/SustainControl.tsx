import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import { usePedalPress, type PedalPress } from '../model/use-pedal-press'
import { PedalIcon } from './PedalIcon'

/** A pedal down is lit as a key held down is (sky), never a second honey control (R34). */
const DOWN = 'aria-pressed:bg-key-down aria-pressed:text-on-key-down'

/** A pedal's own button: its picture in the bar, its name and state said to a screen reader. */
function PedalButton({
  label,
  press,
  variant,
  className,
}: {
  label: string
  press: PedalPress
  variant: 'bar' | 'tool'
  className?: string
}) {
  return (
    <Button
      variant={variant}
      size="icon"
      aria-label={label}
      title={label}
      aria-pressed={press.down}
      data-latched={press.latched || undefined}
      onPointerDown={press.onPointerDown}
      onPointerUp={press.onPointerUp}
      onPointerCancel={press.onPointerUp}
      onKeyDown={press.onKeyDown}
      className={cn('touch-none', DOWN, className)}
    >
      <PedalIcon />
    </Button>
  )
}

/**
 * The sustain pedal in the screen's bar (R34, OnlinePianist's lit Sustain): lit while the pedal is
 * down from anywhere (a finger on it, Space, a MIDI foot, `sustained`: the music's own pedal while it
 * plays); held, it holds; a tap latches it until the next.
 */
export function SustainControl({
  sustained = false,
  variant = 'bar',
}: {
  sustained?: boolean
  variant?: 'bar' | 'tool'
}) {
  const { t } = useTranslation('common')
  const sustain = usePedalPress('sustain', sustained)
  return <PedalButton label={t('pedals.sustain.label')} press={sustain} variant={variant} />
}
