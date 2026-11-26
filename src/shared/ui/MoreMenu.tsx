import { Ellipsis } from 'lucide-react'
import type { Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { ActionMenu, type MenuAction } from './ActionMenu'
import { ROW_CONTROL } from './library-row-class'
import { Button } from './primitives/button'

/**
 * More (⋯), the one for every place: a screen bar's round ⋯ on the bar's soft fill (DESIGN.md,
 * Placement), or a row's quiet ⋯ at its end, named for what it is the More of. It opens the other
 * actions, the destructive one last, red and alone. Nothing while it holds no action doable here; one
 * act alone is its own button, never a menu of one item (ui-and-mockups, Actions).
 */
export function MoreMenu({
  actions,
  label,
  on = 'bar',
  className,
  ref,
}: {
  actions: readonly MenuAction[]
  /** Its name, where "More" alone would not say whose it is; a row's always says. */
  label?: string
  /** Where it sits: a screen's bar, or the end of a row. */
  on?: 'bar' | 'row'
  /** Where it shows: a library row's only under a mouse (`POINTER_ONLY`). */
  className?: string
  ref?: Ref<HTMLButtonElement>
}) {
  const { t } = useTranslation('common')
  const name = label ?? t('more')
  const shown = actions.filter((action) => !action.hidden)
  const only = shown.length === 1 ? shown[0] : undefined
  const look =
    on === 'bar'
      ? ({ variant: 'bar', className } as const)
      : ({ variant: 'ghost', className: cn(ROW_CONTROL, className) } as const)
  if (shown.length === 0) return null
  if (only?.icon && only.checked === undefined) {
    const Icon = only.icon
    return (
      <Button
        ref={ref}
        {...look}
        size="icon"
        aria-label={only.label}
        title={only.label}
        onClick={only.onSelect}
      >
        <Icon aria-hidden />
      </Button>
    )
  }
  return (
    <ActionMenu
      ref={ref}
      label={name}
      align="end"
      trigger={<Ellipsis aria-hidden />}
      render={<Button {...look} size="icon" aria-label={name} title={name} />}
      actions={actions}
    />
  )
}
