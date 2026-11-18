import { Toast as BaseToast } from '@base-ui/react/toast'
import { useTranslation } from 'react-i18next'
import { Button } from './primitives/button'
import {
  Toast,
  ToastAction,
  ToastContent,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  toast,
  useToastManager,
} from './primitives/toast'

/**
 * The toasts said, newest at the front, as the canvas's TOASTS: ink, 14 round, its line in the sheet's
 * colour at 15px, its action (Undo) in honey at the right; no Close, it goes by itself or by a swipe.
 */
function Toasts() {
  const { toasts } = useToastManager()
  return toasts.map((each) => (
    <Toast
      key={each.id}
      toast={each}
      className="min-h-13 rounded-[14px] border-0 bg-foreground text-background shadow-none"
    >
      <ToastContent className="gap-2 py-1 pr-1 pl-4">
        <ToastTitle className="min-w-0 flex-1 font-sans text-[0.9375rem]/5 font-normal" />
        {each.actionProps ? (
          <ToastAction
            render={
              <Button
                variant="ghost"
                className="h-11 px-3 text-[0.9375rem] font-bold text-toast-action hover:bg-background/10 hover:text-toast-action"
              />
            }
          />
        ) : null}
      </ToastContent>
    </Toast>
  ))
}

/**
 * Where toasts stand, mounted once by the app: over the screen's foot, clear of the tab bar, the keys
 * docked there and the floating actions, in the screen's width at most a phone's.
 */
export function Toaster() {
  const { t } = useTranslation('common')
  return (
    <ToastProvider toastManager={toast}>
      <ToastPortal>
        {/* Its own placement, not the primitive's corner: centred over the foot, clear of the tab bar
            and what floats on a phone; on a laptop centred on its pane, 460 wide and 28 up, or over a
            floating bar (a lesson's) 116 up (`toast-foot`); above every sheet and dialog (z-50), so an
            Undo said from one is seen. */}
        <BaseToast.Viewport
          data-slot="toast-viewport"
          aria-label={t('notifications')}
          className="pointer-events-none fixed inset-x-0 toast-foot z-60 mx-auto w-[min(26rem,calc(100vw-2*var(--gutter)))] print:hidden lg:left-sidebar lg:w-115"
        >
          <Toasts />
        </BaseToast.Viewport>
      </ToastPortal>
    </ToastProvider>
  )
}
