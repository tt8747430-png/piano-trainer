import { Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { Popover, PopoverContent, PopoverTrigger } from './primitives/popover'

// Drawn 20px beside a name, a line of small text's height; its reach grows to a 44px touch target
// round it (CODE_STYLE §5) without taking that room from the row.
const TRIGGER =
  'relative inline-grid size-5 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors duration-200 ease-out select-none before:absolute before:-inset-3 before:content-[""] hover:text-foreground data-popup-open:text-foreground [&_svg]:size-4'

/**
 * A control's explanation, out of the way until asked for (ADR 0096): a small ⓘ beside the
 * control's name (`name`) that opens what it does in a popover named by it; Escape or a tap
 * anywhere else closes it. No line of explanation stands under a control.
 */
export function InfoTip({
  name,
  className,
  children,
}: {
  /** The name of what it explains, as printed beside it. */
  name: string
  className?: string
  /** The explanation. */
  children: ReactNode
}) {
  const { t } = useTranslation('common')
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label={t('infoTip', { name })}
            className={cn(TRIGGER, className)}
          />
        }
      >
        <Info aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        aria-label={name}
        className="w-72 max-w-[calc(100vw-2rem)] p-3 text-sm leading-snug text-pretty"
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}
