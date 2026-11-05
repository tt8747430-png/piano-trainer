import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings } from '@/entities/settings'
import { cn } from '@/shared/lib'
import type { PedalKind } from '@/shared/lib/schedule'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
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

/** The soft and sostenuto pedals in the Sustain button's menu, each held or latched as it is. */
function PedalRow({ pedal, press }: { pedal: PedalKind; press: PedalPress }) {
  const { t } = useTranslation('common')
  return (
    <Button
      variant="ghost"
      aria-label={t(`pedals.${pedal}.label`)}
      aria-pressed={press.down}
      onPointerDown={press.onPointerDown}
      onPointerUp={press.onPointerUp}
      onPointerCancel={press.onPointerUp}
      onKeyDown={press.onKeyDown}
      className={cn('w-full touch-none justify-start gap-3 font-medium', DOWN)}
    >
      <PedalIcon />
      {t(`pedals.${pedal}.name`)}
      <span className="ml-auto text-sm font-normal text-muted-foreground">
        {press.latched ? t('keyboardTools.latched') : null}
      </span>
    </Button>
  )
}

/**
 * The piano's pedals in the screen's bar (R34, OnlinePianist's lit Sustain): the sustain's button,
 * lit while the pedal is down from anywhere (a finger on it, Space, a MIDI foot, `sustained`: the
 * music's own pedal while it plays); held, it holds; a tap latches it until the next. With Pedals:
 * All three, a ⌄ beside it opens the soft and sostenuto pedals, worked the same way; their presses
 * live here, so a latched one stays down as the menu closes, a dot on the ⌄ saying so.
 */
export function SustainControl({
  sustained = false,
  variant = 'bar',
}: {
  sustained?: boolean
  variant?: 'bar' | 'tool'
}) {
  const { t } = useTranslation('common')
  const pedals = useSettings((state) => selectKeyboard(state).pedals)
  const sustain = usePedalPress('sustain', sustained)
  const soft = usePedalPress('soft')
  const sostenuto = usePedalPress('sostenuto')
  const button = <PedalButton label={t('pedals.sustain.label')} press={sustain} variant={variant} />
  if (pedals === 'sustain') return button
  const others = soft.down || sostenuto.down
  return (
    <span className="flex shrink-0 items-center">
      {button}
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant={variant}
              size="icon"
              aria-label={t('keyboardTools.morePedals')}
              title={t('keyboardTools.morePedals')}
              className="relative"
            />
          }
        >
          <ChevronDown aria-hidden />
          {others ? (
            <span
              aria-hidden
              data-slot="pedals-down"
              className="absolute top-2 right-2 size-2 rounded-pill bg-link"
            />
          ) : null}
        </PopoverTrigger>
        <PopoverContent align="end" className="w-60 gap-1 p-1.5">
          <PedalRow pedal="soft" press={soft} />
          <PedalRow pedal="sostenuto" press={sostenuto} />
        </PopoverContent>
      </Popover>
    </span>
  )
}
