import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, LAPTOP, useMediaQuery } from '@/shared/lib'
import { BackButton } from './BackButton'
import { Button } from './primitives/button'
import { Dialog, DialogClose, DialogContent, DialogTitle } from './primitives/dialog'
import { holdTallestUnder } from './hold-tallest'
import { Sheet, SheetContent } from './Sheet'

/** The window's held height (Publish back to Settings), never past its room. */
const holdWindow = holdTallestUnder('var(--window-room)')

/**
 * A thing's Settings over its page, never a page of its own (the SongSettings boards' SETWIN): on a
 * laptop the app Settings' window, 720 wide, 48 under the screen's top, 22 round, the page dimmed
 * behind, its bar the title (Back before it on a page inside) and a close ×, its one column scrolling
 * under the bar; on a phone a tall sheet with Back and Done. The address stays the page's own.
 */
export function SettingsWindow({
  open,
  onOpenChange,
  title,
  onBack,
  backTo,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  /** A page inside the window (Publish, Export): Back to Settings, before the title. */
  onBack?: (() => void) | undefined
  /** Where Back goes when not to Settings (New playlist, back to Move to). */
  backTo?: string | undefined
  children: ReactNode
}) {
  const { t } = useTranslation('common')
  const laptop = useMediaQuery(LAPTOP)
  const back = onBack ? (
    <BackButton label={backTo ?? t('nav.settings')} onClick={onBack} />
  ) : undefined
  if (!laptop)
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent tall title={title} back={back}>
          {children}
        </SheetContent>
      </Sheet>
    )
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={holdWindow}
        showCloseButton={false}
        className="top-12 flex max-h-(--window-room) w-180 max-w-none translate-y-0 flex-col gap-0 overflow-hidden rounded-sheet bg-card p-0 text-base text-foreground window-shadow sm:max-w-none"
      >
        <header
          className={cn(
            'flex h-14 shrink-0 items-center gap-1 border-b border-border pr-2',
            back ? 'pl-3' : 'pl-8',
          )}
        >
          {back}
          <DialogTitle className="flex-1 font-sans text-lg leading-normal font-semibold">
            {title}
          </DialogTitle>
          <DialogClose
            render={
              <Button variant="ghost" size="icon" aria-label={t('close')} title={t('close')} />
            }
          >
            <X aria-hidden />
          </DialogClose>
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-8 pt-5 pb-8">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
