import type { ErrorReport, ErrorReporter } from './types'

/** Reports kept in memory for tests, in the order sent. */
export function createFakeErrorReporter(): ErrorReporter & {
  readonly sent: readonly ErrorReport[]
} {
  const sent: ErrorReport[] = []
  return { sent, report: (report) => void sent.push(report) }
}
