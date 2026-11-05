import { ListFilter } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@/shared/lib'
import { FoldGroup } from './FoldGroup'
import { Button } from './primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from './primitives/popover'
import { Toggle } from './primitives/toggle'
import { Sheet, SheetContent } from './Sheet'

/**
 * The width from which a library (Songs', Practice's) shows its tree beside its rows, and its filters
 * open in a popover by their button: the sidebar's, `lg`.
 */
export const LIBRARY_PANES = '(min-width: 64rem)'

/**
 * A library's Filter button and its filters (ADR 0106, the owner's example): the button, its count on
 * it while filters are on; its sheet (a popover by it on a laptop) of the `children`, the filters'
 * folding groups, each change taken at once; at its foot `foot`, given how to close it (Clear filters
 * and Show).
 */
export function FilterSheet({
  count,
  foot,
  children,
}: {
  /** How many filters are on. */
  count: number
  foot: (close: () => void) => ReactNode
  children: ReactNode
}) {
  const { t } = useTranslation('common')
  const laptop = useMediaQuery(LIBRARY_PANES)
  const [open, setOpen] = useState(false)
  const label = count > 0 ? t('library.filters.on', { count }) : t('library.filters.title')
  const button = {
    variant: 'outline',
    size: 'icon',
    'aria-label': label,
    title: label,
    className: 'relative size-12 shrink-0 rounded-control bg-card [&_svg]:size-5',
  } as const
  const face = (
    <>
      <ListFilter aria-hidden />
      {count > 0 ? (
        <span
          aria-hidden
          data-slot="filter-count"
          className="pointer-events-none absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-pill bg-foreground px-1 text-xs font-semibold text-background tabular-nums"
        >
          {count}
        </span>
      ) : null}
    </>
  )
  const close = () => setOpen(false)
  if (laptop)
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button {...button} />}>{face}</PopoverTrigger>
        <PopoverContent
          aria-label={t('library.filters.title')}
          align="end"
          className="max-h-(--available-height) w-[min(26rem,calc(100vw-2rem))] gap-0 overflow-hidden p-0"
        >
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-6">{children}</div>
          </div>
          <div className="border-t border-hairline p-4">{foot(close)}</div>
        </PopoverContent>
      </Popover>
    )
  return (
    <>
      <Button {...button} onClick={() => setOpen(true)}>
        {face}
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent title={t('library.filters.title')} footer={foot(close)} tall>
          <div className="flex flex-col gap-6">{children}</div>
        </SheetContent>
      </Sheet>
    </>
  )
}

/** A group of the filters, folding under its name (the owner's example), open as the sheet opens. */
export function FilterGroup({
  title,
  list = true,
  children,
}: {
  title: string
  /** Its choices as chips that wrap (`FilterChoice`s); else one row of its own. */
  list?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <FoldGroup
      title={title}
      open={open}
      onToggle={() => setOpen((was) => !was)}
      listClassName={list ? 'flex flex-wrap gap-2' : 'flex flex-col'}
    >
      {children}
    </FoldGroup>
  )
}

/** One choice of a filter's group: a chip pressed while it is the one chosen. */
export function FilterChoice({
  pressed,
  onPress,
  children,
}: {
  pressed: boolean
  onPress: () => void
  children: ReactNode
}) {
  return (
    <li>
      <Toggle
        pressed={pressed}
        onPressedChange={() => {
          if (!pressed) onPress()
        }}
        className="h-11 max-w-full min-w-14 text-muted-foreground aria-pressed:text-foreground"
      >
        <span className="truncate">{children}</span>
      </Toggle>
    </li>
  )
}

/** The filters' foot: Clear filters, and Show, saying how many the filters keep (`show`), which closes them. */
export function FilterFoot({
  on,
  onClear,
  show,
  onShow,
}: {
  /** Whether any filter is on, for Clear filters. */
  on: boolean
  onClear: () => void
  show: string
  onShow: () => void
}) {
  const { t } = useTranslation('common')
  return (
    <div className="flex flex-wrap gap-3">
      <Button size="lg" variant="soft" disabled={!on} onClick={onClear} className="flex-1">
        {t('library.clearFilters')}
      </Button>
      <Button size="lg" onClick={onShow} className="flex-1">
        {show}
      </Button>
    </div>
  )
}
