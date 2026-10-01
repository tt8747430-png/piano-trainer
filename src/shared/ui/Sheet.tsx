import type { ComponentProps, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
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
 * The sheet's panel: a title, a body that scrolls, and an optional footer; and a Close a screen
 * reader reaches, where a sighted hand swipes the sheet down.
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
    <DrawerContent className="mx-auto w-full max-w-2xl rounded-t-4xl bg-card">
      <DrawerHeader className="px-5 pt-3 text-left">
        <DrawerTitle className="font-display text-2xl font-semibold">{title}</DrawerTitle>
      </DrawerHeader>
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-5 pb-6">{children}</div>
      {footer ? <DrawerFooter className="px-5 pb-safe">{footer}</DrawerFooter> : null}
      <DrawerClose className="sr-only">{t('close')}</DrawerClose>
    </DrawerContent>
  )
}
