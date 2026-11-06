import type { ComponentProps, ReactElement, ReactNode } from 'react'
import type { StaffId } from '@/shared/lib/notation'
import type { Extent, ScoreLayout, Sign, StaffLabel } from '@/shared/ui/score'

/**
 * What is printed on the sheet and edited where it is (ADR 0114), as Flat's and Dorico's: the tempo
 * mark; a section's name at its first bar (ADR 0097); a key or time signature, from the piece's bar it
 * stands at; a staff's clef there; a staff's name at the first line's head, a single staff's or the
 * piano's (ADR 0097).
 */
export type Printed =
  | { readonly kind: 'tempo' }
  | { readonly kind: 'section'; readonly section: number }
  | { readonly kind: 'key'; readonly bar: number }
  | { readonly kind: 'time'; readonly bar: number }
  | { readonly kind: 'clef'; readonly bar: number; readonly staff: StaffId }
  /** A staff's name at the first line's head: a single staff's (ADR 0097), or the piano's. */
  | { readonly kind: 'staff'; readonly staves: StaffLabel['staves'] }
  /**
   * A line's head on a touch screen (R34, D1): its staff's clef, key and time signature, each too
   * narrow to tap, as one target whose menu names each.
   */
  | {
      readonly kind: 'signs'
      readonly bar: number
      readonly staff: StaffId
      readonly signs: readonly PrintedSign[]
    }

/** A sign printed: a key or time signature, or a clef. */
export type PrintedSign = Extract<Printed, { kind: 'key' | 'time' | 'clef' }>

/**
 * What edits a thing printed: the page wraps the sheet's button over it (`trigger`) in what opens
 * there, a popover anchored to it.
 */
export type EditPrinted = (
  printed: Printed,
  trigger: ReactElement<ComponentProps<'button'>>,
) => ReactNode

/** A thing printed, the staff it is printed on, and the box a click on it takes, in the line's px. */
export interface PrintedTarget {
  readonly printed: Printed
  readonly staff: StaffId
  readonly box: Extent
}

/** How far a target reaches past its glyphs where nothing printed is beside it, in CSS px. */
const REACH = 6

/** The thing a sign printed at the piece's bar `bar` is. */
const printedOf = (sign: Sign, bar: number): Printed =>
  sign.kind === 'clef' ? { kind: 'clef', bar, staff: sign.staff } : { kind: sign.kind, bar }

/**
 * A line's signs and, where its key prints no sharps or flats (`keyless`: C major, A minor), the
 * key's place after each clef at its head: from the clef to what follows it, where a signature
 * would stand.
 */
function withKeyPlaces(layout: ScoreLayout, keyless: boolean): readonly Sign[] {
  const signs = layout.signs ?? []
  if (!keyless) return signs
  return signs.flatMap((sign, index): Sign[] => {
    const lines = layout.staves[sign.staff]
    const measure = layout.measures[sign.measure]
    if (sign.kind !== 'clef' || sign.measure !== 0 || !lines || !measure) return [sign]
    const next = signs[index + 1]
    const beside = next?.staff === sign.staff && next.measure === sign.measure ? next : undefined
    if (beside?.kind === 'key') return [sign]
    const right = Math.max(sign.right, beside?.left ?? measure.notes - REACH)
    const place: Sign = {
      kind: 'key',
      staff: sign.staff,
      measure: 0,
      left: sign.right,
      right,
      ...lines,
    }
    return [sign, place]
  })
}

/**
 * The targets over a line's clefs, key and time signatures (ADR 0114), `bars` the piece's bar of each
 * of its measures: each sign's box grown to meet its neighbours on its staff halfway, from the line's
 * start to short of its measure's first note, and over its staff's lines at least; a key printing
 * no sharps or flats (`keyless`) its place after the head's clefs; a single staff's clef too, which
 * writes the staff in another clef (ADR 0097).
 */
export function signTargets(
  layout: ScoreLayout,
  bars: readonly number[],
  keyless = false,
): PrintedTarget[] {
  const signs = withKeyPlaces(layout, keyless)
  return signs.flatMap((sign, index) => {
    const bar = bars[sign.measure]
    const lines = layout.staves[sign.staff]
    const measure = layout.measures[sign.measure]
    if (bar === undefined || !lines || !measure) return []
    const beside = (other: Sign | undefined): other is Sign =>
      other !== undefined && other.staff === sign.staff && other.measure === sign.measure
    const before = signs[index - 1]
    const after = signs[index + 1]
    const left = beside(before)
      ? (before.right + sign.left) / 2
      : Math.max(measure.x, sign.left - REACH)
    const right = beside(after)
      ? (sign.right + after.left) / 2
      : Math.max(sign.right, Math.min(sign.right + REACH, measure.notes - REACH))
    return [
      {
        printed: printedOf(sign, bar),
        staff: sign.staff,
        box: {
          left,
          right,
          top: Math.min(sign.top, lines.top - REACH),
          bottom: Math.max(sign.bottom, lines.bottom + REACH),
        },
      },
    ]
  })
}

/** The least a touch target spans either way, in CSS px (WCAG's 2.5.5, Apple's 44 pt). */
export const TOUCH_TARGET = 44

const isSign = (printed: Printed): printed is PrintedSign =>
  printed.kind === 'key' || printed.kind === 'time' || printed.kind === 'clef'

/** A box grown about its middle to `least` along one way where it is short of it. */
function atLeast(from: number, to: number, least: number): [number, number] {
  const short = least - (to - from)
  return short > 0 ? [from - short / 2, to + short / 2] : [from, to]
}

/**
 * A line's head made tappable (R34, D1): where a staff's signs at the line's first bar (`bar`) are
 * more than one and any is narrower than a touch target, they become one target over them all, at
 * least a touch target each way, whose menu names each; the rest stand as they are.
 */
export function headTargets(targets: readonly PrintedTarget[], bar: number): PrintedTarget[] {
  const atHead = (target: PrintedTarget) => isSign(target.printed) && target.printed.bar === bar
  const staves = [...new Set(targets.filter(atHead).map((target) => target.staff))]
  const grouped = staves.flatMap((staff): PrintedTarget[] => {
    const head = targets.filter((target) => atHead(target) && target.staff === staff)
    const narrow = head.some(({ box }) => box.right - box.left < TOUCH_TARGET)
    if (head.length < 2 || !narrow) return head
    const [left, right] = atLeast(
      Math.min(...head.map(({ box }) => box.left)),
      Math.max(...head.map(({ box }) => box.right)),
      TOUCH_TARGET,
    )
    const [top, bottom] = atLeast(
      Math.min(...head.map(({ box }) => box.top)),
      Math.max(...head.map(({ box }) => box.bottom)),
      TOUCH_TARGET,
    )
    const signs = head.map(({ printed }) => printed).filter(isSign)
    return [
      { printed: { kind: 'signs', bar, staff, signs }, staff, box: { left, right, top, bottom } },
    ]
  })
  return [...grouped, ...targets.filter((target) => !atHead(target))]
}
