import { ChevronsLeft, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

/**
 * A full screen's rail on a laptop (canvas R77, `RAIL77`; the Player's and the editor's, Flat's):
 * 76 wide, 12 above and below, a hairline at its end; its places a tab list at the top (`children`),
 * its tools at its foot (`foot`).
 */
export function Rail({
  label,
  children,
  foot,
}: {
  label: string
  children: ReactNode
  foot?: ReactNode
}) {
  return (
    <nav
      aria-label={label}
      className="flex w-19 shrink-0 flex-col gap-1 py-3 shadow-[inset_-1px_0_0_var(--color-border)]"
    >
      <div
        role="tablist"
        aria-orientation="vertical"
        aria-label={label}
        className="flex flex-col gap-1"
      >
        {children}
      </div>
      <span className="flex-1" />
      {foot}
    </nav>
  )
}

/**
 * A place on the rail (the kit's `_RAILBTN`): its glyph in a 40 by 32 chip over its word at 12; the
 * chosen one's chip in the rail's warm wash and its word at 600. A tool at the rail's foot is the
 * same face with no tab role (`tab` false).
 */
export function RailButton({
  label,
  icon: Icon,
  selected = false,
  tab = true,
  tip,
  onClick,
}: {
  label: string
  icon: LucideIcon
  selected?: boolean
  tab?: boolean
  /** Said when pointed at, only where it says more than the word (a shortcut). */
  tip?: string
  onClick(): void
}) {
  return (
    <button
      type="button"
      {...(tab ? { role: 'tab', 'aria-selected': selected } : {})}
      title={tip}
      onClick={onClick}
      className="flex min-h-16 w-19 cursor-pointer flex-col items-center gap-1 rounded-xl py-1.5 text-foreground"
    >
      <span
        className={cn(
          'grid h-8 w-10 place-items-center rounded-[10px] transition-colors duration-150 ease-out',
          selected ? 'bg-rail-chosen' : 'hover:bg-muted',
        )}
      >
        <Icon aria-hidden className="size-5.5" strokeWidth={2} />
      </span>
      <span className={cn('text-xs/[1.2]', selected ? 'font-semibold' : 'font-medium')}>
        {label}
      </span>
    </button>
  )
}

/**
 * The panel a rail's place opens beside it (the board's `_PANEL`): 352 wide, a hairline at its end;
 * its head 64 (its title at 17/600, « Fold the panel), its body scrolling 16 in, 24 at its foot, its
 * parts 16 apart.
 */
export function RailPanel({
  title,
  onFold,
  children,
}: {
  title: ReactNode
  onFold(): void
  children: ReactNode
}) {
  const { t } = useTranslation('common')
  return (
    <section
      role="tabpanel"
      className="flex min-h-0 w-88 shrink-0 flex-col shadow-[inset_-1px_0_0_var(--color-border)]"
    >
      <header className="flex h-16 shrink-0 items-center gap-2 pr-2 pl-4 shadow-[inset_0_-1px_0_var(--color-border)]">
        <h2 className="flex-1 truncate font-sans text-lg/[normal] font-semibold">{title}</h2>
        <button
          type="button"
          aria-label={t('foldPanel')}
          title={t('foldPanel')}
          onClick={onFold}
          className="grid size-11 cursor-pointer place-items-center rounded-pill text-muted-foreground hover:bg-muted"
        >
          <ChevronsLeft aria-hidden className="size-5" strokeWidth={2} />
        </button>
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pt-4 pb-6">
        {children}
      </div>
    </section>
  )
}
