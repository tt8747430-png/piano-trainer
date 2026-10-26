import { createContext } from 'react'

/**
 * What floats or stands round the Player's music and is in sight now: the transport, which a tap on
 * the free room shows or hides; and the bar with the tools row under it, which step aside while
 * Diagrams plays (ADR 0102).
 */
export const ChromeShownContext = createContext({ dock: true, bar: true })
