/** The pieces opened in the Player, latest first: ids by their last opening's ISO date. */
export function byLastOpened(practised: Readonly<Partial<Record<string, string>>>): string[] {
  return Object.entries(practised)
    .flatMap(([id, at]) => (at === undefined ? [] : [{ id, at: Date.parse(at) }]))
    .sort((a, b) => b.at - a.at)
    .map(({ id }) => id)
}
