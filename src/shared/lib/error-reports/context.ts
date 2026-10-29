import { createContext } from 'react'

export const Context = createContext<((thrown: unknown, path: string) => void) | null>(null)
