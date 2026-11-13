import { useRender } from '@base-ui/react/use-render'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib'
import { ROW_BODY, ROW_FLAT, ROW_TITLE_STRONG, RowFace, TileMark, type Paint } from '@/shared/ui'

/**
 * A row among a place's folders that leads elsewhere (canvas 133: Shared with me at the foot of
 * Folders): its tile, its name over what it is, a chevron; in the folders' card, as a folder's row.
 * `render` is the link (a router `Link`).
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
      className: cn(ROW_BODY, ROW_TITLE_STRONG),
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
