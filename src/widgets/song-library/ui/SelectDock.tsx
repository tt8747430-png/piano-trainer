import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { FloatingActions, Toolbar } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * One act of a selection bar (the boards' SELACT; owner, 2026-11-17: "make the toolbar icons not just
 * text. the selection toolbar"): its glyph 20 over its word at 12, 52 tall, sharing the bar's width;
 * a loss in crimson, glyph and word alike; greyed while nothing chosen can take it. Every selection
 * bar of Songs (All songs, a playlist, Archive, Trash, a song's takes) is drawn with it.
 */
export function SelectAct({
  label,
  icon: Icon,
  onClick,
  disabled = false,
  destructive = false,
}: {
  label: string
  icon: LucideIcon
  onClick: () => void
  disabled?: boolean
  destructive?: boolean
}) {
  return (
    <Button
      variant="ghost"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'h-13 min-w-0 flex-1 flex-col gap-0.5 rounded-pill px-1 text-xs font-semibold whitespace-nowrap',
        destructive && 'text-destructive',
      )}
    >
      <Icon aria-hidden className="size-5" />
      {label}
    </Button>
  )
}

/**
 * The selection bar at the foot (the boards' SELBAR, a glass DOCK in New's place): 68 tall, the
 * phone's width less its 16 margins, 520 wide and centred on a laptop; it takes the phone's tab bar's
 * place (memory-palaces'). Its acts are `SelectAct`s, and a More where the learner keeps the rest.
 * Over a sheet (`inSheet`, the takes'), it stands at the sheet's foot as the sheet scrolls, 440 wide
 * at most, since the screen's floating row lies under the sheet.
 */
export function SelectDock({
  label,
  inSheet = false,
  children,
}: {
  label: string
  inSheet?: boolean
  children: ReactNode
}) {
  const bar = (
    <Toolbar
      label={label}
      data-takes-tab-bar=""
      className={cn(
        'glass flex h-17 items-center gap-2 rounded-pill px-2',
        inSheet ? 'mx-auto w-full max-w-110' : 'w-[min(32.5rem,calc(100vw-2rem))]',
      )}
    >
      {children}
    </Toolbar>
  )
  return inSheet ? (
    <div className="sticky bottom-4 z-10">{bar}</div>
  ) : (
    <FloatingActions className="justify-center">{bar}</FloatingActions>
  )
}
