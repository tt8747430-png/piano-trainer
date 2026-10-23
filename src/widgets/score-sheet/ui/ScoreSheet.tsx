import { useMemo, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { barAt, type Draft, type Layer } from '@/features/score-editor'
import { PAGE, paginate, PRINT_SCALE, useElementSize, type SheetView } from '@/shared/lib'
import { PageCanvas } from '@/shared/ui'
import { lineLead, measureWidths, notate } from '@/shared/lib/notation'
import type { Midi, Tick } from '@/shared/lib/music'
import { staffHeight } from '@/shared/ui/score'
import { HEADING, lineFit } from '../model/line-fit'
import { createLineSheets, untimed, type LineSheet } from '../model/line-sheets'
import { labelRow } from '../model/label-row'
import { lineMusic, oneLine, type PlayedHands } from '../model/line-music'
import { SheetLine } from './SheetLine'

/** The room between lines on a page at full size, for dealing lines onto pages. */
const LINE_GAP = 16
/**
 * The staff's size down the screen (ADR 0074), as LilyPond sets a staff size per paper: full from a
 * sheet this wide, smaller on a phone, so a line holds more than a bar, never under `least`.
 */
const SCROLL_SCALE = { full: 600, least: 0.72 } as const

/** The staff's size on a sheet this wide, down the screen. */
const scrollScale = (width: number) =>
  width > 0 ? Math.min(1, Math.max(SCROLL_SCALE.least, width / SCROLL_SCALE.full)) : 1

type PageItem =
  | { readonly kind: 'title' }
  | { readonly kind: 'heading'; readonly section: number }
  | { readonly kind: 'line'; readonly sheet: LineSheet }

/**
 * The editor's sheet (spec §6.1, ADR 0064), as `view` lays it out: the piece by section down the
 * screen, each chart line a system of its staves; the same on A4 pages as it will print, its title
 * on the first; or all of it as one line across. Each bar numbered, its chord symbols over it, the
 * caret on its layer's staff. A line is drawn again only when what it shows changes.
 */
export function ScoreSheet({
  draft,
  played,
  caret,
  chordNote = null,
  layer,
  selection,
  onPlace,
  onReach,
  onDeselect,
  placesOf,
  tapsOf,
  heading,
  chordNames,
  onSignature,
  view = 'scroll',
  title,
  room,
  onWrite,
  onDrag,
}: {
  /** The height the sheet is seen in, where it is short: a line down the screen or across is drawn smaller to fit it whole. */
  room?: number | undefined
  /** A note written where a staff was double-clicked: its tick on the piece, its row and key. */
  onWrite?: (tick: Tick, layer: Layer, key: Midi) => void
  /** The notes at the caret dragged on their staff by steps of the key. */
  onDrag?: (steps: number, joins: boolean) => void
  draft: Draft
  /**
   * What each hand plays, the pattern's notes included, as the Player arranges the draft: shown soft
   * in the bars a hand leaves to the pattern (ADR 0083).
   */
  played?: PlayedHands | undefined
  caret: Tick
  /** One note of the chord at the caret chosen alone (ADR 0086). */
  chordNote?: Midi | null
  layer: Layer
  /** The notes chosen: their span on the piece (ADR 0086). */
  selection: { readonly from: Tick; readonly to: Tick } | null
  onPlace: (tick: Tick, layer: Layer, extend: boolean, key?: Midi) => void
  /** A held finger dragged onto the bar starting at a tick: what is chosen reaches it. */
  onReach: (tick: Tick) => void
  /** A click on empty staff: what is chosen let go. */
  onDeselect: () => void
  /** Where the caret may stand in a layer, asked when a bar is clicked. */
  placesOf: (layer: Layer) => readonly Tick[]
  /** Where a click lands in a layer: on a note or a bar's start, never an empty step (ADR 0082). */
  tapsOf: (layer: Layer) => readonly Tick[]
  /** A section's heading. */
  heading: (section: number) => ReactNode
  /** Chord names over the staff, written in their row; without them a click there writes the staff under it. */
  chordNames: boolean
  /** The clef, key and time signature clicked: what changes them. */
  onSignature: () => void
  view?: SheetView
  /** The piece's title, at the head of its first page. */
  title?: string
}) {
  const { t } = useTranslation('editor')
  const [sheetsOf] = useState(createLineSheets)
  const across = view === 'horizontal'
  const box = useRef<HTMLElement>(null)
  const { width } = useElementSize(box)
  // Pages as they print, on a canvas that zooms them to the screen (ADR 0075): laid out alike on any.
  const pages = view === 'pages'
  // The piece's music whole, for each bar's width: lines are cut by width, as an engraver cuts them.
  const whole = useMemo(() => {
    const [all] = oneLine(draft)
    return all ? notate(untimed(lineMusic(draft, all, played))) : undefined
  }, [draft, played])
  // The staves a line writes: the shown sung ones over the piano's two.
  const staves = whole?.staves.length ?? 2
  // A whole system in the height the sheet is seen in, where it is short (a phone on its side).
  const fit = room && room > 0 ? lineFit({ room, staves, headed: !across, chordNames }) : 1
  const sized = pages ? PRINT_SCALE : Math.min(fit, scrollScale(width))
  const widths = useMemo(
    () => (whole ? measureWidths(whole, sized, chordNames) : []),
    [whole, sized, chordNames],
  )
  const lead = whole ? lineLead(whole) : 0
  // The room a line's bars have, in the engraving's units: the sheet's or the page's, less the clef and key.
  const roomAcross = pages
    ? (PAGE.width - 2 * PAGE.margin) / sized - lead
    : width <= 0
      ? Infinity
      : width / sized - lead
  const sheets = useMemo(
    () => sheetsOf(draft, across ? { across: true } : { room: roomAcross, widths }, played),
    [sheetsOf, draft, across, roomAcross, widths, played],
  )
  const caretBar = barAt(draft, caret).index

  const line = (sheet: LineSheet, scale?: number, print = false) => (
    <SheetLine
      key={`${sheet.line.section} ${sheet.line.line} ${sheet.line.start}`}
      sheet={sheet}
      layer={layer}
      caret={
        sheet.line.bars.some((placed) => placed.index === caretBar)
          ? caret - sheet.line.start
          : null
      }
      chordNote={chordNote}
      tapsOf={tapsOf}
      selection={selection}
      onPlace={onPlace}
      onReach={onReach}
      onDeselect={onDeselect}
      placesOf={placesOf}
      chordNames={chordNames}
      onSignature={onSignature}
      justify={!across}
      onWrite={onWrite}
      onDrag={onDrag}
      {...(scale === undefined ? {} : { scale })}
      print={print}
    />
  )

  if (pages) {
    const scale = PRINT_SCALE
    const lineHeight =
      labelRow(chordNames, scale, true) + (staffHeight(undefined, staves) + LINE_GAP) * scale
    const items: PageItem[] = [
      ...(title ? [{ kind: 'title' } as const] : []),
      ...draft.sections.flatMap((_, section): PageItem[] => [
        { kind: 'heading', section },
        ...sheets
          .filter((sheet) => sheet.line.section === section)
          .map((sheet) => ({ kind: 'line', sheet }) as const),
      ]),
    ]
    const dealt = paginate(
      items,
      (item) => (item.kind === 'line' ? lineHeight : HEADING),
      PAGE.height - 2 * PAGE.margin,
      (item) => item.kind !== 'line',
    )
    return (
      <PageCanvas column={PAGE.width}>
        <section aria-label={t('sheet.label')} className="flex flex-col items-center gap-8 p-6">
          {dealt.map((page, index) => (
            <article
              key={index}
              aria-label={t('sheet.page', { n: index + 1, of: dealt.length })}
              data-slot="sheet-page"
              className="relative flex flex-col bg-card text-card-foreground shadow-lg shadow-foreground/10 ring-1 ring-hairline"
              style={{
                width: PAGE.width,
                minHeight: PAGE.height,
                padding: PAGE.margin,
                gap: LINE_GAP * scale,
              }}
            >
              {page.map((item) =>
                item.kind === 'title' ? (
                  <h2 key="title" className="text-center font-display text-3xl">
                    {title}
                  </h2>
                ) : item.kind === 'heading' ? (
                  <div key={`heading ${item.section}`}>{heading(item.section)}</div>
                ) : (
                  line(item.sheet, scale, true)
                ),
              )}
              <span
                aria-hidden
                className="absolute inset-x-0 text-center text-xs text-muted-foreground"
                style={{ bottom: PAGE.margin / 2 }}
              >
                {index + 1}
              </span>
            </article>
          ))}
        </section>
      </PageCanvas>
    )
  }

  if (across) {
    return (
      <section ref={box} aria-label={t('sheet.label')} className="flex flex-col gap-2">
        {sheets.map((sheet) => line(sheet, fit))}
      </section>
    )
  }

  return (
    <section ref={box} aria-label={t('sheet.label')} className="flex flex-col gap-8">
      {draft.sections.map((_, section) => (
        <section key={section} className="flex flex-col gap-2">
          {heading(section)}
          {sheets
            .filter((sheet) => sheet.line.section === section)
            .map((sheet) => line(sheet, sized))}
        </section>
      ))}
    </section>
  )
}
