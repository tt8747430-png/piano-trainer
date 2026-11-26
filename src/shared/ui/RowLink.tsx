import { useRender } from '@base-ui/react/use-render'
import { OpensMark } from './NavMarks'
import { RowFace, type RowFaceProps } from './RowFace'
import { ROW_CLASS } from './row-class'

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
      className: ROW_CLASS,
      children: <RowFace {...face} end={<OpensMark />} />,
    },
  })
}
