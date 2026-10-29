import { APP_BUILD } from '@/shared/config'
import type { Backend } from '../supabase'
import type { ErrorReporter } from './types'

const cut = (text: string, most: number) => text.slice(0, most)

/** Reports into the project's `error_reports` (ADR 0116): its fields cut to what the table takes. */
export function createSupabaseErrorReporter(backend: Backend): ErrorReporter {
  return {
    report: ({ message, stack, path }) => {
      void backend()
        .then((client) =>
          client.from('error_reports').insert({
            message: cut(message || 'Unknown error', 1000),
            stack: cut(stack, 8000),
            path: cut(path, 500),
            build: cut(APP_BUILD, 100),
            agent: cut(navigator.userAgent, 500),
          }),
        )
        .then(
          () => undefined,
          () => undefined,
        )
    },
  }
}
