import { use } from 'react'
import type { GroupsPort } from '@/shared/api/groups'
import { Context } from './context'

/** The groups' port given by `GroupsProvider`. */
export function useGroups(): GroupsPort {
  const groups = use(Context)
  if (!groups) throw new Error('useGroups needs a GroupsProvider')
  return groups
}
