import type { Midi, TimeSignature } from '@/shared/lib/music'
import { scoreToMei, type NextLine, type Score, type StaffId } from '@/shared/lib/notation'
import type { ScoreLayout } from '../layout'
import { engrave } from './engine'
import { layoutOf } from './svg-layout'

export interface DrawOptions {
  readonly scale: number
  readonly fingers: boolean
  /** Each notehead carries its note's name. */
  readonly names: boolean
  /** The staves drawn, top down. */
  readonly staves: readonly StaffId[]
  readonly timeBefore?: TimeSignature | undefined
  /** What the next line starts in: a change printed after the line's end (a justified line's). */
  readonly next?: NextLine | undefined
  /** The width the line is justified to, in CSS px; it is drawn smaller where its music is wider. */
  readonly fill?: number | undefined
}

/** The names a note's head may carry: its letter and its sign. */
const SIGN = { [-2]: '𝄫', [-1]: '♭', 0: '', 1: '♯', 2: '𝄪' } as const

/**
 * A score engraved by Verovio (ADR 0078) into a sheet of its own, which `host` shows once it is
 * whole: one line of its staves, justified to `fill` (drawn again smaller where its music is wider,
 * never broken in two), each staff's group named by `data-staff`, each head named where asked. Its layout says
 * where everything stands. Stopped by `signal`, it leaves what was there and says null.
 */
export async function drawScore(
  score: Score,
  host: HTMLElement,
  options: DrawOptions,
  signal: AbortSignal,
): Promise<ScoreLayout | null> {
  const meiOf = (next: NextLine | undefined) =>
    scoreToMei(score, {
      staves: options.staves,
      fingers: options.fingers,
      timeBefore: options.timeBefore,
      next,
    })
  // The courtesy signature follows a line broken where it is written: a line left at its own width has no break.
  const justified = meiOf(options.next)
  const natural = options.next ? meiOf(undefined) : justified
  const drawn = async (scale: number, width = options.fill) => {
    const mei = width === undefined ? natural : justified
    const [svg = ''] = await engrave(mei, { width, scale })
    const sheet = host.ownerDocument.createElement('div')
    sheet.innerHTML = svg
    const element = sheet.querySelector('svg')
    if (!element) throw new Error('Verovio drew no score')
    const systems = element.querySelectorAll('g.system').length
    return { sheet, element, systems, layout: layoutOf(element, score.measures, options.staves) }
  }
  const endOf = (layout: ScoreLayout) => {
    const last = layout.measures.at(-1)
    return last ? last.x + last.width : 0
  }
  let page = await drawn(options.scale)
  const { fill } = options
  if (fill !== undefined && (page.systems > 1 || endOf(page.layout) > fill + 1)) {
    // Wider than the line: drawn once at its own width, then again as much smaller as it is wider.
    const own =
      page.systems > 1 ? endOf((await drawn(options.scale, undefined)).layout) : endOf(page.layout)
    page = await drawn((options.scale * fill) / own)
  }
  if (signal.aborted) return null
  const { sheet, element, layout } = page
  element.setAttribute('width', String(layout.width))
  element.setAttribute('height', String(layout.height))
  for (const measure of element.querySelectorAll('g.measure'))
    [...measure.children]
      .filter((child) => child.classList.contains('staff'))
      .forEach((group, index) => group.setAttribute('data-staff', options.staves[index] ?? ''))
  if (options.names) nameHeads(element, score)
  host.replaceChildren(...sheet.childNodes)
  const keyed = withKeys(layout, score)
  return score.staffInstruments ? { ...keyed, staffInstruments: score.staffInstruments } : keyed
}

/**
 * Each head with its note's key, from the score (ADR 0088): what a head clicked chooses. Two voices'
 * chords at one tick share their ids; they come in the voices' order, as the engraving draws them.
 */
export function withKeys(layout: ScoreLayout, score: Score): ScoreLayout {
  const keys = new Map<string, Midi[]>()
  for (const measure of score.measures)
    for (const staff of score.staves)
      for (const voice of measure.staves[staff])
        for (const event of voice.events)
          if (event.kind === 'notes')
            event.notes.forEach((written, i) => {
              const id = `n-${staff}-${event.tick}-${i}`
              keys.set(id, [...(keys.get(id) ?? []), written.midi])
            })
  const seen = new Map<string, number>()
  const heads = layout.heads?.map((head) => {
    const k = seen.get(head.id) ?? 0
    seen.set(head.id, k + 1)
    const midi = keys.get(head.id)?.[k]
    return midi === undefined ? head : { ...head, midi }
  })
  return heads ? { ...layout, heads } : layout
}

/** A staff space in Verovio's units, and a notehead's half width (Bravura's black head, 1.18 spaces). */
const SPACE = 180
const HALF_HEAD = 106
/** A named head's radius: a little larger than a head, a third's heads still apart. */
const NAMED_RADIUS = 96
/** SMuFL's open heads: the whole note's and the half note's (and the breve's). */
const OPEN_HEADS = /#E0A[023]-/
const SVG = 'http://www.w3.org/2000/svg'

/**
 * Each notehead drawn as a round head with its note's name in it, as notation programs' note-name
 * noteheads: a black note's in ink with the letter in the page's colour, a half or whole note's
 * open with the letter in ink. The Player's Named notes.
 */
function nameHeads(svg: SVGSVGElement, score: Score) {
  const names = new Map<string, string>()
  for (const measure of score.measures)
    for (const staff of score.staves)
      for (const voice of measure.staves[staff])
        for (const event of voice.events)
          if (event.kind === 'notes')
            event.notes.forEach((written, i) =>
              names.set(
                `n-${staff}-${event.tick}-${i}`,
                written.spelled.letter + SIGN[written.spelled.accidental],
              ),
            )
  const made = (tag: string, attributes: Record<string, string | number>) => {
    const element = svg.ownerDocument.createElementNS(SVG, tag)
    for (const [name, value] of Object.entries(attributes))
      element.setAttribute(name, String(value))
    return element
  }
  for (const note of svg.querySelectorAll<SVGGElement>('g.note[id^="n-"]')) {
    const name = names.get(note.id)
    const head = note.querySelector('g.notehead use')
    if (!name || !head) continue
    const [x = 0, y = 0] = (head.getAttribute('transform')?.match(/-?\d+(?:\.\d+)?/g) ?? []).map(
      Number,
    )
    const open = OPEN_HEADS.test(head.getAttribute('xlink:href') ?? head.getAttribute('href') ?? '')
    head.setAttribute('visibility', 'hidden')
    const at = { x: x + HALF_HEAD, y }
    const named = made('g', { class: open ? 'note-name open' : 'note-name' })
    named.append(
      made('circle', { cx: at.x, cy: at.y, r: NAMED_RADIUS }),
      made('text', {
        x: at.x,
        y: at.y + SPACE * 0.04,
        'font-size': name.length > 1 ? SPACE * 0.62 : SPACE * 0.8,
      }),
    )
    const text = named.lastElementChild
    if (text) text.textContent = name
    head.after(named)
  }
}
