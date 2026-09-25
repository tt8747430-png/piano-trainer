/**
 * Text as search compares it: lower case, without accents, so ё reads as е. Russian й is a letter
 * of its own, not и with an accent, so the breve after и stays (and recomposes into й).
 */
export const foldText = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/(?<![иИ])̆|(?!̆)\p{M}/gu, '')
    .normalize('NFC')
    .toLowerCase()

/** Whether any field holds the query; a blank query matches everything. */
export function matchesQuery(fields: readonly string[], query: string): boolean {
  const wanted = foldText(query.trim())
  return wanted === '' || fields.some((field) => foldText(field).includes(wanted))
}
