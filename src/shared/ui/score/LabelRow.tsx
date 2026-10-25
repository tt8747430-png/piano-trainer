import { Fragment, type ReactNode } from 'react'
import { chordLabels } from '@/shared/lib'
import { printedSymbol, tempoNote, type Meter, type Tick } from '@/shared/lib/music'
import type { BarLabel } from './bar-labels'
import { LABEL_INSET_PX } from './label-row'
import { xAtTick, type ScoreLayout } from './layout'

/** A chord name's size at full size where it has the room: smaller where many share a bar. */
const CHORD_PX = 16

/** A chord symbol over the staff: where it starts, and what follows it smaller (how a hand plays it). */
export interface RowChord {
  readonly startTick: Tick
  readonly symbol: string
  readonly detail?: string
}

/** What a sheet that edits its labels prints as its own: a section's name, a tempo. */
export type PrintedPart =
  | { readonly kind: 'section'; readonly section: number; readonly name: string }
  | { readonly kind: 'tempo'; readonly tempo: number }

/** How a sheet that edits what is printed prints a part of a label: its own button round it. */
export type PrintLabel = (part: PrintedPart, content: ReactNode) => ReactNode

/**
 * A part a sheet only prints, as the Player prints its row: kept from a screen reader, which reads the
 * bars' buttons.
 */
const plain: PrintLabel = (_part, content) => <span aria-hidden>{content}</span>

/** What a bar's label says, in the order it is printed, each part as the sheet prints it. */
function partsOf(
  label: BarLabel,
  { headings, meter, print }: { headings: readonly string[]; meter: Meter; print: PrintLabel },
): { readonly key: string; readonly node: ReactNode }[] {
  const { number, section, tempo } = label
  const name = section === undefined ? '' : (headings[section] ?? '')
  return [
    ...(number === undefined ? [] : [{ key: 'number', node: <span aria-hidden>{number}</span> }]),
    ...(section === undefined
      ? []
      : [{ key: 'section', node: print({ kind: 'section', section, name }, name) }]),
    ...(tempo === undefined
      ? []
      : [
          {
            key: 'tempo',
            node: print(
              { kind: 'tempo', tempo },
              <>
                <span className="font-music">{tempoNote(meter)}</span>= {tempo}
              </>,
            ),
          },
        ]),
  ]
}

/**
 * The labels' row over a line's staff, the Player's and the editor's alike (ADR 0087, 0095): at a
 * bar's start what its label says (`BarLabel`: the line's first bar's number, a section's name at its
 * first bar, a tempo where it is marked, `·` between), running on to the next bar's label or the
 * line's end and cut short there; at each chord's onset its symbol, smaller where many share a bar.
 * The row is as tall as it is given (`row`), its labels drawn at the line's size (`size`). A sheet
 * that edits what is printed prints a section's name and a tempo its own way (`printed`, the editor's
 * buttons); the rest is a bar's, which its button says, so a screen reader is not told it twice.
 */
export function LabelRow({
  layout,
  labels,
  headings,
  chords,
  meter,
  row,
  size = 1,
  printed = plain,
}: {
  layout: ScoreLayout
  /** Each of the layout's measures' label, in order. */
  labels: readonly BarLabel[]
  /** Each section's name, by section. */
  headings: readonly string[]
  /** On the layout's ticks; those outside its measures are left out. */
  chords: readonly RowChord[]
  /** The meter a tempo counts. */
  meter: Meter
  row: number
  size?: number
  printed?: PrintLabel
}) {
  const [first] = layout.measures
  const last = layout.measures.at(-1)
  const end = last ? last.x + last.width : layout.width
  const shown = chords.flatMap((chord) =>
    first &&
    last &&
    chord.startTick >= first.startTick &&
    chord.startTick < last.startTick + last.ticks
      ? [{ ...chord, symbol: printedSymbol(chord.symbol), x: xAtTick(layout, chord.startTick) }]
      : [],
  )
  const placed = chordLabels(
    shown.map(({ x, symbol, detail }) => ({ x, symbol: detail ? `${symbol} ${detail}` : symbol })),
    end,
    CHORD_PX * size,
  )
  const said = layout.measures.map((measure, index) => {
    const label = labels[index]
    const parts = label ? partsOf(label, { headings, meter, print: printed }) : []
    return { measure, parts }
  })
  return (
    <div data-slot="line-labels" className="absolute inset-x-0 bottom-full" style={{ height: row }}>
      {said.map(({ measure, parts }, index) => {
        if (parts.length === 0) return null
        // On to the next label's bar: where a bar says nothing, a long name is read whole.
        const next = said.find((other, at) => at > index && other.parts.length > 0)
        const until = next?.measure.x ?? end
        return (
          <span
            key={index}
            data-slot="bar-label"
            className="absolute top-0 truncate text-xs text-muted-foreground tabular-nums"
            style={{
              left: measure.x + LABEL_INSET_PX,
              maxWidth: Math.max(0, until - measure.x - 2 * LABEL_INSET_PX),
              fontSize: `${0.75 * size}rem`,
            }}
          >
            {parts.map(({ key, node }, at) => (
              <Fragment key={key}>
                {at > 0 ? <span aria-hidden> · </span> : null}
                {node}
              </Fragment>
            ))}
          </span>
        )
      })}
      {shown.map(({ symbol, detail, x }, at) => (
        <span
          key={at}
          aria-hidden
          className="absolute bottom-0.5 font-display leading-none font-semibold whitespace-nowrap"
          style={{ left: placed[at]?.x ?? x, fontSize: placed[at]?.size }}
        >
          {symbol}
          {detail ? (
            <span className="ml-1 font-sans text-[0.7em] font-normal text-muted-foreground">
              {detail}
            </span>
          ) : null}
        </span>
      ))}
    </div>
  )
}
