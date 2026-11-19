import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/shared/ui/primitives/dialog'
import { SettingsDialogContext } from '../model/dialog-context'
import { settingsPlaceOf } from '../model/sections'
import { SettingsNav } from './SettingsNav'

/**
 * Settings on a laptop (claude.ai's, the board's SETDLG): a dialog over the page it was opened from,
 * the page dimmed behind; 1200 wide at most, 48 from the screen's top and foot, 22 round. Its bar is
 * the word Settings and a close ×; on its left the nav (264, its own scroll), on its right the place
 * open, left-aligned at most 720 wide, scrolling on its own. Administration opens in the same shell.
 */
export function SettingsDialog({
  path,
  onClose,
  children,
}: {
  /** The Settings path shown (`/settings/general`, `/admin/accounts`). */
  path: string
  onClose: () => void
  /** The place's pane: its page, as it reads on its own. */
  children: ReactNode
}) {
  const { t } = useTranslation('settings')
  const place = settingsPlaceOf(path === '/settings' ? '/settings/general' : path)
  return (
    <Dialog open onOpenChange={(open) => (open ? undefined : onClose())}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[calc(100dvh-6rem)] w-[min(75rem,calc(100vw-10rem))] max-w-none flex-col gap-0 overflow-hidden rounded-[22px] bg-card p-0 text-base text-foreground shadow-[0_0_0_1px_var(--color-border),0_24px_64px_rgb(51_41_33/0.28)] sm:max-w-none"
      >
        <header className="flex h-14 shrink-0 items-center border-b border-border pr-2 pl-6">
          <DialogTitle className="flex-1 font-sans text-[1.0625rem] leading-normal font-semibold">
            {t('title')}
          </DialogTitle>
          <DialogClose
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('dialog.close')}
                title={t('dialog.close')}
                className="rounded-full"
              />
            }
          >
            <X aria-hidden />
          </DialogClose>
        </header>
        <div className="grid min-h-0 flex-1 grid-cols-[16.5rem_minmax(0,1fr)]">
          <nav
            aria-label={t('title')}
            className="scrollbar-none flex min-h-0 flex-col gap-5 overflow-y-auto overscroll-contain border-r border-border px-3 pt-4 pb-5"
          >
            <SettingsNav place={place} />
          </nav>
          <div className="min-h-0 min-w-0 overflow-y-auto overscroll-contain px-8 pt-4 pb-10">
            <SettingsDialogContext value={{ path }}>
              <div className="flex flex-col">{children}</div>
            </SettingsDialogContext>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
