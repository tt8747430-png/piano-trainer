import { Check, X } from 'lucide-react'
import { useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, useMediaQuery } from '@/shared/lib'
import { InfoTip, Sheet, SheetContent, SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'

/** Where a sign's picker stands by what was tapped: a laptop's popover, else a sheet from the foot. */
const LAPTOP = '(min-width: 64rem)'

/**
 * A picker's title row, the sheet's in a popover: its name, what it changes under it, its ⓘ where it
 * has one, and its Close.
 */
function PickerHead({
  title,
  description,
  info,
  onClose,
}: {
  title: string
  description?: string | undefined
  info?: ReactNode
  onClose: () => void
}) {
  const { t } = useTranslation('common')
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <h2 className="flex items-center gap-1.5 font-display text-xl leading-tight font-semibold text-pretty">
          {title}
          {info ? <InfoTip name={title}>{info}</InfoTip> : null}
        </h2>
        {description ? (
          <p className="text-sm leading-snug text-pretty text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="-me-2 -mt-1 size-11 shrink-0"
        aria-label={t('close')}
        title={t('close')}
        onClick={onClose}
      >
        <X aria-hidden />
      </Button>
    </div>
  )
}

/**
 * What a sign opens, the score editor's pickers' one frame (ADR 0094, 0114, after notation apps'
 * sheets): on a laptop a popover by what was tapped (its button on the sheet, or its key in the
 * palette, the trigger), elsewhere a sheet from the foot of the screen, each titled by what it changes
 * with its Close, and what it changes from under the title (`description`). Its picker is given
 * `close` where it has its own Cancel and Apply. Escape closes it.
 */
export function SignPicker({
  title,
  description,
  info,
  wide = false,
  trigger,
  children,
}: {
  title: string
  description?: string | undefined
  /** What its tools do, where their names alone do not say: the ⓘ beside its title (ADR 0096). */
  info?: ReactNode
  /** As wide as seven signs in a row, where the screen has room. */
  wide?: boolean
  trigger: ReactElement
  children: ReactNode | ((close: () => void) => ReactNode)
}) {
  const laptop = useMediaQuery(LAPTOP)
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const body = typeof children === 'function' ? children(close) : children
  if (laptop)
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={trigger} />
        <PopoverContent
          aria-label={title}
          align="start"
          className={cn(
            'max-h-(--available-height) max-w-[calc(100vw-1rem)] gap-4 overflow-y-auto overscroll-contain p-5',
            wide ? 'w-[30rem]' : 'w-96',
          )}
        >
          <PickerHead title={title} description={description} info={info} onClose={close} />
          {body}
        </PopoverContent>
      </Popover>
    )
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={trigger} />
      <SheetContent title={title} {...(description ? { description } : {})} info={info}>
        <div className="flex flex-col gap-4">{body}</div>
      </SheetContent>
    </Sheet>
  )
}

/**
 * A picker's Cancel and Apply (ADR 0114, as notation apps' sheets end): ✗ in the warning colour and ✓
 * in the accent at the foot's right, each named by its tooltip and to a screen reader; Apply greyed
 * until something changes.
 */
export function PickerActions({
  onCancel,
  onApply,
  changed,
}: {
  onCancel: () => void
  onApply: () => void
  changed: boolean
}) {
  const { t } = useTranslation('editor')
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="size-12 text-destructive hover:text-destructive [&_svg]:size-7"
        aria-label={t('picker.cancel')}
        title={t('picker.cancel')}
        onClick={onCancel}
      >
        <X aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-12 rounded-full text-link shadow-md hover:text-link disabled:shadow-none [&_svg]:size-7"
        aria-label={t('picker.apply')}
        title={t('picker.apply')}
        disabled={!changed}
        onClick={onApply}
      >
        <Check aria-hidden />
      </Button>
    </div>
  )
}
