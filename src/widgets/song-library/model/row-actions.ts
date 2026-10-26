import type { LucideIcon } from 'lucide-react'
import type { MenuAction, Paint, SwipeAction } from '@/shared/ui'

/** One of a row's actions: in its More at every size, and on a swipe where it is one of the swipe's. */
export interface RowAction {
  readonly key: string
  readonly label: string
  readonly icon: LucideIcon
  /** Its paint on a swipe's tray. */
  readonly paint: Paint
  readonly onSelect: () => void
  readonly destructive?: boolean
}

/** A row's actions as its More lists them. */
export const menuOf = (actions: readonly RowAction[]): MenuAction[] =>
  actions.map(({ key, label, icon, onSelect, destructive }) => ({
    key,
    label,
    icon,
    onSelect,
    ...(destructive ? { destructive } : {}),
  }))

/** The actions a swipe shows, those of `keys` in that order: the last of a side fires at its edge. */
export const swipeOf = (actions: readonly RowAction[], keys: readonly string[]): SwipeAction[] =>
  keys.flatMap((key) => {
    const action = actions.find((each) => each.key === key)
    return action
      ? [
          {
            id: action.key,
            icon: action.icon,
            label: action.label,
            paint: action.paint,
            onAction: action.onSelect,
          },
        ]
      : []
  })
