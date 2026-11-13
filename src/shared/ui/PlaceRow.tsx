import { useRender } from '@base-ui/react/use-render'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib'
import { ROW_BODY, ROW_FLAT, ROW_LIBRARY_FACE } from './library-row-class'
import type { Paint } from './paint'
import { RowFace } from './RowFace'
import { TileMark } from './TileMark'

/**
 * A row of a grouped list that leads to a place (canvas 133 and Practice's): its 44px tile, its name
 * over one line on what it is, a chevron; in its card, as a library's rows (Songs' Shared with me,
 * Practice's pages). `render` is the link (a router `Link`).
 */
export function PlaceRow({
  icon,
  paint,
  title,
  detail,
  render,
}: {
  icon: LucideIcon
  paint: Paint
  title: string
  detail?: string | undefined
  render: useRender.RenderProp
}) {
  const link = useRender({
    defaultTagName: 'a',
    render,
    props: {
      className: cn(ROW_BODY, ROW_LIBRARY_FACE),
      children: (
        <>
          <TileMark large icon={icon} paint={paint} />
          <RowFace title={title} detail={detail} />
          <ChevronRight aria-hidden className="mr-3 size-5 shrink-0 text-muted-foreground" />
        </>
      ),
    },
  })
  return (
    <li className="min-w-0">
      <div className={cn(ROW_FLAT, 'has-[>a:hover]:bg-muted')}>{link}</div>
    </li>
  )
}
