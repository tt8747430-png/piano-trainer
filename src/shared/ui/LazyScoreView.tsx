import { lazy, Suspense, useEffect, useRef, useState, type ComponentProps, type Ref } from 'react'
import { loadScoreView } from './score/load'
import { drawnStaves } from './score/drawn-staves'
import { staffHeight, staffTops } from './score/size'

const ScoreView = lazy(() => loadScoreView().then((module) => ({ default: module.ScoreView })))

/** How near the screen a staff starts loading: a scroll arrives at an engraved staff. */
const NEAR = '200px'

/**
 * The staff's place while its engraver loads: its five lines, faint, where the engraving will draw
 * them, so the page reads as music on its way rather than a gap.
 */
function StaffPlace({
  place,
  height,
  scale,
  count,
}: {
  place?: Ref<HTMLDivElement>
  height: number
  scale: number
  /** How many staves: each staff's top line where the engraving will place it. */
  count: number
}) {
  const tops = staffTops(count)
  return (
    <div ref={place} style={{ height: height * scale }} className="text-hairline" aria-hidden>
      <svg width="100%" height="100%" preserveAspectRatio="none">
        {tops.flatMap((top) =>
          [0, 10, 20, 30, 40].map((line) => (
            <line
              key={top + line}
              x1="0"
              x2="100%"
              y1={(top + line) * scale}
              y2={(top + line) * scale}
              stroke="currentColor"
            />
          )),
        )}
      </svg>
    </div>
  )
}

/**
 * A score engraved as the Player's is, its engraver (VexFlow) loaded only when a staff is first on
 * screen, so a page that shows one keeps it out of its own chunk, and a lesson engraves only the
 * staves it reaches: until then, the staff's space. A staff outside the Player is at its own size
 * with no fingering unless it says so.
 */
export function LazyScoreView({
  scale = 1,
  fingers = false,
  ...props
}: Omit<ComponentProps<typeof ScoreView>, 'scale' | 'fingers'> & {
  scale?: number
  fingers?: boolean
}) {
  const place = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const element = place.current
    if (shown || !element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setShown(true)
      },
      { rootMargin: NEAR },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [shown])
  const count = drawnStaves(props.score, props.staff, props.staves).length
  const space = (
    <StaffPlace place={place} height={staffHeight(undefined, count)} scale={scale} count={count} />
  )
  if (!shown) return space
  return (
    <Suspense fallback={space}>
      <ScoreView {...props} scale={scale} fingers={fingers} />
    </Suspense>
  )
}
