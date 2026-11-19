import { useMemo } from 'react'
import { notate } from '@/shared/lib/notation'
import { TappableStaff } from '@/features/play-example'
import type { PatternSample } from '../model/pattern-sample'

/** A note or bar tapped on the sample sounds at this tempo. */
const NOTE_TEMPO = 84

/**
 * The sample on the grand staff, each hand on its own; a note or bar tapped plays. What it is played
 * over is Play's menu's, never a caption (the board's MUSIC63).
 */
export function PatternStaff({ sample }: { sample: PatternSample }) {
  const score = useMemo(() => notate(sample.music), [sample.music])
  return (
    <div className="max-w-full overflow-x-auto overscroll-x-contain scrollbar-none">
      <TappableStaff music={sample.music} score={score} tempo={NOTE_TEMPO} />
    </div>
  )
}
