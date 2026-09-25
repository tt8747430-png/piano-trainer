import { createContext } from 'react'
import type { Services } from './types'

export const ServicesContext = createContext<Services | null>(null)
ServicesContext.displayName = 'ServicesContext'
