import { Toast as BaseToast } from '@base-ui/react/toast'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from './primitives/button'
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  toast,
  useToastManager,
} from './primitives/toast'

/** The toasts said, newest at the front, each a card: its line, its action, its Close. */
function Toasts() {
  const { t } = useTranslation('common')
  const { toasts } = useToastManager()
  return toasts.map((each) => (
    <Toast
      key={each.id}
      toast={each}
      className="card rounded-3xl border-border bg-card elevation-3"
    >
      <ToastContent className="gap-2 py-2 pr-2 pl-4">
        <ToastTitle className="min-w-0 flex-1 text-base font-medium" />
        {each.actionProps ? (
          <ToastAction render={<Button variant="ghost" className="font-semibold text-link" />} />
        ) : null}
        <ToastClose
          aria-label={t('close')}
          render={<Button variant="ghost" size="icon" className="text-muted-foreground" />}
        >
          <X aria-hidden />
        </ToastClose>
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
        {/* Its own placement, not the primitive's corner: centred over the foot, beside the
            sidebar on a laptop. */}
        <BaseToast.Viewport
          data-slot="toast-viewport"
          aria-label={t('notifications')}
          className="pointer-events-none fixed inset-x-0 bottom-foot-3 z-50 mx-auto w-[min(26rem,calc(100vw-2*var(--gutter)))] print:hidden landscape-phone:left-rail lg:left-sidebar"
        >
          <Toasts />
        </BaseToast.Viewport>
      </ToastPortal>
    </ToastProvider>
  )
}
