import { createContext, use } from 'react'

/**
 * Whether the field typed in stands docked as a slim bar over the phone's own keyboard, in the
 * palette sheet's place (ADR 0114, Flat's phone), rather than at the place the sheet drew for it.
 */
export const FieldDocked = createContext(false)

/** Whether the field around is docked over the phone's keyboard. */
export const useFieldDocked = (): boolean => use(FieldDocked)
