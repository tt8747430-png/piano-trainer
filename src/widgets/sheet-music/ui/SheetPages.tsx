import type { ReactNode } from 'react'
import { PAGE, paginate } from '@/shared/lib'
import { SheetPage, SheetTitle } from '@/shared/ui'
import type { ScoreLine } from '../model/score-lines'

/** The room between lines, at print size. */
export const LINE_GAP = 16
/** The title's room over the first page's first line, at print size. */
const TITLE_ROOM = 44

/**
 * A score's lines dealt onto A4 pages as they print (ADR 0075), the screen's and the print's alike:
 * a line starts a new page where it does not fit on the one begun, the title over the first line and
 * kept with it as the page is spread, every page but the last filled to its height (ADR 0087).
 */
export function SheetPages({
  lines,
  height,
  title,
  line,
}: {
  lines: readonly ScoreLine[]
  /** A line's height as engraved: its labels' row, its staves and the verses under its tune. */
  height: (line: ScoreLine) => number
  title: string
  line: (line: ScoreLine) => ReactNode
}) {
  const dealt = paginate(
    lines,
    (each) => height(each) + LINE_GAP,
    PAGE.height - 2 * PAGE.margin - TITLE_ROOM,
  )
  return dealt.map((page, number) => (
    <SheetPage
      key={number}
      number={number + 1}
      filled={number < dealt.length - 1}
      gap={LINE_GAP}
      blocks={page.map((each, at) => ({
        key: String(each.first),
        content:
          number === 0 && at === 0 ? (
            <div className="flex flex-col" style={{ gap: LINE_GAP }}>
              <SheetTitle title={title} place="page" />
              {line(each)}
            </div>
          ) : (
            line(each)
          ),
      }))}
    />
  ))
}
