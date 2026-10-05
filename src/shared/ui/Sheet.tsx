import { X } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './primitives/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './primitives/drawer'

/** What opens a sheet: the drawer's own trigger, named for the sheet. */
export { DrawerTrigger as SheetTrigger } from './primitives/drawer'

/** The app's bottom sheet: a drawer from the bottom that always shows its swipe handle. */
export function Sheet(props: ComponentProps<typeof Drawer>) {
  return <Drawer showSwipeHandle {...props} />
}

/**
 * The sheet's panel: its title beside its Close, a body that scrolls with room round it, and an
 * optional footer parted from it by a hairline, clear of the home indicator.
 */
export function SheetContent({
  title,
  children,
  footer,
}: {
  title: string
  children: ReactNode
  footer?: ReactNode
}) {
  const { t } = useTranslation('common')
  return (
    <DrawerContent className="mx-auto w-full max-w-2xl rounded-t-4xl bg-card text-base">
      <DrawerHeader className="flex-row items-center justify-between gap-3 px-5 pt-1 pb-4 text-left group-data-[swipe-axis=y]/drawer-popup:text-left">
        <DrawerTitle className="min-w-0 font-display text-2xl font-semibold">{title}</DrawerTitle>
        <DrawerClose render={<Button variant="ghost" size="icon" aria-label={t('close')} />}>
          <X aria-hidden />
        </DrawerClose>
      </DrawerHeader>
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-5 pb-6">{children}</div>
      {footer ? (
        <DrawerFooter className="border-t border-hairline px-5 pt-4 pb-safe-4">
          {footer}
        </DrawerFooter>
      ) : null}
    </DrawerContent>
  )
}
