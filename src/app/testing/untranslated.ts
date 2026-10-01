import { i18n } from '@/shared/i18n'

/** Every string leaf of a namespace's bundle, by its key path. */
function leaves(value: unknown, path = ''): [string, string][] {
  if (typeof value === 'string') return [[path, value]]
  if (typeof value !== 'object' || value === null) return []
  return Object.entries(value).flatMap(([key, child]) =>
    leaves(child, path ? `${path}.${key}` : key),
  )
}

/** The English interface strings whose Russian differs: one of them on a Russian screen was left in English. */
function englishOnly(): ReadonlySet<string> {
  const english = new Set<string>()
  for (const ns of i18n.options.ns ?? []) {
    const ru = new Map(leaves(i18n.getResourceBundle('ru', ns)))
    for (const [key, text] of leaves(i18n.getResourceBundle('en', ns))) {
      if (ru.get(key) !== text && !text.includes('{{') && /[a-z]{3}/i.test(text)) english.add(text)
    }
  }
  return english
}

/** An i18next key written out where its text should be: `quality.n13`, `music:key.label`. */
const RAW_KEY = /^[a-z]+(:[a-zA-Z]+)?(\.[a-zA-Z0-9]+)+$/

/**
 * What a Russian screen shows that is not Russian: an i18next key that found no text, or an English
 * interface string (in text, or in an accessible name, title or placeholder).
 */
export function untranslated(root: HTMLElement): string[] {
  const english = englishOnly()
  const texts: string[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent?.trim()
    if (text) texts.push(text)
  }
  for (const element of root.querySelectorAll('[aria-label], [title], [placeholder]')) {
    for (const name of ['aria-label', 'title', 'placeholder']) {
      const text = element.getAttribute(name)?.trim()
      if (text) texts.push(text)
    }
  }
  return [...new Set(texts.filter((text) => RAW_KEY.test(text) || english.has(text)))]
}
