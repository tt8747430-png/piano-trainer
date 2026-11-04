import type { Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { staffHeight } from './size'
import { StaffPlace } from './StaffPlace'

/** Where a skeleton's systems stand in the whole score: its first bar, of how many. */
export interface SkeletonBars {
  readonly at: number
  readonly of: number
}

/**
 * The engraving's skeleton (A34): its systems of staves at their final size, faint, while the
 * engraver draws them, with where they stand in the score ("Bar 12 of 48") over the first, so a long
 * score reads as music on its way rather than a gap. The drawing it waits for replaces it whole; one
 * drawn before stays until the new one is ready (`ScoreView`).
 */
export function ScoreSkeleton({
  systems,
  staves,
  scale = 1,
  height,
  bars,
  place,
}: {
  /** Its element, watched for when it comes on screen. */
  place?: Ref<HTMLDivElement> | undefined
  systems: number
  staves: number
  scale?: number
  /** One system's height at the score's own size, where it is known (its verses under it). */
  height?: number | undefined
  bars?: SkeletonBars | undefined
}) {
  const { t } = useTranslation('music')
  const each = height ?? staffHeight(undefined, staves)
  return (
    <div
      ref={place}
      data-slot="score-skeleton"
      style={{ height: Math.max(1, systems) * each * scale }}
      className="relative flex flex-col"
    >
      {Array.from({ length: Math.max(1, systems) }, (_, at) => (
        <StaffPlace key={at} height={each} scale={scale} count={staves} />
      ))}
      {bars ? (
        <span className="absolute top-0 left-0 rounded-pill bg-card/90 px-2 py-0.5 text-xs text-muted-foreground tabular-nums">
          {t('sheet.barOf', { at: bars.at, of: bars.of })}
        </span>
      ) : null}
      <p className="sr-only" role="status">
        {t('sheet.loading')}
      </p>
    </div>
  )
}
