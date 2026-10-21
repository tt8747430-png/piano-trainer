/**
 * Where a canvas's content stands on the screen (ADR 0075): moved by `x` and `y` (CSS px, its top
 * left corner's place in the viewport) and drawn at `zoom`, as a notation app's page view floats its
 * pages on a canvas that pans and zooms.
 */
export interface CanvasView {
  readonly x: number
  readonly y: number
  readonly zoom: number
}

export interface Size {
  readonly width: number
  readonly height: number
}

/** How far out and in the canvas zooms: a whole score in sight, a bar read up close. */
export const ZOOM = { least: 0.1, most: 4 } as const
/** Each step of the zoom buttons, and of a wheel's notch with Ctrl. */
export const ZOOM_STEP = 1.25
/** What is kept round the content where it is fitted, and in sight of the viewport where it is moved. */
const FIT_MARGIN = 16
const KEPT_IN_SIGHT = 64

export const clampZoom = (zoom: number): number => Math.min(ZOOM.most, Math.max(ZOOM.least, zoom))

/** The view zoomed to `zoom` about a point of the viewport, the content under it held still. */
export function zoomAt(
  view: CanvasView,
  zoom: number,
  point: { readonly x: number; readonly y: number },
): CanvasView {
  const next = clampZoom(zoom)
  const ratio = next / view.zoom
  return {
    x: point.x - (point.x - view.x) * ratio,
    y: point.y - (point.y - view.y) * ratio,
    zoom: next,
  }
}

/**
 * The content's `column` (the width a page takes) fitted to the viewport's width, its top in sight:
 * a page read across as a PDF viewer opens it, never larger than full size.
 */
export function fitWidth(content: Size, column: number, viewport: Size): CanvasView {
  const zoom = clampZoom(Math.min(1, (viewport.width - 2 * FIT_MARGIN) / column))
  return { x: (viewport.width - content.width * zoom) / 2, y: FIT_MARGIN, zoom }
}

/** The view moved by `dx`, `dy`, some of the content always kept in sight: it is never lost off the canvas. */
export function panBy(
  view: CanvasView,
  dx: number,
  dy: number,
  content: Size,
  viewport: Size,
): CanvasView {
  const keep = (at: number, length: number, room: number) =>
    Math.min(room - KEPT_IN_SIGHT, Math.max(KEPT_IN_SIGHT - length, at))
  return {
    ...view,
    x: keep(view.x + dx, content.width * view.zoom, viewport.width),
    y: keep(view.y + dy, content.height * view.zoom, viewport.height),
  }
}

/**
 * The least move that brings a box of the content (in the content's own px) into the viewport, with a
 * margin round it: the caret's line, or the line playing, comes into sight.
 */
export function reveal(
  view: CanvasView,
  box: {
    readonly top: number
    readonly bottom: number
    readonly left: number
    readonly right: number
  },
  viewport: Size,
): CanvasView {
  const along = (start: number, end: number, at: number, room: number) => {
    const from = at + start * view.zoom
    const to = at + end * view.zoom
    if (from < FIT_MARGIN) return at + FIT_MARGIN - from
    if (to > room - FIT_MARGIN) return at - Math.min(to - (room - FIT_MARGIN), from - FIT_MARGIN)
    return at
  }
  return {
    ...view,
    x: along(box.left, box.right, view.x, viewport.width),
    y: along(box.top, box.bottom, view.y, viewport.height),
  }
}
