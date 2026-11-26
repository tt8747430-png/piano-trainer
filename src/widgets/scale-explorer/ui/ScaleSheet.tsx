import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { notate, type StaffId, type TimedMusic } from '@/shared/lib/notation'
import type { Hands } from '@/shared/lib/schedule'
import { useElementSize } from '@/shared/lib'
import { TappableStaff } from '@/features/play-example'

/** A note or bar tapped on the run sounds at this tempo. */
const NOTE_TEMPO = 96

/**
 * The board's staff spans its card (GRANDSTAFF, a 360-unit view at 7 units a space): a space is
 * 7/360 of the width, and scale 1 draws 10, so the scale is the width over this.
 */
const UNITS_A_SCALE = 3600 / 7
/** The widest the run is drawn, centred in the card, as the laptop board's 640. */
const MOST_WIDTH = 640
/** The board's view is 360 units wide and 168 tall: the room its two staves and fingers take. */
const HEIGHT_A_WIDTH = 168 / 360

/** The staff of the hand not playing, soft as in the Player. */
const MUTED: Readonly<Record<Hands, StaffId | undefined>> = {
  both: undefined,
  rh: 'bass',
  lh: 'treble',
}

/**
 * The run on a grand staff as it plays, in its scale's key, with finger numbers while a hand's are
 * shown, justified to its card at the board's size; a note or a bar tapped plays.
 */
export function ScaleSheet({
  music,
  hands,
  fingers,
}: {
  music: TimedMusic
  hands: Hands
  fingers: boolean
}) {
  const { t } = useTranslation('music')
  const score = useMemo(() => notate(music), [music])
  const box = useRef<HTMLElement>(null)
  const { width: room } = useElementSize(box)
  const width = Math.min(room, MOST_WIDTH)
  return (
    <section
      ref={box}
      aria-label={t('sheet.label')}
      className="flex items-center justify-center"
      style={{ minHeight: width * HEIGHT_A_WIDTH }}
    >
      {width > 0 ? (
        <TappableStaff
          music={music}
          score={score}
          fingers={fingers}
          muted={MUTED[hands]}
          scale={width / UNITS_A_SCALE}
          fill={width}
          tempo={NOTE_TEMPO}
        />
      ) : null}
    </section>
  )
}
