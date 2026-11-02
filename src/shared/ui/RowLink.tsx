import { useRender } from '@base-ui/react/use-render'
import { ChevronRight } from 'lucide-react'
import { RowFace, type RowFaceProps } from './RowFace'
import { rowClass } from './row-class'

/**
 * A list row that leads to a page: its face (`RowFace`: a tile, a title of up to two lines, a detail,
 * what it holds and carries) and a chevron (Apple's disclosure indicator) that says it goes there.
 * `render` is the link (a router `Link`). A row that opens a sheet over its page is a `RowButton`.
 */
export function RowLink({
  render,
  ...face
}: RowFaceProps & {
  render: useRender.RenderProp
}) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: {
      className: rowClass(face.paint !== undefined || face.mark !== undefined),
      children: (
        <RowFace
          {...face}
          end={
            <ChevronRight
              data-slot="row-chevron"
              aria-hidden
              className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover/row:translate-x-0.5 group-hover/row:text-foreground"
            />
          }
        />
      ),
    },
  })
}
