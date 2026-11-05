import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { writtenBarOf, type BarRange, type PlayedBeat } from '@/features/practice'
import { useScrollMotion } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { SheetTitle } from '@/shared/ui'
import { ChordChart } from '@/widgets/chord-chart'
import { loopedBars } from '../model/beat-span'
import { inSight } from '../model/in-sight'
import { useFollow } from '../model/use-follow'
import { BackToPlayhead } from './BackToPlayhead'
import { gridWords } from '../model/lyric-lines'

/**
 * The Grid (ADR 0108): the music's chord chart in beats under its title, its sections headed,
 * the beat sounding filled, the loop's bars on its band; a beat tapped takes the cursor there. Its
 * own scroller, with room to scroll its last line clear of the transport floating over its foot. The
 * bar the cursor is in is kept in sight as the music moves on, as the sheet keeps the line playing;
 * opening, the Grid stays at its top, its title in sight, where that bar is in sight there (a loop's
 * further on is brought to). With the View's Lyrics, each bar's words under the beats they are sung
 * on (ADR 0108).
 */
export function GridView({
  title,
  performance,
  headings,
  beat,
  loop,
  words,
  playing,
  onBeat,
}: {
  title: string
  performance: Performance
  headings: readonly string[]
  beat: PlayedBeat
  loop: BarRange | null
  /** The View's Lyrics: the words under the beats. */
  words: boolean
  /** Whether the music plays: a scroll by hand then pauses following (A37). */
  playing: boolean
  /** A beat tapped: the tick it is first played at. */
  onBeat: (at: Tick) => void
}) {
  const { t } = useTranslation('player')
  const bar = writtenBarOf(performance, beat.bar)
  const sung = useMemo(() => (words ? gridWords(performance) : undefined), [words, performance])
  const scroller = useRef<HTMLElement>(null)
  // The bar last kept in sight; none before the Grid opens.
  const kept = useRef<string | null>(null)
  const motion = useScrollMotion()
  // The one follow rule (A37): a scroll by hand while it plays pauses it, the pill brings it back.
  const follow = useFollow(scroller, playing)
  const { following, returns } = follow
  useEffect(() => {
    const box = scroller.current
    const here = box?.querySelector('[aria-current="step"]')
    const place = `${bar}:${returns}`
    if (!box || !here || !following || kept.current === place) return
    const opening = kept.current === null
    kept.current = place
    if (opening && inSight(here, box)) return
    here.scrollIntoView({ block: 'nearest', behavior: motion })
  }, [bar, motion, following, returns])
  return (
    <section
      ref={scroller}
      aria-label={t('views.grid')}
      className="flex h-full scroll-pb-(--float-room) flex-col gap-6 overflow-y-auto overscroll-contain *:shrink-0"
    >
      <SheetTitle title={title} place="lines" />
      <ChordChart
        tap="go"
        performance={performance}
        headings={headings}
        playing={bar}
        beat={beat.beat}
        looped={loopedBars(performance, loop)}
        words={sung}
        onBar={(_, at) => onBeat(at)}
        className="mx-auto w-full"
      />
      <div aria-hidden className="-mt-6 h-(--float-room) shrink-0" />
      <BackToPlayhead follow={follow} />
    </section>
  )
}
