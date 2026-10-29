import type { Account } from '@/shared/api/auth'

/** Whether the account edits the built-in content (ADR 0116): an editor's or an admin's. */
export const editsContent = (account: Account | null): boolean =>
  account?.role === 'editor' || account?.role === 'admin'
