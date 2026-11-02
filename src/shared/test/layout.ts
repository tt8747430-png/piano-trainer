import { onTestFinished, vi } from 'vitest'

/** jsdom lays nothing out: gives an element the box a pointer's position is read against. */
export function stubBox(
  element: Element,
  {
    left = 0,
    top = 0,
    width,
    height,
  }: { left?: number; top?: number; width: number; height: number },
) {
  const box: DOMRect = {
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({ left, top, width, height }),
  }
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(box)
}

/**
 * jsdom lays nothing out: for this test every element is `clientWidth` wide and holds
 * `scrollWidth`, keeps the scroll position it is given, and scrolls with a `scrollTo` that fires
 * `scroll`. Returns each position scrolled to.
 */
export function stubScrolling({
  clientWidth,
  scrollWidth,
}: {
  clientWidth: number
  scrollWidth: number
}) {
  const positions = new WeakMap<Element, number>()
  const scrolls: number[] = []
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(clientWidth)
  vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockReturnValue(scrollWidth)
  vi.spyOn(Element.prototype, 'scrollLeft', 'get').mockImplementation(function (this: Element) {
    return positions.get(this) ?? 0
  })
  vi.spyOn(Element.prototype, 'scrollLeft', 'set').mockImplementation(function (
    this: Element,
    left: number,
  ) {
    positions.set(this, left)
    // As a browser does, scrolled by a script or a finger.
    this.dispatchEvent(new Event('scroll'))
  })
  Object.defineProperty(Element.prototype, 'scrollTo', {
    configurable: true,
    value(this: Element, options: ScrollToOptions) {
      const left = options.left ?? 0
      scrolls.push(left)
      positions.set(this, left)
      this.dispatchEvent(new Event('scroll'))
    },
  })
  onTestFinished(() => void Reflect.deleteProperty(Element.prototype, 'scrollTo'))
  return { scrolls }
}

/**
 * jsdom lays out no text: for this test a range has no boxes, so an editor's caret (ProseMirror's
 * `coordsAtPos`, its scrolling to the selection) reads as at the page's corner.
 */
export function stubTextLayout() {
  const proto = Range.prototype as Partial<Pick<Range, 'getClientRects' | 'getBoundingClientRect'>>
  const own = { rects: proto.getClientRects, box: proto.getBoundingClientRect }
  const empty = (): DOMRect => ({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    right: 0,
    bottom: 0,
    toJSON: () => ({}),
  })
  proto.getClientRects = () => Object.assign([], { item: () => null }) as unknown as DOMRectList
  proto.getBoundingClientRect = empty
  onTestFinished(() => {
    if (own.rects) proto.getClientRects = own.rects
    else delete proto.getClientRects
    if (own.box) proto.getBoundingClientRect = own.box
    else delete proto.getBoundingClientRect
  })
}
