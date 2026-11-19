import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { usePageHeading } from './use-page-heading'

/**
 * Where a title is printed: centred over a page as it prints, or over lines down the screen (the boards' 24, 36 on a laptop, at 1.1); at the
 * head of one line across, where the line starts.
 */
const PLACES = {
  page: 'text-center text-3xl font-normal',
  lines:
    'text-center text-[1.5rem]/[1.1] font-normal sm:text-[2.25rem]/[1.1] landscape-phone:text-xl',
  across: 'text-xl',
} as const
export type TitlePlace = keyof typeof PLACES

/**
 * A score's title printed at the head of its sheet (ADR 0114), as a printed score has it: the page's
 * h1, which names the page and takes the focus as the screen opens. Its text, or what the editor
 * puts in its place (`children`: the title as a button that turns into a field).
 */
export function SheetTitle({
  title,
  place,
  children,
}: {
  title: string
  place: TitlePlace
  children?: ReactNode
}) {
  const heading = usePageHeading<HTMLHeadingElement>(title)
  return (
    <h1
      {...heading}
      data-slot="sheet-title"
      className={cn('leading-tight text-balance wrap-break-word outline-none', PLACES[place])}
    >
      {children ?? title}
    </h1>
  )
}
