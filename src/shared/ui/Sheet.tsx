import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { X } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { Button } from './primitives/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './primitives/drawer'

/** What opens a sheet: the drawer's own trigger, named for the sheet. */
export { DrawerTrigger as SheetTrigger } from './primitives/drawer'

/**
 * The app's bottom sheet: a drawer from the bottom that always shows its swipe handle. Every sheet
 * minds the phone's keyboard (Mindscape's, Base UI's `VirtualKeyboardProvider`): a field in it is
 * focused without the page scrolling to it, so the app behind never lifts, and the sheet rises
 * over the keyboard by the room it covers (`--drawer-keyboard-inset`).
 */
export function Sheet({
  children,
  ...props
}: Omit<ComponentProps<typeof Drawer>, 'children'> & { children?: ReactNode }) {
  return (
    <Drawer showSwipeHandle {...props}>
      <DrawerPrimitive.VirtualKeyboardProvider>{children}</DrawerPrimitive.VirtualKeyboardProvider>
    </Drawer>
  )
}

/**
 * The sheet's panel: its title beside its Close, under it what it acts on (`description`, whole,
 * wrapping), a body that scrolls with room round it, and an optional footer parted from it by a
 * hairline, clear of the home indicator. What the body holds keeps its height, scrolling rather than
 * squeezed. Over the phone's keyboard the panel stands on it. On a phone on its side it takes nearly
 * the whole height, or its body would be a sliver; `full`, it takes it at every size (a preview
 * opened full screen) and its body's room passes to what it holds.
 */
export function SheetContent({
  title,
  description,
  children,
  footer,
  full = false,
  tall = false,
}: {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  /** The whole screen's height at every size: a preview opened full screen (ADR 0110). */
  full?: boolean
  /** As tall as a sheet stands, whatever it holds: a sheet that is a screen (the library's filters). */
  tall?: boolean
}) {
  const { t } = useTranslation('common')
  return (
    <DrawerContent
      className={cn(
        'mx-auto w-full max-w-2xl rounded-t-4xl bg-card pb-sheet-keyboard text-base landscape-phone:max-h-[calc(100dvh-1rem)]',
        // The room anchored while no keyboard is up: the phone's keyboard never squeezes it.
        tall &&
          'h-[calc(var(--app-height,100dvh)-6rem)] landscape-phone:h-[calc(var(--app-height,100dvh)-1rem)]',
        full &&
          'h-[calc(var(--app-height,100dvh)-1rem)] max-h-[calc(var(--app-height,100dvh)-1rem)] max-w-5xl',
      )}
    >
      <DrawerHeader className="flex-row items-start justify-between gap-3 px-5 pt-1 pb-4 text-left landscape-phone:pb-1 group-data-[swipe-axis=y]/drawer-popup:text-left">
        <div className="flex min-w-0 flex-col gap-1 pt-1">
          <DrawerTitle className="font-display text-2xl leading-tight font-semibold text-pretty break-words">
            {title}
          </DrawerTitle>
          {description ? (
            <DrawerDescription className="text-base leading-snug text-pretty break-words text-muted-foreground">
              {description}
            </DrawerDescription>
          ) : null}
        </div>
        <DrawerClose
          render={
            <Button variant="ghost" size="icon" className="shrink-0" aria-label={t('close')} />
          }
        >
          <X aria-hidden />
        </DrawerClose>
      </DrawerHeader>
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-5 pb-6 *:shrink-0">
        {children}
      </div>
      {footer ? (
        <DrawerFooter className="border-t border-hairline px-5 pt-4 pb-sheet-foot">
          {footer}
        </DrawerFooter>
      ) : null}
    </DrawerContent>
  )
}
