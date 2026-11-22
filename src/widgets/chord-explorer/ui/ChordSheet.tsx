import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { printedSymbol, type ChordFingers, type PlacedChord } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { chordBars } from '@/shared/lib/schedule'
import { useMediaQuery } from '@/shared/lib/use-media-query'
import { LazyScoreView } from '@/shared/ui'
import { LAPTOP } from '@/shared/lib'

/**
 * The canvas's staff (`r42_chords.py`, `sv`), in its units: the lines 14 in from each side, the
 * clef's room from the lines' start, each chord's bar, the empty place after the last (the + 28
 * into it), and the room left at the staff's end. A unit is the canvas's scale, 1.5 on a phone and
 * 1.75 on a laptop, a staff space 10 units.
 */
const INSET = 14
const CLEF = 54
const SLOT = 86
const ADD_AT = 28
/** A chord's name is a button over its whole bar, 3 units in from each end (the canvas's `cname`). */
const NAME_INSET = 3
const ADD_ROOM = 56
const END_ROOM = 20
/** Verovio's page runs 6 units further under the staff than the canvas's picture. */
const VEROVIO_FOOT = 6
/** ...and 12 units further over it: the canvas's picture starts 18 units over the top line. */
const VEROVIO_HEAD = 12
/** The chords' names stand in a row 40 pixels tall over the canvas's picture, at every size. */
const NAMES_ROW = 40

/** The empty bar drawn after the last chord: where it starts, each staff's lines, their paint. */
interface EmptyBar {
  readonly left: number
  readonly staves: readonly (readonly number[])[]
  readonly paint: string
  readonly thickness: number
}

/** A chord on the staff: its keys, its fingers and its symbol. */
export interface SheetChord {
  readonly placed: PlacedChord
  readonly fingers: ChordFingers
  readonly symbol: string
}

/** A head's finger, set right of the chord. */
interface HeadMark {
  readonly key: string
  readonly text: string
  readonly left: number
  readonly top: number
  readonly size: number
}

/** Where a bar stands across the staff, in the staff's pixels: its edges and its chord's middle. */
interface BarPlace {
  readonly left: number
  readonly right: number
  readonly middle: number
}

/**
 * The chords written as the keys place them, as the canvas's staff card writes them: a bar each, the
 * staff across the card at the canvas's size (scrolling sideways when the chords need more room),
 * each chord's name over its bar (the chosen one in sky), the chosen chord's heads ringed, every
 * head solid in its tone's paint and each finger right of its note, as a chord chart prints them
 * (Vita Piano); with one chord, each note's name left of it. A tap on a bar chooses it.
 */
export function ChordSheet({
  chords,
  at,
  onPick,
  onName,
  onAdd,
}: {
  chords: readonly SheetChord[]
  at: number
  /** A bar tapped: its chord chosen (and played). */
  onPick: (at: number) => void
  /** A chord's name tapped: the chord to change. */
  onName: (at: number) => void
  /** The empty bar's +, where the staff takes another chord. */
  onAdd: (() => void) | undefined
}) {
  const { t } = useTranslation(['music', 'practice'])
  const score = useMemo(
    () => notate(chordBars(chords.map(({ placed, fingers }) => ({ placed, fingers })))),
    [chords],
  )
  const several = chords.length > 1
  const unit = useMediaQuery(LAPTOP) ? 1.75 : 1.5
  const section = useRef<HTMLElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const [room, setRoom] = useState(0)
  const [marks, setMarks] = useState<readonly HeadMark[]>([])
  const [bars, setBars] = useState<readonly BarPlace[]>([])
  const [empty, setEmpty] = useState<EmptyBar | null>(null)
  const engraved = (CLEF + chords.length * SLOT) * unit
  const width = Math.max(room, engraved + (onAdd ? ADD_ROOM : END_ROOM) * unit)
  useLayoutEffect(() => {
    const box = section.current
    const staff = scroller.current
    if (!box || !staff) return
    const place = () => {
      setRoom(box.clientWidth - 2 * INSET * unit)
      const measures = [...staff.querySelectorAll<SVGGElement>('g.measure')]
      measures.forEach((measure, i) => measure.toggleAttribute('data-chosen', i === at))
      measures.forEach((measure) => centred(measure, CLEF * unit))
      setEmpty(emptyBar(staff, measures[measures.length - 1]))
      setBars(measures.map((measure) => barPlace(staff, measure)))
      setMarks(
        measures.flatMap((measure, i) => {
          const chord = chords[i]
          if (!chord) return []
          const hands = [chord.fingers.rh, chord.fingers.lh].filter(
            (_, side) => (side === 0 ? chord.placed.rh : chord.placed.lh).length,
          )
          return headMarks(staff, measure, `${i}`, hands)
        }),
      )
    }
    const watch = new MutationObserver(place)
    watch.observe(staff, { childList: true, subtree: true })
    const resize = new ResizeObserver(place)
    resize.observe(box)
    place()
    return () => {
      watch.disconnect()
      resize.disconnect()
    }
  }, [chords, at, unit])
  // The chosen bar kept in view as chords are added or chosen.
  const chosen = bars[at]
  useLayoutEffect(() => {
    const staff = scroller.current
    if (!staff || !chosen || !several) return
    const left = chosen.middle - staff.clientWidth / 2
    staff.scrollTo({ left, behavior: 'smooth' })
  }, [at, chosen, several])
  return (
    <section
      ref={section}
      aria-label={t('sheet.label')}
      data-chord-sheet
      className="relative w-full min-w-40 py-1"
    >
      <div ref={scroller} className="relative overflow-x-auto overscroll-x-contain">
        <div
          className="relative"
          style={{
            width: width + 2 * INSET * unit,
            paddingInline: INSET * unit,
            paddingTop: NAMES_ROW - VEROVIO_HEAD * unit,
          }}
        >
          {/* The engraving's own room under the staff, past the canvas's, given back. */}
          {room > 0 ? (
            <div style={{ marginBottom: -VEROVIO_FOOT * unit }}>
              <LazyScoreView score={score} scale={unit} fill={engraved} />
            </div>
          ) : null}
          {empty ? (
            <div
              className="absolute inset-y-0"
              style={{ left: empty.left, width: width + INSET * unit - empty.left }}
            >
              {empty.staves.map((lines, s) => (
                <span key={s}>
                  {lines.map((y, l) => (
                    <span
                      key={l}
                      className="absolute inset-x-0"
                      style={{
                        top: y - empty.thickness / 2,
                        height: empty.thickness,
                        background: empty.paint,
                      }}
                    />
                  ))}
                  <span
                    className="absolute right-0"
                    style={{
                      top: (lines[0] ?? 0) - empty.thickness / 2,
                      height: (lines[lines.length - 1] ?? 0) - (lines[0] ?? 0) + empty.thickness,
                      width: empty.thickness,
                      background: empty.paint,
                    }}
                  />
                </span>
              ))}
              {onAdd ? (
                <button
                  type="button"
                  aria-label={t('practice:chords.next.add')}
                  title={t('practice:chords.next.add')}
                  onClick={onAdd}
                  className="absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-honey-ink outline-none focus-visible:rounded-pill"
                  style={{
                    left: ADD_AT * unit,
                    top: middleOf(empty.staves),
                  }}
                >
                  <span className="flex size-9 items-center justify-center rounded-pill border-[1.5px] border-dashed border-honey-ink/55 bg-card">
                    <Plus aria-hidden className="size-4.5" />
                  </span>
                </button>
              ) : null}
            </div>
          ) : null}
          {bars.map((bar, i) => {
            const chord = chords[i]
            if (!chord) return null
            const name = printedSymbol(chord.symbol)
            return (
              <div
                key={i}
                className="absolute inset-y-0"
                style={{ left: bar.left, width: bar.right - bar.left }}
              >
                <button
                  type="button"
                  aria-label={t('practice:chords.next.change', { chord: name })}
                  title={t('practice:chords.next.change', { chord: name })}
                  onClick={() => onName(i)}
                  className={`absolute top-0 flex h-11 items-center justify-center rounded-thumb font-display text-lg whitespace-nowrap outline-none ${
                    i === at || !several
                      ? 'font-bold text-link'
                      : 'font-semibold text-muted-foreground'
                  }`}
                  style={{ insetInline: NAME_INSET * unit }}
                >
                  {name}
                </button>
                {several ? (
                  <button
                    type="button"
                    aria-pressed={i === at}
                    aria-label={t(i === at ? 'sheet.play' : 'sheet.pick', { chord: name })}
                    onClick={() => onPick(i)}
                    className="absolute inset-x-0 top-11 bottom-0 rounded-thumb outline-none"
                  />
                ) : null}
              </div>
            )
          })}
          {marks.map((mark) => (
            <span
              key={mark.key}
              aria-hidden
              className="pointer-events-none absolute -translate-y-1/2 font-sans leading-none font-bold text-foreground italic"
              style={{ left: mark.left, top: mark.top, fontSize: mark.size }}
            >
              {mark.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * A chord moved to its bar's middle, as the canvas writes it (Verovio sets a bar's one chord at its
 * start): its layer and its ledger lines shifted together, to the middle of its slot, from the
 * clef's room (the first bar's, `clef` pixels from the lines' start) or the bar's start to its
 * barline.
 */
function centred(measure: SVGGElement, clef: number): void {
  const moved = [...measure.querySelectorAll<SVGGElement>('g.layer, g.ledgerLines')]
  moved.forEach((part) => (part.style.transform = ''))
  const line = measure.querySelector<SVGPathElement>('g.staff > path')
  const heads = [...measure.querySelectorAll('g.note .notehead, g.note g.accid')].map((part) =>
    part.getBoundingClientRect(),
  )
  if (!line || heads.length === 0) return
  const span = line.getBoundingClientRect()
  const signs = [...measure.querySelectorAll('g.clef, g.keySig, g.meterSig')].map(
    (part) => part.getBoundingClientRect().right,
  )
  const start = signs.length ? Math.max(span.left + clef, ...signs) : span.left
  const middle =
    (Math.min(...heads.map((h) => h.left)) + Math.max(...heads.map((h) => h.right))) / 2
  const units = line.getBBox().width / Math.max(1, span.width)
  const shift = ((start + span.right) / 2 - middle) * units
  moved.forEach((part) => (part.style.transform = `translateX(${shift}px)`))
}

/** The empty bar after the last one: its staves' lines carried on, in the staff's pixels. */
function emptyBar(staff: HTMLElement, last: SVGGElement | undefined): EmptyBar | null {
  if (!last) return null
  const box = staff.getBoundingClientRect()
  const staves = [...last.querySelectorAll<SVGGElement>('g.staff')].map((each) =>
    [...each.querySelectorAll<SVGPathElement>(':scope > path')].map((line) => {
      const at = line.getBoundingClientRect()
      return at.top + at.height / 2 - box.top
    }),
  )
  const line = last.querySelector<SVGPathElement>('g.staff > path')
  if (!line) return null
  const span = line.getBoundingClientRect()
  const style = getComputedStyle(line)
  const thickness = (parseFloat(style.strokeWidth) * span.width) / Math.max(1, line.getBBox().width)
  return {
    left: span.right - box.left + staff.scrollLeft,
    staves,
    paint: style.stroke,
    thickness: Math.max(1, thickness),
  }
}

/** The middle of the staves' lines, top to bottom: where the + stands. */
function middleOf(staves: readonly (readonly number[])[]): number {
  const all = staves.flat()
  return all.length ? (Math.min(...all) + Math.max(...all)) / 2 : 0
}

/** A bar's edges (its staff lines') and the middle of its chord's heads, in the staff's pixels. */
function barPlace(staff: HTMLElement, measure: SVGGElement): BarPlace {
  const origin = staff.getBoundingClientRect().left - staff.scrollLeft
  const lines =
    measure.querySelector('g.staff')?.getBoundingClientRect() ?? measure.getBoundingClientRect()
  const heads = [...measure.querySelectorAll('g.note .notehead')].map((head) =>
    head.getBoundingClientRect(),
  )
  const middle =
    heads.length > 0
      ? (Math.min(...heads.map((head) => head.left)) +
          Math.max(...heads.map((head) => head.right))) /
        2
      : (lines.left + lines.right) / 2
  return { left: lines.left - origin, right: lines.right - origin, middle: middle - origin }
}

/**
 * Each head's finger in one bar, staff by staff top down (the right hand's, then the left's), the
 * heads read from the bottom as the hand's notes are placed: a space past its rightmost head at 1.1,
 * each a space at least over the one below, as the canvas's 11 on its 10. The staff carries no note
 * names: the keys above already say them (loop round 58, "the Chords staff says each thing once").
 */
function headMarks(
  staff: HTMLElement,
  measure: SVGGElement,
  bar: string,
  fingers: readonly (readonly (number | undefined)[])[],
): HeadMark[] {
  const box = staff.getBoundingClientRect()
  const origin = { left: box.left - staff.scrollLeft, top: box.top }
  return [...measure.querySelectorAll<SVGGElement>('g.staff')].flatMap((lines, s) => {
    const heads = [...lines.querySelectorAll<SVGGElement>('g.note .notehead')]
      .map((head) => head.getBoundingClientRect())
      .sort((a, b) => b.top - a.top)
    const [first] = heads
    if (!first) return []
    const space = first.height
    const fingerAt = Math.max(...heads.map((h) => h.right)) - origin.left + space
    let fingerAbove = Infinity
    return heads.flatMap((head, i) => {
      const level = head.top + head.height / 2 - origin.top
      const out: HeadMark[] = []
      const finger = fingers[s]?.[i]
      if (finger !== undefined) {
        const fingerTop = Math.min(level, fingerAbove - space)
        fingerAbove = fingerTop
        out.push({
          key: `f${bar}-${s}-${i}`,
          text: String(finger),
          left: fingerAt,
          top: fingerTop,
          size: space * 1.1,
        })
      }
      return out
    })
  })
}
