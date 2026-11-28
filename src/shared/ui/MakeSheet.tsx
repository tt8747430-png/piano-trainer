import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, useMediaQuery, LAPTOP } from '@/shared/lib'
import { Button } from './primitives/button'
import { Dialog, DialogClose, DialogContent, DialogTitle } from './primitives/dialog'
import { Sheet, SheetContent, SHEET_DISMISS, SHEET_HEAD } from './Sheet'

/**
 * What makes something new (the canvas's NEWNAME and its New song, Record and Import sheets): on a
 * phone the app's bottom sheet, its title centred and Cancel at its right; on a laptop the same
 * header and body as a dialog centred on the screen (`_LAPSHEET`: 22 corners, 20 at its sides), 480
 * wide for a name alone as for a form of several parts, as every board's.
 */
export function MakeSheet({
  open,
  onOpenChange,
  title,
  dismiss = 'cancel',
  footer,
  initialFocus,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  /** Its header's way out: Cancel, or Close once it reports what was made (Import). */
  dismiss?: 'cancel' | 'close'
  /** What stands under the body, parted by a hairline: its one Create. */
  footer?: ReactNode
  /** What takes the focus as it opens: its name field, so the phone's keyboard comes up under it. */
  initialFocus?: () => HTMLElement | true
  children: ReactNode
}) {
  const { t } = useTranslation('common')
  const laptop = useMediaQuery(LAPTOP)
  if (!laptop)
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          title={title}
          dismiss={dismiss}
          footer={footer}
          {...(initialFocus ? { initialFocus } : {})}
        >
          {children}
        </SheetContent>
      </Sheet>
    )
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        {...(initialFocus ? { initialFocus } : {})}
        className="flex max-h-[86dvh] w-120 max-w-none flex-col gap-0 rounded-sheet bg-background p-0 text-base sm:max-w-none"
      >
        <div className={cn(SHEET_HEAD, 'items-center px-5 pt-3 pb-2')}>
          <DialogTitle className="col-start-2 text-center font-sans text-lg leading-snug font-semibold text-balance">
            {title}
          </DialogTitle>
          <DialogClose render={<Button variant="ghost" className={SHEET_DISMISS} />}>
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
