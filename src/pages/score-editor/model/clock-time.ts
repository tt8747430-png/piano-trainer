/** A length of time as a clock writes it: whole minutes and seconds, `1:05`. */
export function clockTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
