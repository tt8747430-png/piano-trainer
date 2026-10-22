import type { VerovioToolkit } from 'verovio/esm'

/** What a score is engraved at: the width it is laid out to, in CSS px, and its size. */
export interface EngraveOptions {
  /** The line's width in CSS px, justified to it; a page's width. Omitted, the music's own width, unjustified. */
  readonly width?: number | undefined
  /** The staff's size: 1 a staff space of 10 CSS px. */
  readonly scale: number
  /** Laid out on pages of this height (a page view), else one line as tall as it is. */
  readonly pageHeight?: number | undefined
}

/** Verovio's scale (%) that draws a staff space of 10 CSS px at our 1: its space is 18 units of a page's width. */
const SCALE_PER_ONE = 1000 / 18
/** The room left of a line for its brace, in Verovio's page units. */
const BRACE_ROOM = 60
/** The widest a line left at its own width may run, in Verovio's page units. */
const UNBOUNDED = 60_000

/** Verovio's options for what is asked: our page and its units agree, a CSS px a unit at its scale. */
export function verovioOptions({
  width,
  scale,
  pageHeight,
}: EngraveOptions): Record<string, unknown> {
  // Verovio takes a whole percentage: the page's units follow the scale it takes.
  const verovioScale = Math.max(1, Math.round(scale * SCALE_PER_ONE))
  const units = (css: number) => (css * 100) / verovioScale
  return {
    scale: verovioScale,
    pageWidth: width === undefined ? UNBOUNDED : Math.round(units(width)),
    pageHeight: pageHeight === undefined ? 60_000 : Math.round(units(pageHeight)),
    adjustPageHeight: pageHeight === undefined,
    adjustPageWidth: width === undefined,
    breaks: pageHeight === undefined ? (width === undefined ? 'none' : 'encoded') : 'auto',
    // Every line justified to its width, the last too.
    minLastJustification: 0,
    pageMarginLeft: BRACE_ROOM,
    pageMarginRight: 0,
    pageMarginTop: 0,
    pageMarginBottom: 0,
    header: pageHeight === undefined ? 'none' : 'auto',
    footer: 'none',
    svgViewBox: true,
    svgRemoveXlink: true,
    // The bars' numbers are the sheet's own labels.
    mnumInterval: 0,
    font: 'Bravura',
  }
}

let toolkit: Promise<VerovioToolkit> | undefined

/** The one toolkit, loaded the first time a score is engraved. */
export function loadToolkit(): Promise<VerovioToolkit> {
  toolkit ??= Promise.all([import('verovio/wasm'), import('verovio/esm')]).then(
    async ([wasm, esm]) => new esm.VerovioToolkit(await wasm.default()),
  )
  return toolkit
}

/** A score's MEI engraved as SVG: one page each, a line its one page. */
export async function engraveMei(mei: string, options: EngraveOptions): Promise<string[]> {
  const verovio = await loadToolkit()
  verovio.setOptions(verovioOptions(options))
  if (!verovio.loadData(mei))
    throw new Error(`Verovio could not read the score: ${verovio.getLog()}`)
  return Array.from({ length: verovio.getPageCount() }, (_, page) => verovio.renderToSVG(page + 1))
}
