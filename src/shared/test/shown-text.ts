/**
 * What an element shows the eye, in order: its text and its glyphs (`Glyph`, drawn by CSS, which jsdom
 * does not lay out), as `textContent` would read them were they text.
 */
export function shownText(element: Element): string {
  return [...element.childNodes]
    .map((node) =>
      node instanceof Element
        ? node.hasAttribute('data-glyph')
          ? (node.getAttribute('data-glyph') ?? '')
          : shownText(node)
        : (node.textContent ?? ''),
    )
    .join('')
}
