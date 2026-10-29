import type { ReactNode } from 'react'
import type { PublicLibrary } from '@/shared/api/public-library'
import { Context } from './context'

/** The Public library the screens read and publish to (ADR 0116): the project's, or a test's fake. */
export function PublicLibraryProvider({
  library,
  children,
}: {
  library: PublicLibrary
  children: ReactNode
}) {
  return <Context value={library}>{children}</Context>
}
