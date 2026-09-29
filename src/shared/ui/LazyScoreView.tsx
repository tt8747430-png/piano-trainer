import { lazy, Suspense, type ComponentProps } from 'react'
import { loadScoreView } from './score/load'
import { staffHeight } from './score/size'

const ScoreView = lazy(() => loadScoreView().then((module) => ({ default: module.ScoreView })))

/**
 * A score engraved as the Player's is, its engraver (VexFlow) loaded only when a staff is first on
 * screen, so a page that shows one keeps it out of its own chunk: until then, the staff's space.
 */
export function LazyScoreView(props: ComponentProps<typeof ScoreView>) {
  return (
    <Suspense fallback={<div style={{ height: staffHeight(props.staff) * props.scale }} />}>
      <ScoreView {...props} />
    </Suspense>
  )
}
