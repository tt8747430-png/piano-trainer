import { useTranslation } from 'react-i18next'
import { writtenBarOf, type BarRange, type PlayedBeat } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { SheetTitle } from '@/shared/ui'
import { ChordChart } from '@/widgets/chord-chart'
import { loopedBars } from '../model/beat-span'

/**
 * The Grid (ADR 0098, 0099): the music's chord chart in beats under its title, its sections headed,
 * the beat sounding filled and its bar kept in sight, the loop's bars on its band; a beat tapped
 * takes the cursor there. Its own scroller, with room to scroll its last line clear of the transport
 * floating over its foot.
 */
export function GridView({
  title,
  performance,
  headings,
  beat,
  loop,
  onBeat,
}: {
  title: string
  performance: Performance
  headings: readonly string[]
  beat: PlayedBeat
  loop: BarRange | null
  /** A beat tapped: the tick it is first played at. */
  onBeat: (at: Tick) => void
}) {
  const { t } = useTranslation('player')
  return (
    <section
      aria-label={t('views.grid')}
      className="flex h-full scroll-pb-(--float-room) flex-col gap-6 overflow-y-auto overscroll-contain"
    >
      <SheetTitle title={title} place="lines" />
      <ChordChart
        tap="go"
        performance={performance}
        headings={headings}
        playing={writtenBarOf(performance, beat.bar)}
        beat={beat.beat}
        looped={loopedBars(performance, loop)}
        onBar={(_, at) => onBeat(at)}
        className="mx-auto w-full"
      />
      <div aria-hidden className="-mt-6 h-(--float-room) shrink-0" />
    </section>
  )
}
