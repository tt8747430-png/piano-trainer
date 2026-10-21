import { useMemo, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { barAt, type BarRange, type Draft, type Layer } from '@/features/score-editor'
import { lineShare, PAGE, paginate, useElementSize, type SheetView } from '@/shared/lib'
import { lineLead, measureWidths, notate } from '@/shared/lib/notation'
import type { Midi, Tick } from '@/shared/lib/music'
import { staffHeight } from '@/shared/ui/score'
import { HEADING, lineFit } from '../model/line-fit'
import { createLineSheets, untimed, type LineSheet } from '../model/line-sheets'
import { labelRow } from '../model/label-row'
import { lineMusic, oneLine } from '../model/line-music'
import { SheetLine } from './SheetLine'

/** The room between lines on a page at full size, for dealing lines onto pages. */
const LINE_GAP = 16
/** How small a page is drawn, and how large: smaller, a phone shows its page's music too small to read. */
const PAGE_SCALE = { least: 0.62, most: 1.2 } as const
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
  // A page zoomed to the screen's width, as a notation app's Page Width, never under a readable size:
  // a phone's page is then a narrower one, its lines of fewer bars.
  const pageScale =
    width > 0 ? Math.min(PAGE_SCALE.most, Math.max(PAGE_SCALE.least, width / PAGE.width)) : 1
  const paper = width > 0 ? Math.min(width, PAGE.width * pageScale) : PAGE.width
  const margin = PAGE.margin * pageScale
  // The piece's music whole, for each bar's width: lines are cut by width, as an engraver cuts them.
  const whole = useMemo(() => {
    const [all] = oneLine(draft)
    return all ? notate(untimed(lineMusic(draft, all))) : undefined
  }, [draft])
  // The staves a line writes: the shown sung ones over the piano's two.
  const staves = whole?.staves.length ?? 2
  // A whole system in the height the sheet is seen in, where it is short (a phone on its side).
  const fit = room && room > 0 ? lineFit({ room, staves, headed: !across, chordNames }) : 1
  const sized = view === 'pages' ? pageScale : Math.min(fit, scrollScale(width))
  const widths = useMemo(() => (whole ? measureWidths(whole, sized) : []), [whole, sized])
  const lead = whole ? lineLead(whole) : 0
  // The room a line's bars have, in the engraving's units: the sheet's or the page's, less the clef and key.
  const roomAcross =
    width <= 0 ? Infinity : (view === 'pages' ? paper - 2 * margin : width) / sized - lead
  const sheets = useMemo(
    () => sheetsOf(draft, across ? { across: true } : { room: roomAcross, widths }),
    [sheetsOf, draft, across, roomAcross, widths],
  )
  const caretBar = barAt(draft, caret).index
  // Each line spread to the sheet's width unless that stretches it too far (`lineShare`, ADR 0074).
  const widthOf = (sheet: LineSheet) =>
    sheet.line.bars.reduce((sum, placed) => sum + (widths[placed.index] ?? 0), 0)
  const shareOf = (sheet: LineSheet) => lineShare(widthOf(sheet), roomAcross)

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
      share={shareOf(sheet)}
      onWrite={onWrite}
      onDrag={onDrag}
      {...(scale === undefined ? {} : { scale })}
    />
  )

  if (view === 'pages') {
    const scale = pageScale
    const lineHeight =
      labelRow(chordNames, scale) + (staffHeight(undefined, staves) + LINE_GAP) * scale
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
      (paper * PAGE.height) / PAGE.width - 2 * margin,
      (item) => item.kind !== 'line',
    )
    return (
      <section ref={box} aria-label={t('sheet.label')} className="flex flex-col items-center gap-6">
        {pages.map((page, index) => (
          <article
            key={index}
            aria-label={t('sheet.page', { n: index + 1, of: pages.length })}
            data-slot="sheet-page"
            className="relative flex flex-col bg-card text-card-foreground shadow-lg shadow-foreground/10 ring-1 ring-hairline"
            style={{
              width: paper,
              minHeight: (paper * PAGE.height) / PAGE.width,
              padding: margin,
              gap: LINE_GAP * scale,
            }}
          >
            {page.map((item) =>
              item.kind === 'title' ? (
                <h2
                  key="title"
                  className="text-center font-display"
                  style={{ fontSize: `${1.5 * scale}rem` }}
                >
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
            .map((sheet) => line(sheet, sized))}
        </section>
      ))}
    </section>
  )
}
