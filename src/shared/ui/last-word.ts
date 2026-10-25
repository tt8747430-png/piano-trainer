/**
 * A name parted before its last word: what goes with it on a line (an ⓘ) never stands alone at the
 * next line's start. A name of one word is all last word.
 */
export function lastWord(name: string): { readonly head: string; readonly last: string } {
  const trimmed = name.trim()
  const at = trimmed.lastIndexOf(' ')
  return at < 0
    ? { head: '', last: trimmed }
    : { head: trimmed.slice(0, at), last: trimmed.slice(at + 1) }
}
