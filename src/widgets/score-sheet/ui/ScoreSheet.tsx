import { useMemo, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { barAt, type Draft, type Layer } from '@/features/score-editor'
import { PAGE, paginate, PRINT_SCALE, useElementSize, type SheetView } from '@/shared/lib'
import { PageCanvas, SheetPage, type TitlePlace } from '@/shared/ui'
import { lineLead, measureWidths, notate, type StaffId } from '@/shared/lib/notation'
import type { Midi, Tick } from '@/shared/lib/music'
import { scoreHeight, useStaffLabels, versesOf } from '@/shared/ui/score'
import { HEADING, lineFit } from '../model/line-fit'
import { createLineSheets, untimed, type LineSheet } from '../model/line-sheets'
import { labelRow } from '../model/label-row'
import { lineMusic, oneLine } from '../model/line-music'
import type { EditPrinted } from '../model/printed'
import { SheetLine } from './SheetLine'

/** No staff hidden. */
const NO_STAVES: readonly StaffId[] = []
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

const itemKey = (item: PageItem) =>
  item.kind === 'title'
    ? 'title'
    : item.kind === 'heading'
      ? `heading ${item.section}`
      : `${item.sheet.line.section} ${item.sheet.line.line} ${item.sheet.line.start}`

/**
 * A page's items as the blocks that stay together as it is spread (ADR 0087): the title and a
 * section's heading with the line under them.
 */
function blocksOf(page: readonly PageItem[]): PageItem[][] {
  const blocks: PageItem[][] = []
  let open: PageItem[] = []
  for (const item of page) {
    open.push(item)
    if (item.kind === 'line') {
      blocks.push(open)
      open = []
    }
  }
  if (open.length > 0) blocks.push(open)
  return blocks
}

/**
 * The editor's sheet (spec §6.1, ADR 0064), as `view` lays it out: its title at its head (ADR 0094);
 * the piece by section down the screen, each chart line a system of its staves; the same on A4 pages
 * as it will print, its title on the first; or all of it as one line across. Each bar numbered, its
 * chord symbols over it, the caret on its layer's staff; while Play plays, the playhead apart from it
 * (ADR 0096). A line is drawn again only when what it shows changes.
 */
export function ScoreSheet({
  draft,
  caret,
  playhead = null,
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
  lyrics = true,
  edit,
  hidden = NO_STAVES,
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
  /**
   * Where Play is while it plays, on the piece's ticks: the playhead stands there and follows the
   * clock, the sheet following it, the caret and what is chosen left where they are (ADR 0096).
   */
  playhead?: { readonly tick: Tick; readonly clock: () => Tick | null } | null
  /** One note of the chord at the caret chosen alone (ADR 0088). */
  chordNote?: Midi | null
  layer: Layer
  /** The notes chosen: their span on the piece (ADR 0088). */
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
  /** The words under the tune, where the song has them (ADR 0093). */
  lyrics?: boolean
  /**
   * What edits a thing printed, opened from its button where it is printed (ADR 0094): the tempo
   * mark, a clef, a key or time signature.
   */
  edit: EditPrinted
  /**
   * The staves the View hides (ADR 0094): one of the piano's alone is left out of the drawing, its
   * notes kept; never every staff.
   */
  hidden?: readonly StaffId[]
  view?: SheetView
  /**
   * The piece's title as the page prints it, its heading (ADR 0094), where it is printed: at the head
   * of the first page, of the lines down the screen, or of the line across.
   */
  title: (place: TitlePlace) => ReactNode
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
    return all ? notate(untimed(lineMusic(draft, all, lyrics))) : undefined
  }, [draft, lyrics])
  // The staves a line draws: the tune's where shown over the piano's two, less one of the piano's
  // the View hides alone (ADR 0094); the verses under the tune.
  const written = whole?.staves.join(' ') ?? ''
  const hiddenKey = hidden.join(' ')
  const drawn = useMemo(() => {
    const staves = written ? (written.split(' ') as StaffId[]) : []
    const kept = staves.filter((staff) => !hiddenKey.split(' ').includes(staff))
    return kept.length > 0 ? kept : staves
  }, [written, hiddenKey])
  const staves = drawn.length > 0 ? drawn.length : 2
  const verses = whole ? versesOf(whole, drawn) : 0
  // The staves' names at the first line's head (ADR 0094).
  const labels = useStaffLabels(drawn)
  // A whole system in the height the sheet is seen in, where it is short (a phone on its side).
  const fit = room && room > 0 ? lineFit({ room, staves, headed: !across, chordNames, verses }) : 1
  const sized = pages ? PRINT_SCALE : Math.min(fit, scrollScale(width))
  const widths = useMemo(
    () => (whole ? measureWidths({ ...whole, staves: drawn }, sized, chordNames, labels) : []),
    [whole, drawn, sized, chordNames, labels],
  )
  const lead = whole ? lineLead(whole) : 0
  // The room a line's bars have, in the engraving's units: the sheet's or the page's, less the clef and key.
  const roomAcross = pages
    ? (PAGE.width - 2 * PAGE.margin) / sized - lead
    : width <= 0
      ? Infinity
      : width / sized - lead
  const sheets = useMemo(
    () => sheetsOf(draft, across ? { across: true } : { room: roomAcross, widths }, lyrics),
    [sheetsOf, draft, across, roomAcross, widths, lyrics],
  )
  const caretBar = barAt(draft, caret).index
  const playBar = playhead ? barAt(draft, playhead.tick).index : null

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
      playhead={
        playhead && sheet.line.bars.some((placed) => placed.index === playBar) ? playhead : null
      }
      chordNote={chordNote}
      tapsOf={tapsOf}
      selection={selection}
      onPlace={onPlace}
      onReach={onReach}
      onDeselect={onDeselect}
      placesOf={placesOf}
      chordNames={chordNames}
      edit={edit}
      labels={sheet.line.bars[0]?.index === 0 ? labels : undefined}
      staves={drawn}
      justify={!across}
      onWrite={onWrite}
      onDrag={onDrag}
      {...(scale === undefined ? {} : { scale })}
      print={print}
    />
  )

  if (pages) {
    const scale = PRINT_SCALE
    // A line's height as engraved: its staves and the verses under its tune (ADR 0093).
    const lineHeight = (sheet: LineSheet) =>
      labelRow(chordNames, scale, true) + (scoreHeight(sheet.score, drawn) + LINE_GAP) * scale
    const items: PageItem[] = [
      { kind: 'title' },
      ...draft.sections.flatMap((_, section): PageItem[] => [
        { kind: 'heading', section },
        ...sheets
          .filter((sheet) => sheet.line.section === section)
          .map((sheet) => ({ kind: 'line', sheet }) as const),
      ]),
    ]
    const dealt = paginate(
      items,
      (item) => (item.kind === 'line' ? lineHeight(item.sheet) : HEADING),
      PAGE.height - 2 * PAGE.margin,
      (item) => item.kind !== 'line',
    )
    return (
      <PageCanvas column={PAGE.width}>
        <section aria-label={t('sheet.label')} className="flex flex-col items-center gap-8 p-6">
          {dealt.map((page, index) => (
            <SheetPage
              key={index}
              number={index + 1}
              label={t('sheet.page', { n: index + 1, of: dealt.length })}
              // Every page but the last filled to its height (ADR 0087).
              filled={index < dealt.length - 1}
              gap={LINE_GAP * scale}
              blocks={blocksOf(page).map((block) => ({
                key: block.map(itemKey).join(' '),
                content: (
                  <div className="flex flex-col" style={{ gap: LINE_GAP * scale }}>
                    {block.map((item) =>
                      item.kind === 'title' ? (
                        <div key="title">{title('page')}</div>
                      ) : item.kind === 'heading' ? (
                        <div key={itemKey(item)}>{heading(item.section)}</div>
                      ) : (
                        line(item.sheet, scale, true)
                      ),
                    )}
                  </div>
                ),
              }))}
            />
          ))}
        </section>
      </PageCanvas>
    )
  }

  if (across) {
    return (
      <section ref={box} aria-label={t('sheet.label')} className="flex flex-col gap-2">
        {title('across')}
        {sheets.map((sheet) => line(sheet, fit))}
      </section>
    )
  }

  return (
    <section ref={box} aria-label={t('sheet.label')} className="flex flex-col gap-8">
      {title('lines')}
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
