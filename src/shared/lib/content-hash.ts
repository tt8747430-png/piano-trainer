/** One 32-bit FNV-1a pass over `text` from `seed`. */
function fnv1a(text: string, seed: number): number {
  let hash = seed
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

const hex = (n: number) => n.toString(16).padStart(8, '0')

/**
 * A content item's version, from what it holds: two FNV-1a passes, sixteen hex digits. Not a secret:
 * only a change of content must change it.
 */
export const contentHash = (text: string): string =>
  hex(fnv1a(text, 0x811c9dc5)) + hex(fnv1a(text, 0x01000193 ^ 0x9e3779b9))
