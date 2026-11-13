import type { LucideIcon } from 'lucide-react'
import { Fragment, type ReactElement, type ReactNode, type Ref } from 'react'
import { cn } from '@/shared/lib'
import { Button } from './primitives/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './primitives/dropdown-menu'

/** One command of a menu: an item that acts and closes it. */
export interface MenuAction {
  readonly key: string
  readonly label: string
  readonly onSelect: () => void
  /** Not doable here: the menu leaves it out, since a menu holds only what works (ui-and-mockups). */
  readonly hidden?: boolean
  /** Its picture, before its name. */
  readonly icon?: LucideIcon
  /** A command that destroys (Delete): its item in the warning colour, after a separator, last. */
  readonly destructive?: boolean
  /** The group it is in, named small over the first of it (Insert's Text · Music · Ask and link). */
  readonly group?: string
  /** Its group parted by a separator but not named: a row's ⋯, whose groups say themselves (R31-S). */
  readonly unnamed?: boolean
  /** One of a choice (the language written in): a checked item, ticked when it is the one. */
  readonly checked?: boolean
}

/** A menu's item: 44px tall, its icon, its name. */
const ITEM = 'min-h-11 gap-3 rounded-control px-3 text-base [&_svg:not([class*=size-])]:size-5'

/**
 * A pull-down button (Apple's), a real menu (Base UI's Menu, memory-palaces' `FlyoutMenu`): a button
 * that opens commands, moved through with the arrow keys and typed to; each a 44px item, none that
 * cannot be done here (`hidden`), and no button when none is left; groups named small with a separator between, a checked item ticked, the
 * destructive ones last in the warning colour. Commands only: a setting is a row on a page, a choice
 * a pop-up (`Dropdown`). Its button is an outline one holding `trigger`, or `render` in its place (a
 * round icon named for a screen reader); `ref` is that button.
 */
export function ActionMenu({
  label,
  trigger,
  render = <Button variant="outline" />,
  align = 'start',
  actions = [],
  ref,
}: {
  label: string
  trigger: ReactNode
  render?: ReactElement
  /** Which edge of its button the menu lines up with: the end for a button at a row's end. */
  align?: 'start' | 'end'
  actions?: readonly MenuAction[]
  ref?: Ref<HTMLButtonElement>
}) {
  // Only what works here; the destructive commands last, set apart.
  const shown = actions.filter((action) => !action.hidden)
  const kept = shown.filter((action) => !action.destructive)
  const destructive = shown.filter((action) => action.destructive)
  const item = (action: MenuAction) => {
    const face = (
      <>
        {action.icon ? <action.icon aria-hidden /> : null}
        <span className="min-w-0 flex-1 truncate">{action.label}</span>
      </>
    )
    return action.checked === undefined ? (
      <DropdownMenuItem
        key={action.key}
        variant={action.destructive ? 'destructive' : 'default'}
        className={ITEM}
        onClick={action.onSelect}
      >
        {face}
      </DropdownMenuItem>
    ) : (
      <DropdownMenuCheckboxItem
        key={action.key}
        checked={action.checked}
        className={cn(ITEM, 'pr-10')}
        onClick={action.onSelect}
      >
        {face}
      </DropdownMenuCheckboxItem>
    )
  }
  // The commands in their groups, in the order given.
  const groups: { name: string | undefined; actions: MenuAction[] }[] = []
  for (const action of kept) {
    const last = groups.at(-1)
    if (last && last.name === action.group) last.actions.push(action)
    else groups.push({ name: action.group, actions: [action] })
  }
  // A menu with nothing doable here is no menu: its button goes too.
  if (shown.length === 0) return null
  return (
    <DropdownMenu
      // Not modal (memory-palaces' `FlyoutMenu`): the page is not locked behind it.
      modal={false}
    >
      <DropdownMenuTrigger ref={ref} render={render}>
        {trigger}
      </DropdownMenuTrigger>
      {/* As tall as the room it has, scrolling past it: a phone on its side holds few items. */}
      <DropdownMenuContent
        aria-label={label}
        align={align}
        className="w-auto max-w-[min(20rem,calc(100vw-2rem))] min-w-56 overscroll-contain rounded-control p-1.5"
      >
        {groups.map((group, at) => (
          <Fragment key={`${group.name ?? ''}-${at}`}>
            {at > 0 ? <DropdownMenuSeparator /> : null}
            <DropdownMenuGroup>
              {group.name && !group.actions[0]?.unnamed ? (
                <DropdownMenuLabel className="px-3 pt-1.5 pb-0.5">{group.name}</DropdownMenuLabel>
              ) : null}
              {group.actions.map(item)}
            </DropdownMenuGroup>
          </Fragment>
        ))}
        {destructive.length > 0 ? (
          <>
            {kept.length > 0 ? <DropdownMenuSeparator /> : null}
            <DropdownMenuGroup>{destructive.map(item)}</DropdownMenuGroup>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
