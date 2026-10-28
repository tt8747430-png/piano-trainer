import type { StaffId } from '@/shared/lib/notation'
import type { Tick } from '@/shared/lib/music'
import type { Extent, ScoreLayout } from '../layout'
import { headsOf } from './svg-heads'
import { numbers } from './svg-glyphs'
import { labelsOf } from './svg-labels'
import { signsOf } from './svg-signs'
import { syllablesOf } from './svg-syllables'

/**
 * Where everything stands on a line Verovio engraved (ADR 0087), in CSS px, read from the SVG's own
 * coordinates, not the page's layout, so it reads the same anywhere (a test's DOM too): each measure
 * (`m-<index>`, its first staff's lines), each staff drawn (`staves`, top down) from its lines in the
 * first measure, each onset from its notes' and rests' heads (`n-`, `r-` and the hidden `h-<staff>-<tick>`),
 * each head's box with its chord's column (`headsOf`, ADR 0096), each clef, key and time signature
 * printed (`signsOf`, ADR 0114), the staves' names at a first line's head (`labelsOf`) and each
 * syllable printed under its note (`syllablesOf`, ADR 0096).
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
  for (const head of svg.querySelectorAll('g.note[id^="n-"], g.rest[id^="r-"], g.rest[id^="h-"]')) {
    const tick = Number(head.id.split('-')[2])
    const use = head.querySelector('use')
    const at = numbers(use?.getAttribute('transform') ?? use?.getAttribute('x') ?? null)[0]
    if (Number.isNaN(tick) || at === undefined) continue
    onsets.set(tick, Math.min(onsets.get(tick) ?? Infinity, x(at)))
  }

  // A measure drawn stands for itself and the bars after it not drawn: a multi-bar rest's (ADR 0087).
  const drawnAt = measures.map((_, index) => svg.querySelector(`#m-${index}`))
  const shareOf = (index: number) => {
    let first = index
    while (first > 0 && !drawnAt[first]) first -= 1
    let count = 1
    while (first + count < measures.length && !drawnAt[first + count]) count += 1
    return { first, part: index - first, count }
  }
  const laid = measures.map((measure, index) => {
    const { first, part, count } = shareOf(index)
    const lines = linesOf(staffGroups(drawnAt[first] ?? null)[0])
    const width = (x(lines.to) - x(lines.from)) / count
    const left = x(lines.from) + part * width
    const end = measure.startTick + measure.ticks
    const own = [...onsets].filter(([tick]) => tick >= measure.startTick && tick < end)
    return {
      startTick: measure.startTick,
      ticks: measure.ticks,
      x: left,
      width,
      notes: own.length > 0 ? Math.min(...own.map(([, at]) => at)) : left,
    }
  })

  const placed: Partial<Record<StaffId, { top: number; bottom: number }>> = {}
  const boxes: { top: number; bottom: number }[] = []
  staffGroups(svg.querySelector('#m-0')).forEach((group, index) => {
    const staff = staves[index]
    if (!staff) return
    const lines = linesOf(group)
    const box = { top: y(lines.top), bottom: y(lines.bottom) }
    placed[staff] = box
    boxes.push(box)
  })
  const firstLines = linesOf(staffGroups(svg.querySelector('#m-0'))[0])
  const space = (firstLines.bottom - firstLines.top) / 4 || 180
  const inPx = (box: Extent): Extent => ({
    left: x(box.left),
    right: x(box.right),
    top: y(box.top),
    bottom: y(box.bottom),
  })
  const { heads, columns, rests, graces } = headsOf(svg, space, inPx)
  const signs = signsOf(svg, space, inPx, staves, (index) => laid[index]?.notes ?? Infinity)
  const labels = labelsOf(svg, inPx, placed)
  const syllables = syllablesOf(svg, inPx)
  return {
    width,
    height,
    staffTop: Math.min(...boxes.map((box) => box.top)),
    staffBottom: Math.max(...boxes.map((box) => box.bottom)),
    measures: laid,
    staves: placed,
    onsets: [...onsets].sort(([a], [b]) => a - b).map(([tick, at]) => ({ tick, x: at })),
    heads,
    graces,
    columns,
    rests,
    signs,
    labels,
    syllables,
  }
}
