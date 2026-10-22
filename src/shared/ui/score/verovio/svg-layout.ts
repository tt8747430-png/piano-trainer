import type { StaffId } from '@/shared/lib/notation'
import type { Tick } from '@/shared/lib/music'
import type { ScoreLayout } from '../layout'

/** The numbers in a `translate(x, y)` or a path's `M x y L x y`. */
const numbers = (text: string | null) => (text?.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)

/**
 * Where everything stands on a line Verovio engraved (ADR 0078), in CSS px, read from the SVG's own
 * coordinates, not the page's layout, so it reads the same anywhere (a test's DOM too): each measure
 * (`m-<index>`, its first staff's lines), each staff drawn (`staves`, top down) from its lines in the
 * first measure, each onset from its notes' and rests' heads (`n-` and `r-<staff>-<tick>`).
 */
export function layoutOf(
  svg: SVGSVGElement,
  measures: readonly { readonly startTick: Tick; readonly ticks: Tick }[],
  staves: readonly StaffId[],
): ScoreLayout {
  const outer = numbers(svg.getAttribute('viewBox'))
  const inner = numbers(svg.querySelector('svg.definition-scale')?.getAttribute('viewBox') ?? null)
  const width = outer[2] ?? 0
  const height = outer[3] ?? 0
  const k = width / (inner[2] || 1)
  const [mx = 0, my = 0] = numbers(
    svg.querySelector('g.page-margin')?.getAttribute('transform') ?? null,
  )
  const x = (units: number) => (mx + units) * k
  const y = (units: number) => (my + units) * k

  /** A staff group's five lines: their x from and to, and the top and bottom lines' y. */
  const linesOf = (staff: Element | undefined) => {
    const paths = [...(staff?.children ?? [])].filter((child) => child.tagName === 'path')
    const first = numbers(paths[0]?.getAttribute('d') ?? null)
    const last = numbers(paths.at(-1)?.getAttribute('d') ?? null)
    return {
      from: first[0] ?? 0,
      to: first[2] ?? 0,
      top: first[1] ?? 0,
      bottom: last[1] ?? 0,
    }
  }
  const staffGroups = (measure: Element | null) =>
    [...(measure?.children ?? [])].filter((child) => child.classList.contains('staff'))

  const onsets = new Map<Tick, number>()
  for (const head of svg.querySelectorAll('g.note[id^="n-"], g.rest[id^="r-"]')) {
    const tick = Number(head.id.split('-')[2])
    const use = head.querySelector('use')
    const at = numbers(use?.getAttribute('transform') ?? use?.getAttribute('x') ?? null)[0]
    if (Number.isNaN(tick) || at === undefined) continue
    onsets.set(tick, Math.min(onsets.get(tick) ?? Infinity, x(at)))
  }

  const laid = measures.map((measure, index) => {
    const lines = linesOf(staffGroups(svg.querySelector(`#m-${index}`))[0])
    const left = x(lines.from)
    const end = measure.startTick + measure.ticks
    const own = [...onsets].filter(([tick]) => tick >= measure.startTick && tick < end)
    return {
      startTick: measure.startTick,
      ticks: measure.ticks,
      x: left,
      width: x(lines.to) - left,
      notes: own.length > 0 ? Math.min(...own.map(([, at]) => at)) : left,
    }
  })

  const placed: Partial<Record<StaffId, { top: number; bottom: number }>> = {}
  staffGroups(svg.querySelector('#m-0')).forEach((group, index) => {
    const staff = staves[index]
    if (!staff) return
    const lines = linesOf(group)
    placed[staff] = { top: y(lines.top), bottom: y(lines.bottom) }
  })
  const boxes = Object.values(placed)
  return {
    width,
    height,
    staffTop: Math.min(...boxes.map((box) => box.top)),
    staffBottom: Math.max(...boxes.map((box) => box.bottom)),
    measures: laid,
    staves: placed,
    onsets: [...onsets].sort(([a], [b]) => a - b).map(([tick, at]) => ({ tick, x: at })),
  }
}
