import type { useRender } from '@base-ui/react/use-render'
import type { LucideIcon } from 'lucide-react'
import { ButtonLink } from './ButtonLink'

/** A 44px round icon link, named by its label: `render` is the link (a router `Link`). */
export function RoundLink({
  label,
  icon: Icon,
  render,
}: {
  label: string
  icon: LucideIcon
  render: useRender.RenderProp
}) {
  return (
    <ButtonLink variant="surface" size="icon" aria-label={label} render={render}>
      <Icon aria-hidden />
    </ButtonLink>
  )
}
