import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { BarRange } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { useElementSize } from '@/shared/lib'
import { notate, type StaffId } from '@/shared/lib/notation'
import { ScoreView, staffHeight, type ScoreLayout } from '@/shared/ui/score'
import { fitScale, widestBar } from '../model/fit-scale'
import { SheetOverlay } from './SheetOverlay'

/** The room fingers take under and over the staff (the labels' row is the section's padding). */
const FINGERS = 36
/** A bar measured this much wider or narrower than before engraves the staff again; less does not. */
const BAR_CHANGE = 0.1

/**
 * Tells the widest bar, at scale 1, of each engraving as it is drawn: the next is scaled by it. Read
 * as a new engraving comes, at the scale it was drawn at; the one before stays up while the next is
 * drawn, under the new scale.
 */
function BarWidth({
  layout,
  scale,
  onBar,
}: {
  layout: ScoreLayout
  scale: number
  onBar: (bar: number) => void
}) {
  const tell = useEffectEvent((engraved: ScoreLayout) => {
    const bar = widestBar(engraved, scale)
    if (bar !== undefined) onBar(bar)
  })
  useEffect(() => tell(layout), [layout])
  return null
}

/**
 * A Performance as sheet music on one scrolling line of grand staff (spec §2.6): chord symbols over
 * numbered bars, the cursor on the beat group now, the loop, bars to jump to. It takes the height it
 * is given and engraves the staff to fill it (`fitScale`) while two of its bars still show, so music
 * read from a stand is as large as the screen allows: on a phone upright too.
 */
export function SheetMusic({
  performance,
  headings,
  current,
  loop,
  fingers,
  names,
  positions,
  muted,
  onJump,
  onLoopChange,
}: {
  performance: Performance
  /** Each section's name, by section: shown at its first bar. */
  headings: readonly string[]
  /** The beat group the cursor is on. */
  current: number
  loop: BarRange | null
  fingers: boolean
  /** Each notehead carries its note's name. */
  names: boolean
  /** Each chord symbol says how the right hand plays it: its inversion. */
  positions: boolean
  /** The staff of the hand not heard or practised. */
  muted: StaffId | undefined
  onJump: (beatGroup: number) => void
  onLoopChange: (loop: BarRange) => void
}) {
  const { t } = useTranslation('music')
  const score = useMemo(() => notate(performance), [performance])
  const scroller = useRef<HTMLElement>(null)
  const { width, height } = useElementSize(scroller)
  const room = { width, height: height - (fingers ? FINGERS : 0) }
  // The music's own widest bar, once engraved: a line of plain bars grows where a busy one cannot.
  const [bar, setBar] = useState<number>()
  const onBar = useMemo(
    () => (next: number) =>
      setBar((kept) =>
        kept !== undefined && Math.abs(next - kept) <= kept * BAR_CHANGE ? kept : next,
      ),
    [],
  )
  const scale = fitScale(room, staffHeight(muted), bar)
  return (
    <section
      ref={scroller}
      aria-label={t('sheet.label')}
      className="relative -mx-gutter h-full overflow-x-auto overscroll-x-contain px-gutter pt-11 scrollbar-none landscape-phone:mx-0 landscape-phone:px-0"
    >
      <ScoreView score={score} scale={scale} fingers={fingers} names={names} muted={muted}>
        {(layout) => (
          <>
            <BarWidth layout={layout} scale={scale} onBar={onBar} />
            <SheetOverlay
              layout={layout}
              scroller={scroller}
              performance={performance}
              headings={headings}
              positions={positions}
              current={current}
              loop={loop}
              onJump={onJump}
              onLoopChange={onLoopChange}
            />
          </>
        )}
      </ScoreView>
    </section>
  )
}
