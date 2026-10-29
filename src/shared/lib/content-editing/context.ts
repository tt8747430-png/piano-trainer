import { createContext } from 'react'
import type { ContentEditingPort } from '@/shared/api/content-editing'

export const Context = createContext<ContentEditingPort | null>(null)
