import { vi } from 'vitest'

/**
 * A controllable `IntersectionObserver` for jsdom, which has none and lays nothing out. With
 * `visible`, every element observed is on screen at once; otherwise none is until `show` brings all
 * the observed ones into view, as a scroll would.
 */
export function stubIntersectionObserver({ visible }: { visible: boolean }) {
  const observers = new Set<FakeObserver>()

  class FakeObserver implements IntersectionObserver {
    readonly root = null
    readonly rootMargin = '0px'
    readonly thresholds = [0]
    readonly scrollMargin = '0px'
    readonly elements = new Set<Element>()
    constructor(private readonly callback: IntersectionObserverCallback) {
      observers.add(this)
    }
    observe(element: Element) {
      this.elements.add(element)
      if (visible) queueMicrotask(() => this.report([element]))
    }
    unobserve(element: Element) {
      this.elements.delete(element)
    }
    disconnect() {
      this.elements.clear()
      observers.delete(this)
    }
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
    report(elements: Iterable<Element>) {
      const entries = [...elements].map((target) => ({
        target,
        isIntersecting: true,
        intersectionRatio: 1,
        time: 0,
        boundingClientRect: target.getBoundingClientRect(),
        intersectionRect: target.getBoundingClientRect(),
        rootBounds: null,
      }))
      if (entries.length > 0) this.callback(entries, this)
    }
  }

  vi.stubGlobal('IntersectionObserver', FakeObserver)
  return {
    /** Every element observed comes into view. */
    show() {
      for (const observer of [...observers]) observer.report([...observer.elements])
    },
  }
}
