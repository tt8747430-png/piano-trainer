import { useState, type ReactNode } from 'react'
import type { ErrorReporter } from '@/shared/api/errors'
import { Context } from './context'
import { reportOnce } from './report-once'

/** Where what went wrong is reported (ADR 0116): the project's, or a test's fake; each once a run. */
export function ErrorReportsProvider({
  reporter,
  children,
}: {
  reporter: ErrorReporter
  children: ReactNode
}) {
  const [report] = useState(() => reportOnce(reporter))
  return <Context value={report}>{children}</Context>
}
