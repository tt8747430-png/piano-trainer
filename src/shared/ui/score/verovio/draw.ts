import type { TimeSignature } from '@/shared/lib/music'
import { scoreToMei, type Score, type StaffId } from '@/shared/lib/notation'
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
  /** The width the line is justified to, in CSS px; it is drawn smaller where its music is wider. */
  readonly fill?: number | undefined
}

/** The names a note's head may carry: its letter and its sign. */
const SIGN = { [-2]: '𝄫', [-1]: '♭', 0: '', 1: '♯', 2: '𝄪' } as const

/**
 * A score engraved by Verovio (ADR 0078) into a sheet of its own, which `host` shows once it is
 * whole: one line of its staves, justified to `fill` (drawn again smaller once where its music is
 * wider), each staff's group named by `data-staff`, each head named where asked. Its layout says
 * where everything stands. Stopped by `signal`, it leaves what was there and says null.
 */
export async function drawScore(
  score: Score,
  host: HTMLElement,
  options: DrawOptions,
  signal: AbortSignal,
): Promise<ScoreLayout | null> {
  const mei = scoreToMei(score, {
    staves: options.staves,
    fingers: options.fingers,
    timeBefore: options.timeBefore,
  })
  const drawn = async (scale: number) => {
    const [svg = ''] = await engrave(mei, { width: options.fill, scale })
    const sheet = host.ownerDocument.createElement('div')
    sheet.innerHTML = svg
    const element = sheet.querySelector('svg')
    if (!element) throw new Error('Verovio drew no score')
    return { sheet, element, layout: layoutOf(element, score.measures, options.staves) }
  }
  let page = await drawn(options.scale)
  const last = page.layout.measures.at(-1)
  const end = last ? last.x + last.width : 0
  if (options.fill !== undefined && end > options.fill + 1)
    page = await drawn((options.scale * options.fill) / end)
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
  return score.staffInstruments ? { ...layout, staffInstruments: score.staffInstruments } : layout
}

/** Each notehead with its note's name over it, haloed by the page: the Player's Named notes. */
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
  for (const note of svg.querySelectorAll<SVGGElement>('g.note[id^="n-"]')) {
    const name = names.get(note.id)
    const head = note.querySelector('g.notehead use')
    const [x = 0, y = 0] = (head?.getAttribute('transform')?.match(/-?\d+(?:\.\d+)?/g) ?? []).map(
      Number,
    )
    if (!name || !head) continue
    const text = svg.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', String(x + 140))
    text.setAttribute('y', String(y + 60))
    text.setAttribute('class', 'note-name')
    text.textContent = name
    note.append(text)
  }
}
