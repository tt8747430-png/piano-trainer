import { createContext } from 'react'
import type { GroupsPort } from '@/shared/api/groups'

export const Context = createContext<GroupsPort | null>(null)
