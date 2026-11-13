import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { printedSymbol, type ChordFingers, type Midi, type PlacedChord } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { chordBars } from '@/shared/lib/schedule'
import { LazyScoreView } from '@/shared/ui'

/** The canvas's staff space over the app's at its own size: 15 to 10. */
const SCALE = 1.5
/** The least room a bar takes when several chords share the staff, and the clef's, in pixels. */
const BAR = 132
const CLEF = 64

/** A chord on the staff: its keys, its fingers and its symbol. */
export interface SheetChord {
  readonly placed: PlacedChord
  readonly fingers: ChordFingers
  readonly symbol: string
}

/** A word set beside a head: its name left of the chord, its finger right of it. */
interface HeadMark {
  readonly key: string
  readonly text: string
  readonly left: number
  readonly top: number
  readonly size: number
  readonly end: boolean
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
  labels,
  onPick,
}: {
  chords: readonly SheetChord[]
  at: number
  /** What each of the chosen chord's heads carries left of it, as the Piano sheet's Labels says. */
  labels: ReadonlyMap<Midi, string>
  /** A bar tapped: its chord chosen (and played). */
  onPick: (at: number) => void
}) {
  const { t } = useTranslation('music')
  const score = useMemo(
    () => notate(chordBars(chords.map(({ placed, fingers }) => ({ placed, fingers })))),
    [chords],
  )
  const several = chords.length > 1
  const section = useRef<HTMLElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const [room, setRoom] = useState(0)
  const [marks, setMarks] = useState<readonly HeadMark[]>([])
  const [bars, setBars] = useState<readonly BarPlace[]>([])
  const width = several ? Math.max(room, CLEF + chords.length * BAR) : room
  useLayoutEffect(() => {
    const box = section.current
    const staff = scroller.current
    if (!box || !staff) return
    const place = () => {
      setRoom(box.clientWidth - 40)
      const measures = [...staff.querySelectorAll<SVGGElement>('g.measure')]
      measures.forEach((measure, i) => measure.toggleAttribute('data-chosen', several && i === at))
      setBars(measures.map((measure) => barPlace(staff, measure)))
      setMarks(
        measures.flatMap((measure, i) => {
          const chord = chords[i]
          if (!chord) return []
          const staves = [chord.placed.rh, chord.placed.lh].filter((hand) => hand.length > 0)
          const hands = [chord.fingers.rh, chord.fingers.lh].filter(
            (_, side) => (side === 0 ? chord.placed.rh : chord.placed.lh).length,
          )
          const names = staves.map((hand) =>
            hand.map((tone) => (several ? '' : (labels.get(tone.midi) ?? ''))),
          )
          return headMarks(staff, measure, `${i}`, names, hands)
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
  }, [chords, at, labels, several])
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
      className="relative w-full min-w-40"
    >
      <div ref={scroller} className="relative overflow-x-auto overscroll-x-contain">
        <div className="relative px-5 pt-7" style={{ width: width + 40 }}>
          {width > 0 ? <LazyScoreView score={score} scale={SCALE} fill={width} /> : null}
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
                <span
                  className={`absolute top-0 flex h-11 -translate-x-1/2 items-center font-display text-[1.0625rem] whitespace-nowrap ${
                    i === at || !several
                      ? 'font-bold text-link'
                      : 'font-semibold text-muted-foreground'
                  }`}
                  style={{ left: bar.middle - bar.left }}
                >
                  {name}
                </span>
                {several ? (
                  <button
                    type="button"
                    aria-pressed={i === at}
                    aria-label={t(i === at ? 'sheet.play' : 'sheet.pick', { chord: name })}
                    onClick={() => onPick(i)}
                    className="absolute inset-x-0 top-11 bottom-0 rounded-[10px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                ) : null}
              </div>
            )
          })}
          {marks.map((mark) => (
            <span
              key={mark.key}
              aria-hidden
              className={
                mark.end
                  ? 'pointer-events-none absolute -translate-y-1/2 font-sans leading-none font-bold text-foreground italic'
                  : 'pointer-events-none absolute -translate-x-full -translate-y-1/2 font-sans leading-none font-bold whitespace-nowrap text-foreground'
              }
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
 * Each head's name and finger in one bar, staff by staff top down (the right hand's, then the
 * left's), the heads read from the bottom as the hand's notes are placed: the name 0.6 of a space
 * left of the leftmost head or accidental at 0.87 spaces, the finger a space past its rightmost
 * head at 1.1, each a space at least over the one below, as the canvas's 13 and 11 on its 10.
 */
function headMarks(
  staff: HTMLElement,
  measure: SVGGElement,
  bar: string,
  names: readonly (readonly string[])[],
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
    const leftmost = Math.min(
      ...[...lines.querySelectorAll('g.note .notehead, g.note g.accid')].map(
        (part) => part.getBoundingClientRect().left,
      ),
    )
    const nameAt = leftmost - origin.left - space * 0.6
    const fingerAt = Math.max(...heads.map((h) => h.right)) - origin.left + space
    let nameAbove = Infinity
    let fingerAbove = Infinity
    return heads.flatMap((head, i) => {
      const level = head.top + head.height / 2 - origin.top
      const out: HeadMark[] = []
      const name = names[s]?.[i] ?? ''
      if (name) {
        const nameTop = Math.min(level, nameAbove - space)
        nameAbove = nameTop
        out.push({
          key: `n${bar}-${s}-${i}`,
          text: name,
          left: nameAt,
          top: nameTop,
          size: space * 0.87,
          end: false,
        })
      }
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
          end: true,
        })
      }
      return out
    })
  })
}
