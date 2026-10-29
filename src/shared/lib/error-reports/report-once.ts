import type { ErrorReporter } from '@/shared/api/errors'

/** The most a run reports: past it, a loop of errors sends nothing more. */
export const REPORTS_A_RUN = 10

/** What was thrown, read: an Error's message and stack, anything else by what it says. */
function readThrown(thrown: unknown): { message: string; stack: string } {
  if (thrown instanceof Error) return { message: thrown.message, stack: thrown.stack ?? '' }
  return { message: String(thrown), stack: '' }
}

/** Reports to `port` each thing thrown once a run (by its message), at most `REPORTS_A_RUN`. */
export function reportOnce(port: ErrorReporter): (thrown: unknown, path: string) => void {
  const seen = new Set<string>()
  return (thrown, path) => {
    const { message, stack } = readThrown(thrown)
    if (seen.has(message) || seen.size >= REPORTS_A_RUN) return
    seen.add(message)
    port.report({ message, stack, path })
  }
}
