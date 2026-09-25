import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib'
import { buttonVariants } from './primitives/button'

/**
 * A link that looks like a button: `render` is the link (a router `Link`). Base UI's `Button` always
 * sets `role="button"`, which would hide a link's role, so a link wears the button's look instead.
 */
export function ButtonLink({
  variant,
  size,
  className,
  render,
  ...props
}: useRender.ComponentProps<'a'> & VariantProps<typeof buttonVariants>) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>({ className: cn(buttonVariants({ variant, size }), className) }, props),
  })
}
