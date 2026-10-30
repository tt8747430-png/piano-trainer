import { Ellipsis } from 'lucide-react'
import type { Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { ActionMenu, type MenuAction } from './ActionMenu'
import { Button } from './primitives/button'

/**
 * A screen bar's More: a round ⋯ on the bar's soft fill opening the screen's other actions (DESIGN.md,
 * Placement), its destructive action last, red and alone. Nothing while it holds no action.
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
  if (actions.length === 0) return null
  return (
    <ActionMenu
      ref={ref}
      label={name}
      align="end"
      trigger={<Ellipsis aria-hidden />}
      render={
        <Button variant="bar" size="icon" className="rounded-full" aria-label={name} title={name} />
      }
      actions={actions}
    />
  )
}
