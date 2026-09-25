import type { ComponentProps, ReactNode } from 'react'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from './primitives/drawer'

/** The app's bottom sheet: a drawer from the bottom that always shows its swipe handle. */
export function Sheet(props: ComponentProps<typeof Drawer>) {
  return <Drawer showSwipeHandle {...props} />
}

/** The sheet's panel: a title, a body that scrolls, and an optional footer. */
export function SheetContent({
  title,
  children,
  footer,
}: {
  title: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <DrawerContent className="mx-auto w-full max-w-2xl rounded-t-4xl bg-card">
      <DrawerHeader className="px-5 pt-3 text-left">
        <DrawerTitle className="text-xl font-bold">{title}</DrawerTitle>
      </DrawerHeader>
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-5 pb-6">{children}</div>
      {footer ? <DrawerFooter className="px-5 pb-safe">{footer}</DrawerFooter> : null}
    </DrawerContent>
  )
}
