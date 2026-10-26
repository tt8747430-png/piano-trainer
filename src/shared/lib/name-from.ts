/**
 * A name made from another's within `max` characters, `wrap` putting it in ("Waltz (mine)",
 * "Sunday (copy)"): where the whole would be too long, the other's name shortened at a word, with an
 * ellipsis.
 */
export function nameFrom(name: string, wrap: (name: string) => string, max: number): string {
  const whole = wrap(name)
  if (whole.length <= max) return whole
  const room = max - wrap('').length - 1
  const cut = name.slice(0, room)
  const atWord = name[room] === ' ' || !cut.includes(' ') ? cut : cut.slice(0, cut.lastIndexOf(' '))
  return wrap(`${atWord.trimEnd()}…`)
}
