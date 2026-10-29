/**
 * A name as an id fit for a URL: lower case, letters and digits of any script, words joined by
 * hyphens, the marks over Latin letters dropped; `fallback` for a name with none; numbered from 2 where `taken` has it.
 */
export function slug(name: string, taken: Iterable<string> = [], fallback = 'untitled'): string {
  const base =
    name
      .normalize('NFKD')
      .replace(/(\p{Script=Latin})\p{M}+/gu, '$1')
      .normalize('NFC')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '') || fallback
  const used = new Set(taken)
  if (!used.has(base)) return base
  let n = 2
  while (used.has(`${base}-${n}`)) n += 1
  return `${base}-${n}`
}
