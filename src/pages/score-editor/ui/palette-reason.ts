import { createContext, use } from 'react'

/**
 * Why the palette's section around a key greys its tools where the caret is (no note chosen, not a
 * hand's staff), for each greyed key to say in its tooltip (ADR 0096); none where they work.
 */
export const PaletteReason = createContext<string | undefined>(undefined)

/** Why the section around greys its keys, where it does. */
export const usePaletteReason = (): string | undefined => use(PaletteReason)
