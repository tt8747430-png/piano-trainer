import { Repeat } from 'lucide-react'
import { useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { usePlayback } from '@/shared/lib/services'
import {
  FloatingActions,
  FloatingPiece,
  FloatingPieces,
  FloatingPlaySplit,
  usePlayKey,
  type ShownKeys,
} from '@/shared/ui'
import type { PatternSample } from '../model/pattern-sample'

/**
 * A pattern's page's floating bar (canvas 178), as a progression's: Loop (ink while it loops, the
 * sample starting again as it ends), Play with what it plays over in its menu, the honey one Enter
 * plays too; it is practised by the page's rows.
 */
export function PatternPieces({
  sample,
  onShow,
  menuLabel,
  menu,
}: {
  sample: PatternSample
  onShow: (shown: ShownKeys) => void
  menuLabel: string
  menu: (trigger: ReactElement) => ReactNode
}) {
  const { t } = useTranslation(['music', 'player', 'practice'])
  const playback = usePlayback<'sample'>()
  const [looping, setLooping] = useState(false)
  // Looped, the sample starts again as it ends by itself; never after Stop.
  const ended = useRef({ played: false, stopped: false })
  const { playing, start } = playback
  useEffect(() => {
    const was = ended.current
    if (playing === 'sample') was.played = true
    else if (playing === null && was.played && looping && !was.stopped)
      start('sample', sample.sounds)
    else was.played = false
  }, [playing, looping, start, sample.sounds])
  const play = () => {
    ended.current.stopped = playing === 'sample'
    playback.toggle('sample', () => {
      onShow(sample.shown)
      return sample.sounds
    })
  }
  usePlayKey(play)
  return (
    <FloatingActions>
      <FloatingPieces label={t('practice:transport')}>
        <FloatingPiece
          label={t('player:loop')}
          caption={t('player:loop')}
          round
          aria-pressed={looping}
          onClick={() => setLooping((was) => !was)}
          className="aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:hover:bg-foreground"
        >
          <Repeat aria-hidden />
        </FloatingPiece>
        <FloatingPlaySplit
          label={t('music:play')}
          playing={playing === 'sample'}
          onPlay={play}
          menuLabel={menuLabel}
          menu={menu}
        />
        {/* Practised by the page's rows, never a third piece: its place kept empty (the board's
            BAR63: Loop · Play · an empty span). */}
        <span aria-hidden />
      </FloatingPieces>
    </FloatingActions>
  )
}
