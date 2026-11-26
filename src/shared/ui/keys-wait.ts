import { createContext } from 'react'

/**
 * Why the keys inside cannot act now ("Select one or more notes first."), for a palette's section
 * that waits on a choice: each key in it greys in place and says so in its tooltip (Flat's rule).
 */
export const KeysWait = createContext<string | null>(null)
