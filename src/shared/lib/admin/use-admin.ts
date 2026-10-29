import { use } from 'react'
import type { AdminPort } from '@/shared/api/admin'
import { Context } from './context'

export function useAdmin(): AdminPort {
  const admin = use(Context)
  if (!admin) throw new Error('useAdmin needs an AdminProvider')
  return admin
}
