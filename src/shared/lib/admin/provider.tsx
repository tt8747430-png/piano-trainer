import type { ReactNode } from 'react'
import type { AdminPort } from '@/shared/api/admin'
import { Context } from './context'

/** The admin's tools the Admin area uses (ADR 0116): the project's, or a test's fake. */
export function AdminProvider({ admin, children }: { admin: AdminPort; children: ReactNode }) {
  return <Context value={admin}>{children}</Context>
}
