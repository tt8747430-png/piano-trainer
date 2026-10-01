import { vi } from 'vitest'

/**
 * A `ResizeObserver` for jsdom, which has none and lays nothing out: every element observed reports
 * `height` once, at once, as a browser does when it first lays the element out.
 */
export function stubResizeObserver({ height = 64 }: { height?: number } = {}) {
  class FakeObserver implements ResizeObserver {
    constructor(private readonly callback: ResizeObserverCallback) {}
    observe(target: Element) {
      const size = [{ blockSize: height, inlineSize: 0 }]
      queueMicrotask(() =>
        this.callback(
          [
            {
              target,
              borderBoxSize: size,
              contentBoxSize: size,
              devicePixelContentBoxSize: size,
              contentRect: target.getBoundingClientRect(),
            },
          ],
          this,
        ),
      )
    }
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('ResizeObserver', FakeObserver)
}
