/**
 * A chart line's bars cut into lines of the sheet (ADR 0074), as an engraver breaks a system: as few
 * lines as hold them in `room`, then as even as they come by width, so a line is never a full one
 * over a stub (abcjs's `wrap`, LilyPond's optimal breaker). Where widths tie, the earlier line takes
 * more. A bar wider than the room stands alone; the room unknown, they all stand on one line.
 * Returns how many bars each line holds.
 */
export function breakLine(widths: readonly number[], room: number): number[] {
  const n = widths.length
  if (n === 0) return []
  if (!Number.isFinite(room)) return [n]
  const sum = (from: number, to: number) => {
    let total = 0
    for (let i = from; i < to; i++) total += widths[i] ?? 0
    return total
  }
  const fits = (from: number, to: number) => to - from === 1 || sum(from, to) <= room
  // As few lines as hold them: filled greedily, as many as fit on each.
  let count = 0
  for (let at = 0; at < n; count++) {
    let to = at + 1
    while (to < n && fits(at, to + 1)) to++
    at = to
  }
  // Of those cuts, the one whose widest line is narrowest: best[j][i] for the first i bars on j lines.
  const best = Array.from({ length: count + 1 }, () => new Array<number>(n + 1).fill(Infinity))
  const cut = Array.from({ length: count + 1 }, () => new Array<number>(n + 1).fill(0))
  ;(best[0] as number[])[0] = 0
  for (let j = 1; j <= count; j++) {
    const row = best[j] as number[]
    const before = best[j - 1] as number[]
    for (let i = 1; i <= n; i++) {
      // The last line's start latest first, so a tie leaves the earlier lines fuller.
      for (let from = i - 1; from >= j - 1; from--) {
        if (!fits(from, i)) continue
        const worst = Math.max(before[from] ?? Infinity, sum(from, i))
        if (worst < (row[i] ?? Infinity)) {
          row[i] = worst
          ;(cut[j] as number[])[i] = from
        }
      }
    }
  }
  const sizes: number[] = []
  for (let j = count, i = n; j > 0; j--) {
    const from = (cut[j] as number[])[i] ?? 0
    sizes.unshift(i - from)
    i = from
  }
  return sizes
}
