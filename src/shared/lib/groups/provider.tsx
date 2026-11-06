import type { ReactNode } from 'react'
import type { GroupsPort } from '@/shared/api/groups'
import { Context } from './context'

/** The learner's groups on the server (R30 S6), for the screens that read and change them. */
export function GroupsProvider({ groups, children }: { groups: GroupsPort; children: ReactNode }) {
  return <Context value={groups}>{children}</Context>
}
