import type { VerovioToolkit } from 'verovio/esm'

/**
 * A printed page as a score's Layout sets it (A40, Flat's): its size and margins in millimetres, the
 * staff's height, the room between staves and systems in staff spaces, the notes' spacing (0
 * compact, 1 wide), where the bars' numbers print, the staves left out where empty, the music font.
 */
export interface PageSetup {
  readonly width: number
  readonly height: number
  readonly margins: {
    readonly top: number
    readonly bottom: number
    readonly left: number
    readonly right: number
  }
  readonly staffMm: number
  readonly staffSpace: number
  readonly systemSpace: number
  readonly noteSpacing: number
  readonly measureNumbers: 'every' | 'system' | 'none'
  readonly hideEmpty: 'never' | 'afterFirst' | 'always'
  readonly font: 'Bravura' | 'Petaluma' | 'Leland'
  /** The bars a system holds, its breaks written in the score; none, as they fit. */
  readonly systemBars?: number | undefined
}

/** Verovio's page units: a tenth of a millimetre. */
const PER_MM = 10

/** Verovio's options for a printed page (A40): its own units, tenths of a millimetre. */
export function pageOptions(page: PageSetup): Record<string, unknown> {
  const mm = (value: number) => Math.round(value * PER_MM)
  // Verovio's unit is half a staff space; a staff is four spaces high.
  const unit = (page.staffMm * PER_MM) / 8
  return {
    scale: 100,
    pageWidth: mm(page.width),
    pageHeight: mm(page.height),
    pageMarginTop: mm(page.margins.top),
    pageMarginBottom: mm(page.margins.bottom),
    pageMarginLeft: mm(page.margins.left),
    pageMarginRight: mm(page.margins.right),
    adjustPageHeight: false,
    adjustPageWidth: false,
    unit,
    spacingStaff: Math.round(page.staffSpace * 2),
    spacingSystem: Math.round(page.systemSpace * 2),
    spacingLinear: 0.1 + page.noteSpacing * 0.3,
    breaks: page.systemBars ? 'line' : 'auto',
    condense: page.hideEmpty === 'never' ? 'none' : 'auto',
    condenseFirstPage: page.hideEmpty === 'always',
    // Every bar's number, or each system's first (Verovio's 0); none are taken out of the drawing.
    mnumInterval: page.measureNumbers === 'every' ? 1 : 0,
    minLastJustification: 0.8,
    header: 'auto',
    footer: 'none',
    svgViewBox: true,
    svgRemoveXlink: true,
    font: page.font,
  }
}

/** What a score is engraved at: the width it is laid out to, in CSS px, and its size. */
export interface EngraveOptions {
  /** The line's width in CSS px, justified to it; a page's width. Omitted, the music's own width, unjustified. */
  readonly width?: number | undefined
  /** The staff's size: 1 a staff space of 10 CSS px. */
  readonly scale: number
  /** Laid out on pages of this height (a page view), else one line as tall as it is. */
  readonly pageHeight?: number | undefined
  /** Its staves joined by a brace (the grand staff): room left of the line for it. */
  readonly braced?: boolean | undefined
  /** A printed page as the score's Layout sets it (A40): the rest is then its. */
  readonly page?: PageSetup | undefined
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
  braced = true,
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
    pageMarginLeft: braced ? BRACE_ROOM : 0,
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
    // Verovio's own, as a page set by a Layout (A40) may have left them: the one toolkit keeps them.
    unit: 9,
    spacingStaff: 12,
    spacingSystem: 4,
    spacingLinear: 0.25,
    condense: 'auto',
    condenseFirstPage: false,
  }
}

let toolkit: Promise<VerovioToolkit> | undefined

/**
 * The one toolkit, loaded the first time a score is engraved. Verovio keeps every toolkit it makes,
 * each with its own WebAssembly memory (`VerovioToolkit.instances`, as it allows only one): this
 * module loaded afresh, as a test file's fresh modules load it, takes the one there.
 */
export function loadToolkit(): Promise<VerovioToolkit> {
  toolkit ??= Promise.all([import('verovio/wasm'), import('verovio/esm')]).then(
    async ([wasm, { VerovioToolkit }]) =>
      VerovioToolkit.instances[0] ?? new VerovioToolkit(await wasm.default()),
  )
  return toolkit
}

/** A score's MEI engraved as SVG: one page each, a line its one page. */
export async function engraveMei(mei: string, options: EngraveOptions): Promise<string[]> {
  const verovio = await loadToolkit()
  verovio.setOptions(options.page ? pageOptions(options.page) : verovioOptions(options))
  if (!verovio.loadData(mei))
    throw new Error(`Verovio could not read the score: ${verovio.getLog()}`)
  return Array.from({ length: verovio.getPageCount() }, (_, page) => verovio.renderToSVG(page + 1))
}
