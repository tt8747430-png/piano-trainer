/**
 * Whether a key written with no mode (a MusicXML `<key>` without `<mode>`) is the signature's minor
 * (R29 A28): a C♯-minor file read as E major named every key wrong. The title decides where it names
 * the mode ("in C♯ minor", "moll", "минор", "major", "dur", "мажор"); else the music: the lowest note
 * of the first bar and of the last on the minor's tonic (or the first on its 5th), and its raised 7th
 * (B♯ in C♯ minor), at least two of these three.
 */
export function inferMinor(
  fifths: number,
  notes: readonly { readonly midi: number; readonly startTick: number }[],
  {
    firstBarEnd,
    lastBarStart,
    title,
  }: { firstBarEnd: number; lastBarStart: number; title?: string | undefined },
): boolean {
  const named = title?.toLowerCase() ?? ''
  if (/\bminor\b|moll\b|минор/u.test(named)) return true
  if (/\bmajor\b|dur\b|мажор/u.test(named)) return false
  // The major key's tonic, a fifth up per sharp from C; its relative minor a minor 3rd under it.
  const major = (((fifths * 7) % 12) + 12) % 12
  const minor = (major + 9) % 12
  const fifth = (minor + 7) % 12
  const leading = (minor + 11) % 12
  const lowest = (from: number, to: number) => {
    const inside = notes.filter((note) => note.startTick >= from && note.startTick < to)
    return inside.length > 0 ? Math.min(...inside.map((note) => note.midi)) % 12 : undefined
  }
  const first = lowest(0, firstBarEnd)
  const last = lowest(lastBarStart, Number.POSITIVE_INFINITY)
  const signs = [
    first === minor || first === fifth,
    last === minor,
    notes.some((note) => note.midi % 12 === leading),
  ]
  return signs.filter(Boolean).length >= 2
}
