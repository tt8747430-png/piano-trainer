/** What went wrong, where: a screen's error or an uncaught one. */
export interface ErrorReport {
  readonly message: string
  readonly stack: string
  /** The app's path when it happened. */
  readonly path: string
}

/**
 * Where errors are reported (ADR 0116, round 7): fire and forget, never throwing and never said to
 * the learner; a report that does not go through is dropped.
 */
export interface ErrorReporter {
  report(report: ErrorReport): void
}
