import type { ReactNode } from 'react'
import { PAGE, paginate } from '@/shared/lib'
import type { ScoreHeader } from '@/entities/piece'
import { creditsRoom, hasCredits, SheetCredits, SheetPage, SheetTitle } from '@/shared/ui'
import type { ScoreLine } from '../model/score-lines'

/** The room between lines, at print size. */
export const LINE_GAP = 16
/** The title's room over the first page's first line, at print size. */
const TITLE_ROOM = 44

/**
 * A score's lines dealt onto A4 pages as they print (ADR 0096), the screen's and the print's alike:
 * a line starts a new page where it does not fit on the one begun, a printed score's title over the
 * first line and kept with it as the page is spread (the Player's title is its bar's), every page but the last filled to its height (ADR 0087).
 */
export function SheetPages({
  lines,
  height,
  title,
  credits,
  line,
}: {
  lines: readonly ScoreLine[]
  /** A line's height as engraved: its labels' row, its staves and the verses under its tune. */
  height: (line: ScoreLine) => number
  /** Printed over the first line, on paper; the Player's pages print none, its title being its bar's. */
  title?: string | undefined
  /** Printed under the title (ADR 0114). */
  credits?: ScoreHeader | undefined
  line: (line: ScoreLine) => ReactNode
}) {
  const dealt = paginate(
    lines,
    (each) => height(each) + LINE_GAP,
    PAGE.height - 2 * PAGE.margin - (title === undefined ? 0 : TITLE_ROOM + creditsRoom(credits)),
    undefined,
    // A page break before a line's first bar (ADR 0097).
    (each) => each.score.measures[0]?.pageBreak === true,
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
          title !== undefined && number === 0 && at === 0 ? (
            <div className="flex flex-col" style={{ gap: LINE_GAP }}>
              <div>
                <SheetTitle title={title} place="page" />
                {hasCredits(credits) ? <SheetCredits credits={credits} /> : null}
              </div>
              {line(each)}
            </div>
          ) : (
            line(each)
          ),
      }))}
    />
  ))
}
