import { useMemo, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { barAt, type BarRange, type Draft, type Layer } from '@/features/score-editor'
import { longestLine, PAGE, paginate, useElementSize, type SheetView } from '@/shared/lib'
import type { Midi, Tick } from '@/shared/lib/music'
import { staffHeight } from '@/shared/ui/score'
import { HEADING, lineFit } from '../model/line-fit'
import { createLineSheets, type LineSheet } from '../model/line-sheets'
import { CHORD_ROW } from './chord-row'
import { SheetLine } from './SheetLine'

/** The room between lines, for dealing lines onto pages. */
const LINE_GAP = 8

/** How many bars a line down a screen this wide holds at most, readable: a phone's two, a tablet's three. */
const mostBars = (width: number) =>
  width === 0 ? Infinity : width < 560 ? 2 : width < 860 ? 3 : Infinity

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
  caret,
  layer,
  caretTicks,
  selection,
  onPlace,
  placesOf,
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
  caret: Tick
  layer: Layer
  /** How long the next note is: the caret's width. */
  caretTicks: Tick
  selection: BarRange | null
  onPlace: (tick: Tick, layer: Layer, extend: boolean) => void
  /** Where the caret may stand in a layer, asked when a bar is clicked. */
  placesOf: (layer: Layer) => readonly Tick[]
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
  const most = view === 'scroll' ? mostBars(width) : Infinity
  const sheets = useMemo(() => sheetsOf(draft, across, most), [sheetsOf, draft, across, most])
  const caretBar = barAt(draft, caret).index
  // Each line runs to its bars' share of the longest, so bars line up down the sheet as a chart's do.
  const { shareOf } = longestLine(sheets.map((sheet) => sheet.line.bars.length))
  // A whole system in the height the sheet is seen in, where it is short (a phone on its side).
  const fit =
    room && room > 0
      ? lineFit({
          room,
          staves: Math.max(1, ...sheets.map((sheet) => sheet.score.staves.length)),
          headed: !across,
        })
      : 1

  const line = (sheet: LineSheet, scale?: number) => (
    <SheetLine
      key={`${sheet.line.section} ${sheet.line.line} ${sheet.line.start}`}
      sheet={sheet}
      layer={layer}
      caret={
        sheet.line.bars.some((placed) => placed.index === caretBar)
          ? caret - sheet.line.start
          : null
      }
      caretTicks={caretTicks}
      selection={selection}
      onPlace={onPlace}
      placesOf={placesOf}
      chordNames={chordNames}
      onSignature={onSignature}
      justify={!across}
      share={shareOf(sheet.line.bars.length)}
      onWrite={onWrite}
      onDrag={onDrag}
      {...(scale === undefined ? {} : { scale })}
    />
  )

  if (view === 'pages') {
    const paper = Math.min(width, PAGE.width)
    const scale = paper > 0 ? paper / PAGE.width : 1
    const margin = PAGE.margin * scale
    // The staves a line writes: the shown sung ones over the piano's two.
    const count =
      (sheets[0]?.music.voiceStaves?.length ?? 0) + (sheets[0]?.music.melodyStaff ? 3 : 2)
    const lineHeight = CHORD_ROW + staffHeight(undefined, count) * scale + LINE_GAP
    const items: PageItem[] = [
      ...(title ? [{ kind: 'title' } as const] : []),
      ...draft.sections.flatMap((_, section): PageItem[] => [
        { kind: 'heading', section },
        ...sheets
          .filter((sheet) => sheet.line.section === section)
          .map((sheet) => ({ kind: 'line', sheet }) as const),
      ]),
    ]
    const pages = paginate(
      items,
      (item) => (item.kind === 'line' ? lineHeight : HEADING),
      PAGE.height * scale - 2 * margin,
      (item) => item.kind !== 'line',
    )
    return (
      <section ref={box} aria-label={t('sheet.label')} className="flex flex-col items-center gap-6">
        {pages.map((page, index) => (
          <article
            key={index}
            aria-label={t('sheet.page', { n: index + 1, of: pages.length })}
            data-slot="sheet-page"
            className="relative flex w-full flex-col gap-2 bg-card text-card-foreground shadow-lg shadow-foreground/10 ring-1 ring-hairline"
            style={{ maxWidth: PAGE.width, minHeight: PAGE.height * scale, padding: margin }}
          >
            {page.map((item) =>
              item.kind === 'title' ? (
                <h2 key="title" className="text-center font-display text-2xl">
                  {title}
                </h2>
              ) : item.kind === 'heading' ? (
                <div key={`heading ${item.section}`}>{heading(item.section)}</div>
              ) : (
                line(item.sheet, scale)
              ),
            )}
            <span
              aria-hidden
              className="absolute inset-x-0 text-center text-xs text-muted-foreground"
              style={{ bottom: margin / 2 }}
            >
              {index + 1}
            </span>
          </article>
        ))}
      </section>
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
            .map((sheet) => line(sheet, fit))}
        </section>
      ))}
    </section>
  )
}
