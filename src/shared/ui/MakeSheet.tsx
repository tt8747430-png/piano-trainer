import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, useMediaQuery } from '@/shared/lib'
import { LIBRARY_PANES } from './FilterSheet'
import { Button } from './primitives/button'
import { Dialog, DialogClose, DialogContent, DialogTitle } from './primitives/dialog'
import { Sheet, SheetContent } from './Sheet'

/**
 * What makes something new (the canvas's NEWNAME and its New song, Record and Import sheets): on a
 * phone the app's bottom sheet, its title centred and Cancel at its right; on a laptop the same
 * header and body as a dialog centred on the screen (`_LAPSHEET`: 22 corners, 20 at its sides), as
 * wide as what it holds needs (`wide`: 480 for a form, else 440 for a name).
 */
export function MakeSheet({
  open,
  onOpenChange,
  title,
  wide = false,
  dismiss = 'cancel',
  footer,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  /** A form of several parts (New song), not a name alone. */
  wide?: boolean
  /** Its header's way out: Cancel, or Close once it reports what was made (Import). */
  dismiss?: 'cancel' | 'close'
  /** What stands under the body, parted by a hairline: its one Create. */
  footer?: ReactNode
  children: ReactNode
}) {
  const { t } = useTranslation('common')
  const laptop = useMediaQuery(LIBRARY_PANES)
  if (!laptop)
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent title={title} dismiss={dismiss} footer={footer}>
          {children}
        </SheetContent>
      </Sheet>
    )
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'flex max-h-[86dvh] max-w-none flex-col sm:max-w-none gap-0 rounded-[22px] bg-background p-0 text-base ring-0 shadow-lg',
          wide ? 'w-120' : 'w-110',
        )}
      >
        <div className="grid grid-cols-[minmax(3.5rem,1fr)_auto_minmax(3.5rem,1fr)] items-center gap-2 px-5 pt-3 pb-2">
          <DialogTitle className="col-start-2 text-center font-sans text-[1.0625rem] leading-snug font-semibold text-balance">
            {title}
          </DialogTitle>
          <DialogClose
            render={
              <Button
                variant="ghost"
                className="col-start-3 justify-self-end px-1 text-[1.0625rem] font-semibold text-link hover:bg-transparent hover:underline"
              />
            }
          >
            {dismiss === 'close' ? t('close') : t('confirm.cancel')}
          </DialogClose>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-5 pt-1 pb-6 *:shrink-0">
          {children}
        </div>
        {footer ? <div className="border-t border-hairline px-5 pt-4 pb-6">{footer}</div> : null}
      </DialogContent>
    </Dialog>
  )
}
