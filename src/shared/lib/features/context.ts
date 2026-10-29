import { createContext } from 'react'

/** The feature switches on for whoever is signed in; empty until known. */
export const Context = createContext<ReadonlySet<string>>(new Set())
