import { useEffect } from 'react'
import { useReportError } from '@/shared/lib/error-reports'

/** Reports what is thrown and never caught, and promises rejected unheard, from anywhere in the app. */
export function ErrorListener() {
  const report = useReportError()
  useEffect(() => {
    const stopped = new AbortController()
    const path = () => window.location.pathname
    window.addEventListener('error', (event) => report(event.error ?? event.message, path()), {
      signal: stopped.signal,
    })
    window.addEventListener('unhandledrejection', (event) => report(event.reason, path()), {
      signal: stopped.signal,
    })
    return () => stopped.abort()
  }, [report])
  return null
}
