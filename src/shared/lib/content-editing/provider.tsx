import type { ReactNode } from 'react'
import type { ContentEditingPort } from '@/shared/api/content-editing'
import { Context } from './context'

/** Editing the built-in content (ADR 0116, round 6): the project's, or a test's fake. */
export function ContentEditingProvider({
  editing,
  children,
}: {
  editing: ContentEditingPort
  children: ReactNode
}) {
  return <Context value={editing}>{children}</Context>
}
