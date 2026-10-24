import { useTranslation } from 'react-i18next'
import type { Performance } from '@/shared/lib/arrangement'
import { SheetTitle } from '@/shared/ui'
import { ChordChart } from '@/widgets/chord-chart'

/**
 * A piece's chord chart where its sheet music is, with the View's Sheet music off (ADR 0098): its
 * title at its head, its bars as written by section, the bar the cursor is in marked as it plays and
 * kept in sight. A bar tapped takes the cursor there, as the sheet's bars do: while nothing plays the
 * Player sounds it where it lands, its chord on the keys.
 */
export function PieceChart({
  title,
  performance,
  headings,
  playing,
  onBar,
}: {
  title: string
  performance: Performance
  headings: readonly string[]
  /** The bar the cursor is in, as written. */
  playing: number
  /** The cursor taken to a bar as written. */
  onBar: (bar: number) => void
}) {
  const { t } = useTranslation('player')
  return (
    // Its own scroller, as the sheet's lines are, with room to scroll its last line clear of the
    // transport floating over its foot.
    <section
      aria-label={t('chart')}
      className="flex h-full scroll-pb-(--float-room) flex-col gap-6 overflow-y-auto overscroll-contain"
    >
      <SheetTitle title={title} place="lines" />
      <ChordChart
        tap="go"
        performance={performance}
        headings={headings}
        playing={playing}
        onBar={onBar}
        className="mx-auto w-full"
      />
      <div aria-hidden className="-mt-6 h-(--float-room) shrink-0" />
    </section>
  )
}
