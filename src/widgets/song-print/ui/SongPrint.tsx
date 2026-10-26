import { useCallback, useEffect, useEffectEvent, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { MusicView } from '@/entities/settings'
import { usePieceInversions } from '@/features/choose-diagram-inversion'
import { chordSummary } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { SheetTitle } from '@/shared/ui'
import { ChordChart } from '@/widgets/chord-chart'
import { PrintedDiagrams } from '@/widgets/chord-diagrams'
import { PrintedLyrics } from '@/widgets/chord-views'
import { PrintedScore, type SheetViewChoice } from '@/widgets/sheet-music'

/** The beats a printed Grid's row holds: four bars of 4/4 across an A4 page. */
const PRINTED_ROW = 16

/** How the sheet music prints: as the View shows the score, with the Player's own marks. */
export interface PrintedSheet {
  readonly view: Omit<SheetViewChoice, 'layout'>
  readonly piano: boolean
  readonly staffNames: readonly (string | undefined)[]
  readonly fingers: boolean
  readonly names: boolean
  readonly positions: boolean
}

/**
 * The Player's music as it prints (ADR 0107, Chordify's Print and Export to PDF): the view shown as
 * it reads (the sheet music on its A4 pages, Chords over lyrics with its words, or the Grid, which
 * Diagrams prints as), the music as played (its key, Simplify); then a last page of its chords as
 * diagrams, in the inversions its piece chose. A render of its own over the page, seen only in print
 * (`theme.css` hides the app there while it stands): once all of it is drawn (the score engraved),
 * the browser's print is asked for, whose Save as PDF makes the PDF; done printing, it goes
 * (`onDone`).
 */
export function SongPrint({
  view,
  title,
  performance,
  headings,
  sheet,
  onDone,
}: {
  view: MusicView
  title: string
  performance: Performance
  headings: readonly string[]
  sheet: PrintedSheet
  onDone: () => void
}) {
  const chosen = usePieceInversions()?.chosen
  const chords = useMemo(() => chordSummary(performance, chosen), [performance, chosen])
  // Asked once, as all of it is drawn.
  const asked = useRef(false)
  const ready = useCallback(() => {
    if (asked.current) return
    asked.current = true
    window.print()
  }, [])
  const done = useEffectEvent(onDone)
  useEffect(() => {
    const finished = () => done()
    window.addEventListener('afterprint', finished)
    return () => window.removeEventListener('afterprint', finished)
  }, [])
  // The chord views are drawn at once; the sheet music once its lines are engraved.
  useEffect(() => {
    if (view !== 'sheet') ready()
  }, [view, ready])
  return createPortal(
    <div data-slot="song-print" className="hidden bg-background text-foreground print:block">
      {view === 'sheet' ? (
        <PrintedScore
          performance={performance}
          title={title}
          headings={headings}
          {...sheet}
          onReady={ready}
        />
      ) : (
        <section className="flex flex-col gap-6">
          <SheetTitle title={title} place="page" />
          {view === 'lyrics' ? (
            <PrintedLyrics performance={performance} headings={headings} />
          ) : (
            <ChordChart
              tap="print"
              rowBeats={PRINTED_ROW}
              performance={performance}
              headings={headings}
              playing={null}
            />
          )}
        </section>
      )}
      <PrintedDiagrams chords={chords} />
    </div>,
    document.body,
  )
}
