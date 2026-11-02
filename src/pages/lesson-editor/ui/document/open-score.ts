import { createContext } from 'react'

/**
 * Opens a lesson's example of notes on its own score (round 27), by its place among the lesson's
 * examples of notes: the draft saved first. None where the document is not a lesson's.
 */
export const OpenScore = createContext<((at: number) => void) | null>(null)
