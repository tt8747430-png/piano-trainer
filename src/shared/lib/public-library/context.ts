import { createContext } from 'react'
import type { PublicLibrary } from '@/shared/api/public-library'

export const Context = createContext<PublicLibrary | null>(null)
