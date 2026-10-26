/**
 * The name a new thing is offered (Mindscape's `nextDefaultName`): `base` while no other has it,
 * else `base 2`, `base 3`, the first free, compared without case or the spaces round it.
 */
export function nextName(base: string, taken: readonly string[]): string {
  const used = new Set(taken.map((name) => name.trim().toLocaleLowerCase()))
  if (!used.has(base.toLocaleLowerCase())) return base
  let n = 2
  while (used.has(`${base} ${n}`.toLocaleLowerCase())) n += 1
  return `${base} ${n}`
}
