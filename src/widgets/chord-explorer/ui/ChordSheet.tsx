import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { printedSymbol, type ChordFingers, type Midi, type PlacedChord } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { chordBar } from '@/shared/lib/schedule'
import { LazyScoreView } from '@/shared/ui'

/** The canvas's staff space over the app's at its own size: 15 to 10. */
const SCALE = 1.5

/** A word set beside a head: its name left of the chord, its finger right of it. */
interface HeadMark {
  readonly key: string
  readonly text: string
  readonly left: number
  readonly top: number
  readonly size: number
  readonly end: boolean
}

/**
 * The chord written as the keys place it, as the canvas's staff card writes it: the staff across the
 * card at the canvas's size, the chord's name over it, its heads solid in their tones' paints, each
 * note's name left of the chord and its finger right of it, as a chord chart prints them (Vita
 * Piano); its place kept while the staff loads.
 */
export function ChordSheet({
  placed,
  symbol,
  fingers,
  labels,
}: {
  placed: PlacedChord
  symbol: string
  fingers: ChordFingers
  /** What each head carries left of the chord, as the Piano sheet's Labels says. */
  labels: ReadonlyMap<Midi, string>
}) {
  const { t } = useTranslation('music')
  const score = useMemo(() => notate(chordBar(placed, { fingers })), [placed, fingers])
  const section = useRef<HTMLElement>(null)
  const [width, setWidth] = useState(0)
  const [marks, setMarks] = useState<readonly HeadMark[]>([])
  const [middle, setMiddle] = useState<number | undefined>()
  useLayoutEffect(() => {
    const at = section.current
    if (!at) return
    const staves = [placed.rh, placed.lh].filter((hand) => hand.length > 0)
    const hands = [fingers.rh, fingers.lh].filter(
      (_, i) => (i === 0 ? placed.rh : placed.lh).length,
    )
    const place = () => {
      setWidth(at.clientWidth - 40)
      setMiddle(chordMiddle(at))
      setMarks(
        headMarks(
          at,
          staves.map((hand) => hand.map((tone) => labels.get(tone.midi) ?? '')),
          hands,
        ),
      )
    }
    const watch = new MutationObserver(place)
    watch.observe(at, { childList: true, subtree: true })
    const resize = new ResizeObserver(place)
    resize.observe(at)
    place()
    return () => {
      watch.disconnect()
      resize.disconnect()
    }
  }, [placed, fingers, labels])
  return (
    <section
      ref={section}
      aria-label={t('sheet.label')}
      data-chord-sheet
      className="relative w-full min-w-40 px-5 pt-7"
    >
      {middle === undefined ? null : (
        <span
          className="absolute top-0 flex h-11 -translate-x-1/2 items-center font-display text-[1.0625rem] font-bold whitespace-nowrap text-link"
          style={{ left: middle }}
        >
          {printedSymbol(symbol)}
        </span>
      )}
      {width > 0 ? <LazyScoreView score={score} scale={SCALE} fill={width} /> : null}
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
    </section>
  )
}

/** The middle of the chord's heads, in the section's pixels: where its name stands over it. */
function chordMiddle(section: HTMLElement): number | undefined {
  const heads = [...section.querySelectorAll('g.note .notehead')].map((head) =>
    head.getBoundingClientRect(),
  )
  if (heads.length === 0) return undefined
  const left = Math.min(...heads.map((head) => head.left))
  const right = Math.max(...heads.map((head) => head.right))
  return (left + right) / 2 - section.getBoundingClientRect().left
}

/**
 * Each head's name and finger, staff by staff top down (the right hand's, then the left's), the
 * heads read from the bottom as the hand's notes are placed: the name 0.6 of a space left of the
 * leftmost head or accidental at 0.87 spaces, the finger a space past its rightmost head
 * at 1.1, each a space at least over the one below, as the canvas's 13 and 11 on its 10.
 */
function headMarks(
  section: HTMLElement,
  names: readonly (readonly string[])[],
  fingers: readonly (readonly (number | undefined)[])[],
): HeadMark[] {
  const origin = section.getBoundingClientRect()
  return [...section.querySelectorAll<SVGGElement>('g.staff')].flatMap((staff, s) => {
    const heads = [...staff.querySelectorAll<SVGGElement>('g.note .notehead')]
      .map((head) => head.getBoundingClientRect())
      .sort((a, b) => b.top - a.top)
    const [first] = heads
    if (!first) return []
    const space = first.height
    const leftmost = Math.min(
      ...[...staff.querySelectorAll('g.note .notehead, g.note g.accid')].map(
        (part) => part.getBoundingClientRect().left,
      ),
    )
    const nameAt = leftmost - origin.left - space * 0.6
    const fingerAt = Math.max(...heads.map((h) => h.right)) - origin.left + space
    let nameAbove = Infinity
    let fingerAbove = Infinity
    return heads.flatMap((head, i) => {
      const level = head.top + head.height / 2 - origin.top
      const nameTop = Math.min(level, nameAbove - space)
      nameAbove = nameTop
      const finger = fingers[s]?.[i]
      const out: HeadMark[] = [
        {
          key: `n${s}-${i}`,
          text: names[s]?.[i] ?? '',
          left: nameAt,
          top: nameTop,
          size: space * 0.87,
          end: false,
        },
      ]
      if (finger !== undefined) {
        const fingerTop = Math.min(level, fingerAbove - space)
        fingerAbove = fingerTop
        out.push({
          key: `f${s}-${i}`,
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
