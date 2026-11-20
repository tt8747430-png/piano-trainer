import type { AdminAccount } from '@/shared/api/admin'

/** What an account is called: its name, else its email. */
export const nameOf = (account: AdminAccount) => account.name.trim() || account.email
