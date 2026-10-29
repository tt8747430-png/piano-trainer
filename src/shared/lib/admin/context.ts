import { createContext } from 'react'
import type { AdminPort } from '@/shared/api/admin'

export const Context = createContext<AdminPort | null>(null)
