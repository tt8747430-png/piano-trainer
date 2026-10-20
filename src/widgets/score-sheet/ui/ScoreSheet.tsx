import { useMemo, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { barAt, type BarRange, type Draft, type Layer } from '@/features/score-editor'
import { useElementSize, type SheetView } from '@/shared/lib'
import type { Tick } from '@/shared/lib/music'
import { staffHeight } from '@/shared/ui/score'
import { createLineSheets, type LineSheet } from '../model/line-sheets'
import { PAGE, paginate } from '../model/sheet-view'
import { CHORD_ROW } from './chord-row'
import { SheetLine } from './SheetLine'

/** A heading's height and the room between lines, for dealing lines onto pages. */
const HEADING = 52
const LINE_GAP = 8

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
}: {
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
  const sheets = useMemo(() => sheetsOf(draft, across), [sheetsOf, draft, across])
  const caretBar = barAt(draft, caret).index
  const box = useRef<HTMLElement>(null)
  const { width } = useElementSize(box)

  const line = (sheet: LineSheet, scale?: number) => (
    <SheetLine
      key={`${sheet.line.section} ${sheet.line.line}`}
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
      {...(scale === undefined ? {} : { scale })}
    />
  )

  if (view === 'pages') {
    const paper = Math.min(width, PAGE.width)
    const scale = paper > 0 ? paper / PAGE.width : 1
    const margin = PAGE.margin * scale
    const count = draft.melodyStaff ? 3 : 2
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
        {sheets.map((sheet) => line(sheet))}
      </section>
    )
  }

  return (
    <section ref={box} aria-label={t('sheet.label')} className="flex flex-col gap-8">
      {draft.sections.map((_, section) => (
        <section key={section} className="flex flex-col gap-2">
          {heading(section)}
          {sheets.filter((sheet) => sheet.line.section === section).map((sheet) => line(sheet))}
        </section>
      ))}
    </section>
  )
}
