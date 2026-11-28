import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogTitle } from './primitives/dialog'

/**
 * A page a phone's ☰ opens (the kit's `THINGPAGE`, the boards' `FSHEET`): the whole screen under the
 * status bar on the page's paper, its header 60 high (Back, the title centred at 17/600), its body
 * scrolling under it 16 in, 8 under the header and 48 at its foot. Back is its way out, a bare 44 with
 * the 24 chevron (the page is the layer; no glass on it): no Done, no handle, nothing behind showing.
 */
export function PhonePage({
  open,
  title,
  onBack,
  onOpenChange,
  children,
}: {
  open: boolean
  title: string
  onBack(): void
  onOpenChange(open: boolean): void
  children: ReactNode
}) {
  const { t } = useTranslation('common')
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="inset-0 top-0 left-0 flex h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none bg-background p-0 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-base text-foreground shadow-none sm:max-w-none"
      >
        <header className="grid h-15 shrink-0 grid-cols-[minmax(2.75rem,1fr)_auto_minmax(2.75rem,1fr)] items-center px-4 py-2">
          <div className="justify-self-start">
            <button
              type="button"
              aria-label={t('back')}
              title={t('back')}
              onClick={onBack}
              className="grid size-11 cursor-pointer place-items-center rounded-pill text-foreground transition-colors duration-150 ease-out hover:bg-muted"
            >
              <ChevronLeft aria-hidden className="size-6" strokeWidth={2} />
            </button>
          </div>
          <DialogTitle className="truncate font-sans text-[1.0625rem] font-semibold">
            {title}
          </DialogTitle>
          <span />
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-2 pb-12">
          <div className="mx-auto flex w-full max-w-140 flex-col gap-4">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
