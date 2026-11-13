/**
 * The lessons a lesson asks for, by number, worth saying beside it: none where it asks only for the
 * lesson before it, which the line of lessons already shows.
 */
export function afterWorthSaying(after: readonly number[], number: number): readonly number[] {
  return after.length === 1 && after[0] === number - 1 ? [] : after
}
