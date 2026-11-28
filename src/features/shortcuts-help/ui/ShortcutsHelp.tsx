import { X } from 'lucide-react'
import { useCallback, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, LAPTOP, useMediaQuery } from '@/shared/lib'
import { useListedShortcuts, useShortcuts } from '@/shared/lib/shortcuts'
import { Sheet, SheetContent } from '@/shared/ui'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'
import { Kbd, KbdGroup } from '@/shared/ui/primitives/kbd'
import { OpenShortcutsContext } from './open-shortcuts'

/** The shortcuts on screen, group by group: a name, then its keycaps. */
function ShortcutsList() {
  const groups = useListedShortcuts()
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.name} className="flex flex-col">
          <h3 className="pb-1 font-sans text-sm text-muted-foreground">{group.name}</h3>
          {group.rows.map((row) => (
            <div
              key={row.label}
              className="flex min-h-11 items-center justify-between gap-4 border-b border-hairline py-2 last:border-b-0"
            >
              <span>{row.label}</span>
              <KbdGroup className="shrink-0">
                {row.keys.map((key, index) => (
                  // A row's caps never reorder, and two may be the same.
                  <Kbd key={`${index}:${key}`} className="h-7 min-w-7 px-2 text-sm">
                    {key}
                  </Kbd>
                ))}
              </KbdGroup>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

/** More rows than two columns hold at a glance take three (the Player's board, 840 wide). */
const THREE_COLUMNS = 8

/**
 * On a laptop, the boards' Shortcuts card (KEYSCARD_F, Flat's shortcut sheet): centred 120 from the
 * top over the one scrim, its title and Close in a 64 head over a hairline, the groups in two columns
 * (640) or three (840), each row 40 tall with its keys in soft ink at its end.
 */
function ShortcutsCard({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange(open: boolean): void
}) {
  const { t } = useTranslation('common')
  const groups = useListedShortcuts()
  const three = groups.reduce((rows, group) => rows + group.rows.length, 0) > THREE_COLUMNS
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'top-30 flex -translate-y-0 flex-col gap-0 overflow-hidden bg-card p-0 text-base text-foreground shadow-[0_0_0_1px_var(--color-border),var(--elevation-2)] ring-0',
          three ? 'sm:max-w-210' : 'sm:max-w-160',
        )}
      >
        <header className="flex h-16 shrink-0 items-center pr-2 pl-6 shadow-[inset_0_-1px_0_var(--color-border)]">
          <DialogTitle className="flex-1 font-sans text-[1.0625rem] font-semibold">
            {t('shortcuts.title')}
          </DialogTitle>
          <DialogClose
            aria-label={t('close')}
            className="grid size-11 place-items-center rounded-pill transition-colors duration-150 ease-out hover:bg-muted"
          >
            <X aria-hidden className="size-5" />
          </DialogClose>
        </header>
        <DialogDescription className="sr-only">{t('shortcuts.title')}</DialogDescription>
        <div
          className={cn(
            'max-h-[calc(100dvh-14rem)] gap-x-8 overflow-y-auto px-6 pt-1 pb-6',
            three ? 'columns-3' : 'columns-2',
          )}
        >
          {groups.map((group) => (
            <section key={group.name} className="break-inside-avoid pt-4">
              <h3 className="mb-1 font-sans text-footnote/[normal] font-semibold text-muted-foreground">
                {group.name}
              </h3>
              {group.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex min-h-10 items-center justify-between gap-4 shadow-[inset_0_-1px_0_var(--color-muted)]"
                >
                  <span className="text-subhead">{row.label}</span>
                  <kbd className="shrink-0 font-sans text-sm text-muted-foreground">
                    {row.keys.join(' ')}
                  </kbd>
                </div>
              ))}
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * The shortcuts' sheet over the app: `?` opens it anywhere, and `ShortcutsButton` for a hand on the
 * pointer. It lists what the screen binds first, then the piano's keys, then the app's.
 */
export function ShortcutsHelp({ children }: { children: ReactNode }) {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const laptop = useMediaQuery(LAPTOP)
  const show = useCallback(() => setOpen(true), [])
  useShortcuts(
    t('shortcuts.app'),
    [{ label: t('shortcuts.show'), combo: { key: '?' }, run: show }],
    { scope: 'app' },
  )
  return (
    <OpenShortcutsContext value={show}>
      {children}
      {laptop ? (
        <ShortcutsCard open={open} onOpenChange={setOpen} />
      ) : (
        <Sheet hung="header" open={open} onOpenChange={setOpen}>
          <SheetContent title={t('shortcuts.title')}>
            <ShortcutsList />
          </SheetContent>
        </Sheet>
      )}
    </OpenShortcutsContext>
  )
}
