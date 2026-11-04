/** G3 and F4: under the one the upper staff's notes read low, over the other the lower staff's high. */
const G3 = 55
const F4 = 65
/** How many of a staff's notes must sit off it before its clef changes. */
const MOST = 0.7

/**
 * The clef a piano staff is written in for its notes (A34): the upper staff keeps the treble unless
 * at least 70% of its notes are below G3, the lower staff the bass unless at least 70% are above F4.
 * A pattern's right hand sitting low is still read in the treble clef.
 */
export function clefFor(
  notes: readonly { readonly midi: number }[],
  staff: 'upper' | 'lower',
): 'treble' | 'bass' {
  const home = staff === 'upper' ? 'treble' : 'bass'
  if (notes.length === 0) return home
  const off = notes.filter((n) => (staff === 'upper' ? n.midi < G3 : n.midi > F4)).length
  if (off / notes.length < MOST) return home
  return staff === 'upper' ? 'bass' : 'treble'
}
