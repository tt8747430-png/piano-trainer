import { createContext } from 'react'
import type { ChordSharePort } from '@/shared/api/chord-share'

export const Context = createContext<ChordSharePort | null>(null)
