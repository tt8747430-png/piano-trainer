// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { barUnder } from './bar-under'

describe('barUnder', () => {
  // jsdom lays nothing out, so it has no elementsFromPoint of its own.
  Object.defineProperty(document, 'elementsFromPoint', { value: () => [], configurable: true })
  afterEach(() => vi.restoreAllMocks())

  it('is the bar marked under the point, past what lies over it', () => {
    document.body.innerHTML = '<div data-bar="3"><span id="cell"></span></div><div id="grip"></div>'
    const at = (...ids: string[]) =>
      vi
        .spyOn(document, 'elementsFromPoint')
        .mockReturnValue(ids.map((id) => document.getElementById(id) as Element))
    at('grip', 'cell')
    expect(barUnder(10, 10)).toBe(3)
    at('grip')
    expect(barUnder(10, 10)).toBeNull()
  })
})
