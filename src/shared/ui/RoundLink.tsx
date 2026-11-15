import type { useRender } from '@base-ui/react/use-render'
import type { LucideIcon } from 'lucide-react'
import { ButtonLink } from './ButtonLink'

/** A 44px round icon link, named by its label: `render` is the link (a router `Link`). */
export function RoundLink({
  label,
  icon: Icon,
  render,
  variant = 'bar',
}: {
  label: string
  icon: LucideIcon
  render: useRender.RenderProp
  /** A bar's soft round button, or the glass one of a page over its picture (Practice's bars). */
  variant?: 'bar' | 'glass'
}) {
  return (
    <ButtonLink variant={variant} size="icon" aria-label={label} title={label} render={render}>
      <Icon aria-hidden />
    </ButtonLink>
  )
}
