import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { Performance } from '@/shared/lib/arrangement'
import { PAGE, PRINT_SCALE } from '@/shared/lib'
import { lineLead, measureWidths } from '@/shared/lib/notation'
import { labelRow, ScoreView, scoreHeight } from '@/shared/ui/score'
import { scoreLines } from '../model/score-lines'
import { SheetLabels } from './SheetLabels'
import type { SheetViewChoice } from './SheetMusic'
import { SheetPages } from './SheetPages'
import { useSheetScore } from './use-sheet-score'

/** The width a page's line is spread to, inside its margins. */
const PAGE_LINE = PAGE.width - 2 * PAGE.margin

/** Says that its line, by its first bar, is engraved. */
function Engraved({ first, onEngraved }: { first: number; onEngraved: (first: number) => void }) {
  useEffect(() => onEngraved(first), [first, onEngraved])
  return null
}

/**
 * The sheet music as it prints (ADR 0107): the pages the Pages layout shows (ADR 0096, 0087), at their
 * print size, as the View shows the score (its staves, chord symbols and words), each line with its
 * labels' row and nothing a screen adds (the playhead, the loop, bars to tap). Says when every line
 * is engraved (`onReady`), so the browser prints it whole.
 */
export function PrintedScore({
  performance,
  view,
  piano,
  staffNames,
  title,
  headings,
  fingers,
  names,
  positions,
  onReady,
}: {
  performance: Performance
  view: Omit<SheetViewChoice, 'layout'>
  piano: boolean
  staffNames: readonly (string | undefined)[]
  title: string
  headings: readonly string[]
  fingers: boolean
  names: boolean
  positions: boolean
  onReady: () => void
}) {
  const { score, tempos, staves, labels } = useSheetScore(
    performance,
    { lyrics: view.lyrics, piano, hidden: view.hidden },
    staffNames,
  )
  const row = labelRow(view.chordNames)
  const lines = useMemo(() => {
    const widths = measureWidths(score, PRINT_SCALE, view.chordNames, labels)
    return scoreLines(score, performance, {
      room: PAGE_LINE / PRINT_SCALE - lineLead(score),
      widths,
    })
  }, [score, performance, view.chordNames, labels])
  // The lines engraved so far, by their first bar: the print waits for every one.
  const engraved = useRef(new Set<number>())
  const told = useRef(false)
  const onEngraved = useCallback(
    (first: number) => {
      engraved.current.add(first)
      if (told.current || engraved.current.size < lines.length) return
      told.current = true
      onReady()
    },
    [lines, onReady],
  )
  return (
    <div data-slot="printed-score" className="flex flex-col">
      <SheetPages
        lines={lines}
        height={(each) => row + scoreHeight(each.score, staves) * PRINT_SCALE}
        title={title}
        line={(each) => (
          <div className="relative" style={{ paddingTop: row }}>
            <ScoreView
              score={each.score}
              scale={PRINT_SCALE}
              fingers={fingers}
              names={names}
              staves={staves}
              timeBefore={each.timeBefore}
              next={each.next}
              labels={each.first === 0 ? labels : undefined}
              fill={PAGE_LINE}
            >
              {(layout) => (
                <>
                  <SheetLabels
                    layout={layout}
                    performance={performance}
                    headings={headings}
                    positions={positions}
                    chordNames={view.chordNames}
                    tempos={tempos}
                    firstBar={each.first}
                  />
                  <Engraved first={each.first} onEngraved={onEngraved} />
                </>
              )}
            </ScoreView>
          </div>
        )}
      />
    </div>
  )
}
