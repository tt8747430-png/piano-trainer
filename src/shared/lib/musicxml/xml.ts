// A small XML reader and writer: what a MusicXML file needs, with no DOM, so it reads the same in
// a test as in the browser.

/** An element: its name, its attributes and what it holds, elements and text in order. */
export interface XmlElement {
  readonly name: string
  readonly attrs: Readonly<Record<string, string>>
  readonly children: readonly (XmlElement | string)[]
}

/** Text that is no XML: the file broken, or another kind of file. */
export class XmlError extends Error {
  override readonly name = 'XmlError'
}

const NAMED: Readonly<Record<string, string>> = {
  lt: '<',
  gt: '>',
  amp: '&',
  quot: '"',
  apos: "'",
}

/** Text with its entities read: `&amp;` as &, `&#233;` as é. */
function unescape(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, name: string) => {
    if (name.startsWith('#x') || name.startsWith('#X'))
      return String.fromCodePoint(Number.parseInt(name.slice(2), 16))
    if (name.startsWith('#')) return String.fromCodePoint(Number.parseInt(name.slice(1), 10))
    return NAMED[name] ?? whole
  })
}

const NAME = /[A-Za-z_:][-\w.:]*/y
const SPACE = /\s*/y
const ATTR = /([A-Za-z_:][-\w.:]*)\s*=\s*("([^"]*)"|'([^']*)')/y

/**
 * An XML document's root element. Comments, processing instructions and the doctype are passed over;
 * CDATA is text. Throws an XmlError where the text is not well formed.
 */
export function parseXml(text: string): XmlElement {
  let at = 0
  const fail = (what: string): never => {
    throw new XmlError(`${what} at ${at}`)
  }
  const skip = (open: string, close: string) => {
    const end = text.indexOf(close, at + open.length)
    if (end < 0) fail(`Unclosed ${open}`)
    at = end + close.length
  }
  /** Passes over a doctype, its internal subset in brackets included. */
  const skipDoctype = () => {
    let depth = 0
    for (; at < text.length; at += 1) {
      const char = text[at]
      if (char === '[') depth += 1
      else if (char === ']') depth -= 1
      else if (char === '>' && depth === 0) {
        at += 1
        return
      }
    }
    fail('Unclosed doctype')
  }
  /** Passes over what may stand between elements: comments, instructions, the doctype. */
  const skipMisc = (): boolean => {
    if (text.startsWith('<!--', at)) skip('<!--', '-->')
    else if (text.startsWith('<?', at)) skip('<?', '?>')
    else if (text.startsWith('<!DOCTYPE', at) || text.startsWith('<!doctype', at)) skipDoctype()
    else return false
    return true
  }
  const name = (): string => {
    NAME.lastIndex = at
    const match = NAME.exec(text)
    if (!match) return fail('Expected a name')
    at = NAME.lastIndex
    return match[0]
  }
  const space = () => {
    SPACE.lastIndex = at
    SPACE.exec(text)
    at = SPACE.lastIndex
  }
  const element = (): XmlElement => {
    at += 1 // <
    const tag = name()
    const attrs: Record<string, string> = {}
    for (;;) {
      space()
      if (text.startsWith('/>', at)) {
        at += 2
        return { name: tag, attrs, children: [] }
      }
      if (text[at] === '>') {
        at += 1
        break
      }
      ATTR.lastIndex = at
      const match = ATTR.exec(text)
      if (!match?.[1]) return fail(`Broken attribute in <${tag}>`)
      attrs[match[1]] = unescape(match[3] ?? match[4] ?? '')
      at = ATTR.lastIndex
    }
    const children: (XmlElement | string)[] = []
    for (;;) {
      if (at >= text.length) return fail(`Unclosed <${tag}>`)
      if (text.startsWith('</', at)) {
        at += 2
        const closing = name()
        if (closing !== tag) fail(`</${closing}> closes <${tag}>`)
        space()
        if (text[at] !== '>') fail(`Broken </${tag}>`)
        at += 1
        return { name: tag, attrs, children }
      }
      if (text.startsWith('<![CDATA[', at)) {
        const end = text.indexOf(']]>', at)
        if (end < 0) fail('Unclosed CDATA')
        children.push(text.slice(at + 9, end))
        at = end + 3
      } else if (skipMisc()) {
        continue
      } else if (text[at] === '<') {
        children.push(element())
      } else {
        const end = text.indexOf('<', at)
        const run = text.slice(at, end < 0 ? text.length : end)
        if (run.trim() !== '') children.push(unescape(run))
        at = end < 0 ? text.length : end
      }
    }
  }
  // A byte-order mark, then what may come before the root.
  if (text.charCodeAt(0) === 0xfeff) at = 1
  for (;;) {
    space()
    if (!skipMisc()) break
  }
  if (text[at] !== '<') fail('No root element')
  return element()
}

/** An element's children of a name, in order. */
export const childrenOf = (element: XmlElement, name: string): XmlElement[] =>
  element.children.filter(
    (child): child is XmlElement => typeof child !== 'string' && child.name === name,
  )

/** An element's first child of a name. */
export const childOf = (element: XmlElement, name: string): XmlElement | undefined =>
  childrenOf(element, name)[0]

/** Every element a path of names reaches: `childAt(score, 'work', 'work-title')`. */
export function childAt(element: XmlElement, ...path: string[]): XmlElement | undefined {
  let at: XmlElement | undefined = element
  for (const name of path) at = at && childOf(at, name)
  return at
}

/** An element's text, its own and its children's, trimmed. */
export const textOf = (element: XmlElement | undefined): string =>
  element === undefined
    ? ''
    : element.children
        .map((child) => (typeof child === 'string' ? child : textOf(child)))
        .join('')
        .trim()

/** The text a path of names reaches, or none. */
export const textAt = (element: XmlElement, ...path: string[]): string | undefined => {
  const found = childAt(element, ...path)
  return found ? textOf(found) : undefined
}

/** A number a path of names holds, or none. */
export const numberAt = (element: XmlElement, ...path: string[]): number | undefined => {
  const text = textAt(element, ...path)
  if (text === undefined || text === '') return undefined
  const value = Number(text)
  return Number.isFinite(value) ? value : undefined
}

/** Text as XML writes it, inside an element or an attribute. */
export const escapeXml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

/** One element as XML: `tag('step', {}, 'C')`, its attributes in order, empty as `<tag/>`. */
export function tag(
  name: string,
  attrs: Readonly<Record<string, string | number | undefined>> = {},
  ...body: readonly string[]
): string {
  const written = Object.entries(attrs)
    .filter((entry): entry is [string, string | number] => entry[1] !== undefined)
    .map(([key, value]) => ` ${key}="${escapeXml(String(value))}"`)
    .join('')
  const inside = body.join('')
  return inside === '' ? `<${name}${written}/>` : `<${name}${written}>${inside}</${name}>`
}

/** An element holding text alone: `text('step', 'C')`. */
export const text = (name: string, value: string | number): string =>
  `<${name}>${escapeXml(String(value))}</${name}>`
