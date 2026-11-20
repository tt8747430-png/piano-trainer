import { Ellipsis } from 'lucide-react'
import type { Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { ActionMenu, type MenuAction } from './ActionMenu'
import { Button } from './primitives/button'

/**
 * A screen bar's More: a round ⋯ on the bar's soft fill opening the screen's other actions (DESIGN.md,
 * Placement), its destructive action last, red and alone. Nothing while it holds no action; one act
 * alone is its own button on the bar, never a menu of one item (ui-and-mockups, Actions).
 */
export function MoreMenu({
  actions,
  label,
  ref,
}: {
  actions: readonly MenuAction[]
  /** Its name, where "More" alone would not say whose it is. */
  label?: string
  ref?: Ref<HTMLButtonElement>
}) {
  const { t } = useTranslation('common')
  const name = label ?? t('more')
  const shown = actions.filter((action) => !action.hidden)
  const only = shown.length === 1 ? shown[0] : undefined
  if (shown.length === 0) return null
  if (only?.icon && only.checked === undefined) {
    const Icon = only.icon
    return (
      <Button
        ref={ref}
        variant="bar"
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
      render={<Button variant="bar" size="icon" aria-label={name} title={name} />}
      actions={actions}
    />
  )
}
