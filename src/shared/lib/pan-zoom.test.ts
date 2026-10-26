import { describe, expect, it } from 'vitest'
import { clampZoom, fitWidth, panBy, reveal, zoomAt, ZOOM } from './pan-zoom'

const viewport = { width: 400, height: 800 }
const content = { width: 794, height: 2300 }

describe('the page canvas', () => {
  it('zooms about a point, the content under it held still', () => {
    const view = zoomAt({ x: 0, y: 0, zoom: 1 }, 2, { x: 100, y: 50 })
    expect(view).toEqual({ x: -100, y: -50, zoom: 2 })
    // The content point under (100, 50) was (100, 50) and still is: (100 - -100) / 2.
    expect((100 - view.x) / view.zoom).toBe(100)
  })

  it('zooms no further out or in than its limits', () => {
    expect(clampZoom(0.01)).toBe(ZOOM.least)
    expect(clampZoom(40)).toBe(ZOOM.most)
  })

  it('fits a page’s width to the screen, centred, its top in sight, never past full size', () => {
    const fitted = fitWidth(content, 794, viewport)
    expect(fitted.zoom).toBeCloseTo(368 / 794)
    expect(fitted.x).toBeCloseTo(16)
    expect(fitted.y).toBe(16)
    expect(fitWidth(content, 794, { width: 2000, height: 1000 }).zoom).toBe(1)
  })

  it('fits a page in the room what floats beside it leaves (a palette at its right), centred there', () => {
    // A phone on its side: 804 wide, a palette 320 wide over its right edge.
    const fitted = fitWidth(content, 794, { width: 804, height: 305 }, { right: 320 })
    expect(fitted.zoom).toBeCloseTo((484 - 32) / 794)
    expect(fitted.x + content.width * fitted.zoom + fitted.x).toBeCloseTo(484)
  })

  it('fits a page no larger than shows a whole line of it in the screen’s height', () => {
    // A phone on its side, the keys out: 179 high; a line of the page 200 high at full size.
    const fitted = fitWidth(content, 794, { width: 804, height: 179 }, { line: 200 })
    expect(fitted.zoom).toBeCloseTo((179 - 32) / 200)
    expect(fitWidth(content, 794, { width: 804, height: 900 }, { line: 200 }).zoom).toBeCloseTo(
      (804 - 32) / 794,
    )
  })

  it('pans, keeping some of the content in sight', () => {
    const view = { x: 0, y: 0, zoom: 1 }
    expect(panBy(view, -30, -40, content, viewport)).toEqual({ x: -30, y: -40, zoom: 1 })
    expect(panBy(view, 5000, 5000, content, viewport)).toEqual({ x: 336, y: 736, zoom: 1 })
    expect(panBy(view, -5000, -5000, content, viewport)).toEqual({ x: -730, y: -2236, zoom: 1 })
  })

  it('moves the least that brings a line into sight, and not at all when it is', () => {
    const view = { x: 0, y: 0, zoom: 1 }
    const line = { top: 1000, bottom: 1200, left: 20, right: 300 }
    expect(reveal(view, line, viewport).y).toBe(-416)
    expect(reveal(view, { ...line, top: 100, bottom: 300 }, viewport)).toEqual(view)
    expect(reveal({ x: 0, y: -900, zoom: 1 }, { ...line, top: 100, bottom: 300 }, viewport).y).toBe(
      -84,
    )
  })
})
