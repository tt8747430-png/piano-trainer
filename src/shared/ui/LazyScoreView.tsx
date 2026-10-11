import { lazy, Suspense, useEffect, useRef, useState, type ComponentProps, type Ref } from 'react'
import { loadScoreView } from './score/load'
import { ONE_STAFF_Y, staffHeight } from './score/size'

const ScoreView = lazy(() => loadScoreView().then((module) => ({ default: module.ScoreView })))

/** How near the screen a staff starts loading: a scroll arrives at an engraved staff. */
const NEAR = '200px'

/** Each staff's top line in VexFlow units, as the engraving places it: treble and bass, or one alone. */
const GRAND_STAFF_TOPS = [40, 130]
const ONE_STAFF_TOPS = [ONE_STAFF_Y + 40]

/**
 * The staff's place while its engraver loads: its five lines, faint, where the engraving will draw
 * them, so the page reads as music on its way rather than a gap.
 */
function StaffPlace({
  place,
  height,
  scale,
  one,
}: {
  place?: Ref<HTMLDivElement>
  height: number
  scale: number
  one: boolean
}) {
  const tops = one ? ONE_STAFF_TOPS : GRAND_STAFF_TOPS
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
  const space = (
    <StaffPlace
      place={place}
      height={staffHeight(props.staff)}
      scale={scale}
      one={props.staff !== undefined}
    />
  )
  if (!shown) return space
  return (
    <Suspense fallback={space}>
      <ScoreView {...props} scale={scale} fingers={fingers} />
    </Suspense>
  )
}
