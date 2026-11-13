/**
 * Text as search compares it: lower case, without accents, so ё reads as е. Russian й is a letter
 * of its own, not и with an accent, so the breve after и stays (and recomposes into й). Printed
 * accidentals read as typed ones, so C7#9 finds C7♯9 and Bb finds B♭.
 */
export const foldText = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/(?<![иИ])̆|(?!̆)\p{M}/gu, '')
    .normalize('NFC')
    .replaceAll('♯', '#')
    .replaceAll('♭', 'b')
    .toLowerCase()

/** Where a word of a name starts: after a space or a mark between words. */
export const WORD_BREAK = /[\s\-–—·,.:;()/«»"“”]+/

/**
 * Whether the fields hold every word of the query, in any order and any field, whatever lies
 * between them («Боже спасибо» finds «Боже, спасибо»); a blank query matches everything.
 */
export function matchesQuery(fields: readonly string[], query: string): boolean {
  const words = foldText(query)
    .split(WORD_BREAK)
    .filter((word) => word !== '')
  const folded = fields.map(foldText)
  return words.every((word) => folded.some((field) => field.includes(word)))
}
