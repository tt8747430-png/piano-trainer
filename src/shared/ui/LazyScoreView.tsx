import { lazy, Suspense, useEffect, useRef, useState, type ComponentProps } from 'react'
import { loadScoreView } from './score/load'
import { staffHeight } from './score/size'

const ScoreView = lazy(() => loadScoreView().then((module) => ({ default: module.ScoreView })))

/** How near the screen a staff starts loading: a scroll arrives at an engraved staff. */
const NEAR = '200px'

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
  const space = <div ref={place} style={{ height: staffHeight(props.staff) * scale }} />
  if (!shown) return space
  return (
    <Suspense fallback={space}>
      <ScoreView {...props} scale={scale} fingers={fingers} />
    </Suspense>
  )
}
