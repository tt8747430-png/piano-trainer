import { useCallback, useMemo, useRef, useState, type ReactNode, type Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { useSectionHeading, useStaffNames, useStaffTitle } from '@/entities/piece'
import { barAt, type Draft, type Layer } from '@/features/score-editor'
import { PAGE, paginate, PRINT_SCALE, useElementSize, type SheetView } from '@/shared/lib'
import { PageCanvas, SheetPage, type TitlePlace } from '@/shared/ui'
import { lineLead, measureWidths, notate, type StaffId } from '@/shared/lib/notation'
import type { Midi, Tick } from '@/shared/lib/music'
import { labelRow, scoreHeight, useStaffLabels, versesOf } from '@/shared/ui/score'
import type { SheetField } from '../model/field-place'
import { lineFit } from '../model/line-fit'
import { createLineSheets, untimed, type LineSheet } from '../model/line-sheets'
import { lineMusic, oneLine } from '../model/line-music'
import type { EditPrinted } from '../model/printed'
import { LayerNames, useLayerName } from '../model/use-layer-name'
import { SheetLine } from './SheetLine'

/** No staff hidden. */
const NO_STAVES: readonly StaffId[] = []
/** The room between lines on a page at full size, for dealing lines onto pages. */
const LINE_GAP = 16
/** The room between the title and the line across, as `gap-2` keeps it. */
const ACROSS_GAP = 8
/** A line across measured this much taller or shorter than before is fitted again; less is not. */
const HEIGHT_CHANGE = 0.02
/** The title's room over the first page's first line, for dealing lines onto pages. */
const TITLE_ROOM = 52
/**
 * The staff's size down the screen (ADR 0074), as LilyPond sets a staff size per paper: full from a
 * sheet this wide, smaller on a phone, so a line holds more than a bar, never under `least`.
 */
const SCROLL_SCALE = { full: 600, least: 0.72 } as const

/** The staff's size on a sheet this wide, down the screen. */
const scrollScale = (width: number) =>
  width > 0 ? Math.min(1, Math.max(SCROLL_SCALE.least, width / SCROLL_SCALE.full)) : 1

type PageItem = { readonly kind: 'title' } | { readonly kind: 'line'; readonly sheet: LineSheet }

const itemKey = (item: PageItem) =>
  item.kind === 'title'
    ? 'title'
    : `${item.sheet.line.section} ${item.sheet.line.line} ${item.sheet.line.start}`

/**
 * Each section's name in the learner's language, by section: printed at its first bar (ADR 0095).
 * The same array while the names are, so a line's row is not drawn again for every edit.
 */
function useHeadings(draft: Draft): readonly string[] {
  const named = useSectionHeading()
  const said = draft.sections.map((section) => named({ ...section.heading, lines: [] })).join('\n')
  return useMemo(() => said.split('\n'), [said])
}

/**
 * A page's items as the blocks that stay together as it is spread (ADR 0087): the title with the
 * line under it.
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
 * the piece down the screen, each chart line a system of its staves; the same on A4 pages as it will
 * print, its title on the first; or all of it as one line across. Over each line its labels' row, as
 * the Player's: its first bar's number, a section's name at its first bar (ADR 0095), the tempo and
 * the chord symbols; the caret on its layer's staff; while Play plays, the playhead apart from it
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
  chordNames,
  lyrics = true,
  fingers = false,
  edit,
  hidden = NO_STAVES,
  view = 'scroll',
  title: heading,
  room,
  covered,
  onWrite,
  onDrag,
  field = null,
  fieldAnchor,
  onField,
}: {
  /**
   * The field open at the caret, typing what is printed there (ADR 0096): its place is drawn on the
   * caret's line (`fieldAnchor`) for the page's field to stand at.
   */
  field?: SheetField | null
  /** The element marking the open field's place, as it comes and goes. */
  fieldAnchor?: Ref<HTMLDivElement> | undefined
  /** A tap on what a field types where it is printed (the chord row): its tick on the piece and row. */
  onField?: ((field: SheetField, tick: Tick, layer: Layer) => void) | undefined
  /** The height the sheet is seen in, where it is short: a line down the screen or across is drawn smaller to fit it whole. */
  room?: number | undefined
  /**
   * What floats over the sheet's right edge and foot (the palette beside it, the dock), in CSS px:
   * the pages are fitted in the room it leaves, and the caret's line comes into sight clear of it.
   */
  covered?: { readonly right?: number; readonly bottom?: number } | undefined
  /** A note written where a staff was double-clicked: its tick on the piece, its row and key. */
  onWrite?: (tick: Tick, layer: Layer, key: Midi) => void
  /** The notes at the caret dragged on their staff by steps of the key. */
  onDrag?: (steps: number, joins: boolean) => void
  draft: Draft
  /** Where the next note goes; none on a sheet only shown (the editor's Transpose preview, ADR 0110). */
  caret: Tick | null
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
  /** Chord names over the staff, written in their row; without them a click there writes the staff under it. */
  chordNames: boolean
  /** The words under the tune, where the song has them (ADR 0093). */
  lyrics?: boolean
  /** The fingers written on the notes, printed (the View's Finger numbers): typed there (ADR 0096). */
  fingers?: boolean
  /**
   * What edits a thing printed, opened from its button where it is printed (ADR 0094): the tempo
   * mark, a section's name (ADR 0095), a clef, a key or time signature, a staff's name.
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
  // The staves a line draws: the score's, less those the View hides (ADR 0094, 0097), never every
  // one; the verses under the staff that sings them.
  const written = whole?.staves.join(' ') ?? ''
  const hiddenKey = hidden.join(' ')
  const drawn = useMemo(() => {
    const staves = written ? (written.split(' ') as StaffId[]) : []
    const kept = staves.filter((staff) => !hiddenKey.split(' ').includes(staff))
    return kept.length > 0 ? kept : staves
  }, [written, hiddenKey])
  const staves = drawn.length > 0 ? drawn.length : 2
  const verses = whole ? versesOf(whole, drawn) : 0
  // The staves' names at the first line's head (ADR 0094, 0097): each single staff's own, else its
  // place's printed soft, so a staff with no name has one to click (as Flat prints "Title").
  const own = useStaffNames(draft.staves)
  const title = useStaffTitle()
  const labels = useStaffLabels(
    drawn,
    own.map((name, place) =>
      name === undefined ? { text: title(undefined, place), placeholder: true } : { text: name },
    ),
  )
  const layerName = useLayerName(draft.staves)
  const headings = useHeadings(draft)
  // The line across as engraved, its height at its own size: the whole piece's notes reach over and
  // under its staves, more than a staff's least, and the title stands over it.
  const [acrossHeight, setAcrossHeight] = useState<number>()
  const onAcross = useCallback(
    (height: number) =>
      setAcrossHeight((was) =>
        was !== undefined && Math.abs(height - was) <= was * HEIGHT_CHANGE ? was : height,
      ),
    [],
  )
  const titleBox = useRef<HTMLDivElement>(null)
  const { height: titleHeight } = useElementSize(titleBox)
  // A whole system in the height the sheet is seen in, where it is short (a phone on its side); a
  // line across under its title, as engraved, never under the keys.
  const fit =
    room && room > 0
      ? across
        ? lineFit({
            room: room - titleHeight - ACROSS_GAP,
            staves,
            chordNames,
            verses,
            natural: acrossHeight,
          })
        : lineFit({ room, staves, chordNames, verses })
      : 1
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
  const caretBar = caret === null ? null : barAt(draft, caret).index
  const playBar = playhead ? barAt(draft, playhead.tick).index : null

  const line = (
    sheet: LineSheet,
    scale?: number,
    print = false,
    onEngraved?: (height: number) => void,
  ) => {
    const holdsCaret = caret !== null && sheet.line.bars.some((placed) => placed.index === caretBar)
    return (
      <SheetLine
        key={`${sheet.line.section} ${sheet.line.line} ${sheet.line.start}`}
        sheet={sheet}
        layer={layer}
        caret={holdsCaret ? caret - sheet.line.start : null}
        field={holdsCaret ? field : null}
        fieldAnchor={fieldAnchor}
        onField={onField}
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
        fingers={fingers}
        headings={headings}
        edit={edit}
        labels={sheet.line.bars[0]?.index === 0 ? labels : undefined}
        staves={drawn}
        justify={!across}
        onWrite={onWrite}
        onDrag={onDrag}
        {...(scale === undefined ? {} : { scale })}
        print={print}
        onEngraved={onEngraved}
      />
    )
  }

  if (pages) {
    const scale = PRINT_SCALE
    // A line's height as engraved: its staves and the verses under its tune (ADR 0093).
    const lineHeight = (sheet: LineSheet) =>
      labelRow(chordNames, scale, true) + (scoreHeight(sheet.score, drawn) + LINE_GAP) * scale
    const items: PageItem[] = [
      { kind: 'title' },
      ...sheets.map((sheet) => ({ kind: 'line', sheet }) as const),
    ]
    const dealt = paginate(
      items,
      (item) => (item.kind === 'line' ? lineHeight(item.sheet) : TITLE_ROOM),
      PAGE.height - 2 * PAGE.margin,
      (item) => item.kind !== 'line',
    )
    return (
      <LayerNames value={layerName}>
        <PageCanvas column={PAGE.width} covered={covered}>
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
                          <div key="title">{heading('page')}</div>
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
      </LayerNames>
    )
  }

  if (across) {
    return (
      <LayerNames value={layerName}>
        <section ref={box} aria-label={t('sheet.label')} className="flex flex-col gap-2">
          <div ref={titleBox}>{heading('across')}</div>
          {sheets.map((sheet) => line(sheet, fit, false, onAcross))}
        </section>
      </LayerNames>
    )
  }

  // The lines down the screen as the Player's are, each section named in its first line's labels.
  return (
    <LayerNames value={layerName}>
      <section
        ref={box}
        aria-label={t('sheet.label')}
        className="flex flex-col"
        style={{ gap: LINE_GAP }}
      >
        {heading('lines')}
        {sheets.map((sheet) => line(sheet, sized))}
      </section>
    </LayerNames>
  )
}
