import { useRender } from '@base-ui/react/use-render'
import type { ReactNode } from 'react'

/**
 * A page's section under a `SectionHead` as the boards' `H2` stands in its section (`r41_kit.py`): the
 * head 16 into the section, so a section stands 16 further from the one above than the page's own gap,
 * and its content 8 under the head.
 */
export const HEADED_SECTION = 'flex flex-col gap-2 pt-4'

/**
 * A section's head (the boards' `H2`): its name, 20 bold, and at the right what opens the whole of
 * it (`SeeAll`), on one baseline; the row is the name's height, so the section stands as close under
 * the one before as the boards draw it.
 */
export function SectionHead({
  id,
  title,
  children,
}: {
  id: string
  title: string
  /** What opens the whole section: a `SeeAll`. */
  children?: ReactNode
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 id={id} className="font-sans text-xl leading-6 font-bold">
        {title}
      </h2>
      {children}
    </div>
  )
}

/**
 * A section head's See all: the link's word in the link colour, reaching 44 for a finger without
 * making its row taller than the name beside it, the reach upward so it never lands on what the
 * section shows under it. `render` is the router `Link`, or a button.
 */
export function SeeAll({
  label,
  render,
  onClick,
}: {
  label: string
  render?: useRender.RenderProp
  onClick?: () => void
}) {
  return useRender({
    defaultTagName: 'button',
    render,
    props: {
      type: render ? undefined : 'button',
      onClick,
      className:
        '-mt-4 -mb-2 -mr-1 inline-flex min-h-11 min-w-11 items-end justify-end px-1 pb-2 text-subhead font-semibold text-link hover:underline',
      children: label,
    },
  })
}
