import { use } from 'react'
import { Context } from './context'

/** Reports what was thrown, and where; nothing outside an `ErrorReportsProvider`. */
export function useReportError(): (thrown: unknown, path: string) => void {
  return use(Context) ?? (() => undefined)
}
